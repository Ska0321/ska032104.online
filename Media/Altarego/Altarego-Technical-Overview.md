# Altarego — Technical & Product Overview
### Prepared for Senior Advisor Presentation · Conscience.ai · April 2026

---

## 1. Executive Summary

**Altarego** is an AI-native iOS application that helps users develop deep self-awareness through structured psychological reflection, adaptive training, and a continuously learning personal AI companion. Over time, the app builds a *digital twin* — a structured psychological portrait derived entirely from the user's own words and choices — that can speak back to them as a "mirror" persona, or be exported as a portable identity package for use in any LLM.

The product sits at the intersection of **consumer mental wellness**, **applied AI**, and **personal identity infrastructure**. It is designed from the ground up to be private-by-default, operating primarily on-device using Apple's FoundationModels framework, with cloud AI providers available as opt-in upgrades.

---

## 2. Product Vision & Core Experience

### The Problem
Most self-help tools give users generic content. AI chatbots don't remember who you are. Journaling apps don't synthesize patterns. The user is always starting over.

### The Solution
Altarego builds a longitudinal model of the user — their beliefs, patterns, contradictions, and aspirations — from every interaction. The app has three primary modes:

| Mode | Purpose |
|------|---------|
| **MIND (Companion)** | Open conversation with a companion AI that knows your personality |
| **TRAIN** | Structured belief-mapping through tappable psychological questions |
| **MIRROR (Persona)** | Conversation with your AI-generated digital twin |

Over time, a fourth output emerges: the **Soul Package** — a portable, LLM-ready psychological profile that encodes who you are.

---

## 3. Technical Architecture

### 3.1 Platform & Language Stack

| Layer | Technology |
|-------|-----------|
| Platform | iOS 26 |
| Language | Swift 6.2 (strict concurrency) |
| UI Framework | SwiftUI + Liquid Glass design system |
| Storage | SwiftData (multi-schema migration, SchemaV1–V7) |
| On-device AI | Apple FoundationModels (`LanguageModelSession`) |
| Cloud AI | Groq, Gemini Flash, OpenAI, Claude Haiku (user-selectable) |
| Auth | Apple Sign In, Google Sign-In, FaceID/TouchID biometric lock |
| Encryption | AES-256-GCM + PBKDF2-SHA256 (CommonCrypto) |
| Keychain | `kSecAttrAccessibleWhenUnlockedThisDeviceOnly` |

### 3.2 Concurrency Model
The entire app is written to Swift 6.2's strict concurrency rules:
- All UI-facing types are `@MainActor`-isolated
- `@Observable` macro replaces `ObservableObject` — zero `@Published` boilerplate
- `actor`-isolated types (e.g. `EngineRegistryClient`) protect shared mutable state
- `@unchecked Sendable` used sparingly and documented
- `nonisolated` delegate methods use `MainActor.assumeIsolated` where UIKit guarantees main-thread delivery

### 3.3 SwiftData Schema
Seven schema versions with incremental migrations:

| Version | Key Additions |
|---------|--------------|
| V1 | `UserProfile`, `BeliefSnapshot`, `TrainingQuestion`, `ProgressMilestone`, `ReflectionEntry` |
| V2–V3 | `GeneratedDailyPrompt`, `ReflectionMode` |
| V4 | `hopeStatement` on `UserProfile` (nullable migration) |
| V5 | `ConversationSummary` — compressed conversation windows |
| V6 | `PersonalityDimension` — continuous trait scoring (0–1) |
| V7 | `ExtractedMemory` + `PersonalityPattern` — structured fact and behavioral pattern storage |

All queries are scoped by `ownerID` — the opaque identifier from Apple/Google Sign In — ensuring complete data isolation between users who share a device.

---

## 4. AI Engine Architecture

### 4.1 Protocol-Driven Design

```swift
protocol AIEngineProtocol {
    func respond(to prompt: String, context: String) async throws -> String
}
```

Every AI provider implements this single protocol. The app never hard-codes a provider — it programs against the abstraction. This enables runtime swapping, A/B testing, and graceful degradation.

**Implementations:**
- `DialogueEngine` — Apple FoundationModels on-device (`LanguageModelSession`)
- `GroqEngine` — Groq API (Llama 3.x, extremely low latency)
- `GeminiFlashEngine` — Google Gemini Flash
- `OpenAIEngine` — GPT-4o / GPT-4o-mini
- `ClaudeHaikuEngine` — Anthropic Claude Haiku 3 (via REST)
- `FallbackAIEngine` — wraps any two engines; silently promotes to fallback on any primary failure

### 4.2 Engine Registry
`EngineRegistryClient` (actor-isolated) manages a remote-controlled engine manifest:
- Fetches `engine_manifest_fallback.json` from a remote CDN once per 24 hours
- Enforces a **64 KB response cap** before decoding — protects against payload amplification
- Validates `Content-Type: application/json` — rejects HTML error pages or unexpected formats
- Falls back to a bundled JSON manifest if the network is unavailable
- Supports `shutdownRequired` status — the server can remotely deprecate an engine and force migration
- Migrates legacy `selectedEngineType` UserDefaults key to the new manifest-based ID system

### 4.3 Fallback Chain
```
Apple FoundationModels (on-device, free, private)
    ↓ (any failure: unavailable device, simulator, not-enrolled)
Groq / Gemini Flash / OpenAI / Claude Haiku (user-configured cloud)
```

`FallbackAIEngine` catches **all** primary errors — including model unavailability and simulator environments where FoundationModels is not enrolled — ensuring the user always receives a response.

### 4.4 AIEngineSelector
Selects the active engine composition at app launch based on:
1. User's stored engine preference (from `EngineRegistryClient`)
2. API key presence in Keychain
3. Engine effective status from manifest

The selector builds the final `any AIEngineProtocol` and injects it into all ViewModels via dependency injection.

---

## 5. The Belief Engine & Training System

### 5.1 Question Format — Tappable Questions
Training questions are not text-entry prompts. They are structured response types that eliminate friction and enable precise belief mapping:

| Format | Description |
|--------|-------------|
| `binary` | Yes / No |
| `ab` | Choice between two options |
| `scale5` | 5-point Likert scale with custom poles |
| `scale10` | 10-point numeric scale |
| `choice` | Multiple choice (3–5 options) |

Each question has typed metadata: `dimension` (which psychological axis it maps to), `weight` (how strongly it updates the belief score), `poleMin`/`poleMax` labels, and `category` (relationships, identity, values, etc.).

All answer types are normalized to a `0.0–1.0` answerValue by `TapAnswer`, regardless of input format — enabling a unified belief update path.

### 5.2 BeliefEngine
The `BeliefEngine` translates tap answers into weighted `BeliefSnapshot` records in SwiftData:

1. Fetches the **current score** for the dimension using an indexed `FetchDescriptor` with `fetchLimit: 1` (O(log n), not O(n))
2. Applies a momentum-weighted update: `newScore = current + (normalizedAnswer − 0.5) × 2 × weight × 0.3`
3. Clamps to `[-1.0, 1.0]`
4. Persists as a new `BeliefSnapshot` with timestamp

This creates a time-series of every belief dimension — queryable for the Timeline view's charts.

### 5.3 Training Gap Analysis
`TrainingGapAnalyzer` identifies which psychological dimensions have the fewest answers and surfaces questions from those areas first. This prevents over-indexing on a user's initial preferences and ensures comprehensive coverage of the belief model.

### 5.4 Progression & Milestones
`TrainingRank` gamifies depth:

```
Bronze → Silver (10 answers) → Gold (25) → Platinum (50) → Diamond (100)
```

21 milestone templates trigger on four event types emitted by `AppEventBus`:
- `trainingAnswer` — question answered
- `dialogueSession` — companion conversation completed
- `synthesisCompleted` — personality dimensions computed
- `daysActive` — streak tracking

Milestones unlock with an animated overlay and are stored in `ProgressMilestone` (SwiftData).

---

## 6. The Memory Pipeline — Tiered Context Architecture

The most sophisticated subsystem in the app is its **tiered memory architecture**, which solves the fundamental problem of LLM context windows: you can't fit a person's entire history into every prompt.

### 6.1 Four Memory Tiers

```
Tier 0 (permanent):  hopeStatement — always first in every prompt, never truncated
Tier 1 (persistent): Personality context — beliefs, dimensions, portrait, patterns
Tier 2a (compressed): ConversationSummary — AI-compressed window records
Tier 2b (extracted): ExtractedMemory + PersonalityPattern — structured facts
Tier 3 (verbatim):  Last N raw message pairs — for conversational coherence
```

### 6.2 MemoryContextBuilder
Assembles the full system prompt for every AI call by combining tiers within a character budget (default: 8,000 chars):

1. Hope statement (always first, uncapped)
2. Personality context (beliefs + dimensions + portrait)
3. Extracted memories (highest-confidence facts first)
4. Behavioral patterns (most-observed first)
5. Conversation summaries (most recent last)
6. Verbatim recent messages (fills remaining budget)

If the budget is exceeded, lower-priority tiers are trimmed. The hope statement is **never** trimmed.

### 6.3 ConversationSummarizer
After every conversation, `ConversationSummarizer` checks if there are ≥20 new unsummarized messages (with 5 verbatim retained). If so, it:
1. Extracts messages from `nextSummarizeFrom` pointer to `count - retainVerbatim`
2. Sends them to the AI engine for compression into a paragraph summary
3. Saves the `ConversationSummary` to SwiftData
4. Advances `nextSummarizeFrom` pointer

The pointer approach was a critical correctness fix — naive modulo-based triggers re-summarized already-processed messages.

### 6.4 MemoryExtractionService
Every ~20 messages, the extraction service sends the conversation to the AI and asks it to identify:
- **Facts** — specific, verifiable claims ("user has a brother named Jack", "studied at UCL")
- **Patterns** — recurring behavioral tendencies ("deflects compliments", "catastrophizes")

Each fact is Levenshtein-tested against existing `ExtractedMemory` records to suppress near-duplicates (threshold: 85% similarity). Patterns are upserted with an `observedCount` increment.

**Performance:** Fetch memory/pattern lists once before the extraction loop — O(n + m) rather than the naive O(n²) per-item DB scan.

### 6.5 PersonalityContext
`PersonalityContext` assembles the Tier 1 prompt segment from SwiftData:
- Latest `BeliefSnapshot` per dimension (deduplicated)
- All `PersonalityDimension` scores
- `selfPortraitData` (the AI-authored first-person portrait from onboarding)
- `hopeStatement`

---

## 7. The Persona / Mirror System

### 7.1 PersonaEngine
The Mirror (Persona) mode wraps any `AIEngineProtocol` with a personality-injected system prompt:

```
You are [alias], responding authentically as this person.
[personality context from MemoryContextBuilder]
```

Key security properties:
- `alias` is sanitized before injection: newlines stripped, control characters removed, trimmed, truncated at 50 chars — prevents prompt injection
- Sessions are ephemeral — no persistence to SwiftData
- `PersonaReadinessChecker` gates access: requires ≥10 training answers and a computed belief model

### 7.2 PersonaReadinessChecker
Evaluates whether the model has enough data to produce a meaningful persona:
- Counts `BeliefSnapshot` records for the user
- Checks `PersonalityDimension` coverage
- Returns a readiness score and blocking message if below threshold

### 7.3 Mirror Chat UI
`PersonaChatViewModel` mirrors `DialogueViewModel` structurally:
- Typed message history with `.user` / `.mirror` roles
- Error handling removes the user's message on failure (prevents hanging unanswered bubbles)
- `mirrorName` parameter passes the user's chosen alias to every `PersonaChatBubble` — the sender label shows their name, not a hardcoded string

---

## 8. Soul Synthesis — The Digital Twin

### 8.1 What is a Soul Package?
A `SoulPackage` is a structured JSON export containing everything the app knows about the user:

```json
{
  "schemaVersion": "altarego-soul-v1",
  "exportedAt": "...",
  "profile": { "alias": "...", "hopeStatement": "...", "createdAt": "..." },
  "beliefs": [...],
  "dimensions": [...],
  "memories": [...],
  "patterns": [...],
  "conversationSummaries": [...],
  "portrait": "...",
  "twinActivationPrompt": "You are Alex. You believe..."
}
```

### 8.2 SoulSynthesizer
`SoulSynthesizer` compiles all memory layers and asks the AI engine to write a `twinActivationPrompt` — a 400–600 word system prompt that, when given to *any* LLM, allows it to speak authentically as the user.

The synthesis prompt instructs the AI to capture:
- Voice, tone, and characteristic expression
- Core worldview and deepest values
- Contradictions, fears, and blindspots
- Aspirations and motivating drives
- Relational style and conflict behavior
- Characteristic thought patterns

The output is prose, not bullet points — written to feel like a *living portrait*.

### 8.3 Synthesis Trigger
Soul synthesis runs automatically after every 5th memory extraction run (≈100 conversation messages), tracked via `extractionRunCount` in `DialogueViewModel`. The synthesizer fires in a background `Task` without blocking the conversation.

---

## 9. Security Architecture

### 9.1 Authentication
Two identity providers, zero overlap:

| Provider | ownerID format | Notes |
|----------|---------------|-------|
| Apple Sign In | opaque credential.user string | `ASAuthorizationAppleIDCredential` |
| Google Sign-In | `google_<GIDUser.userID>` | namespaced to prevent collision |

`AuthenticatedIdentity` is a value type — immutable after construction. All SwiftData queries predicate on `ownerID`, enforcing hard data isolation.

### 9.2 Keychain Design
`IdentityKeychain` and `KeychainHelper` use:
- `kSecAttrAccessibleWhenUnlockedThisDeviceOnly` — secrets never leave the device, inaccessible when locked
- Service + account composite keys for per-provider, per-user isolation
- API keys stored encrypted at rest in Keychain (not UserDefaults, not Info.plist)

### 9.3 AES-256-GCM Encryption
`EncryptionService` provides authenticated encryption:
- 256-bit `SymmetricKey` generated via `SecRandomCopyBytes`
- 12-byte random nonce generated fresh on every `encrypt()` call
- AES-GCM provides both confidentiality and integrity (AEAD)
- Used for sensitive field encryption within SwiftData records

### 9.4 Legacy Export Encryption (PBKDF2)
`LegacyExporter` encrypts belief/milestone exports with a user-provided passphrase:
- **600,000 PBKDF2-SHA256 iterations** (OWASP 2023 recommendation for AES-256)
- 32-byte random salt, 32-byte derived key
- CommonCrypto `CCKeyDerivationPBKDF` implementation
- Plaintext header (schemaVersion, hopeStatement, salt, exportedAt) + encrypted body
- Feature-gated: requires ≥50 training answers

### 9.5 Network Security
`EngineRegistryClient` remote fetch:
- 64 KB response cap before JSON decode (prevents payload amplification)
- `Content-Type` validation (rejects non-JSON responses — HTML error pages, redirects)
- 24-hour fetch interval (no polling)
- Bundled fallback manifest if fetch fails

### 9.6 Prompt Injection Prevention
Two entry points hardened:
- `PersonaEngine` — sanitizes alias before system prompt construction
- `SoulSynthesizer` — applies the same sanitization chain (newlines, control chars, truncation at 50 chars)

### 9.7 Error Information Leakage
`DialogueViewModel` maps all errors to user-friendly messages:
- `APIKeyMissing` → triggers setup sheet (no message text)
- `NetworkError(detail)` → shows pre-sanitized string from the engine
- All other errors → "Something went wrong. Try again." (no internal detail exposed)

---

## 10. UI/UX Design System

### 10.1 Liquid Glass Design
Built on iOS 26's Liquid Glass material system:
- `GlassEffectContainer` wraps interactive surfaces
- `glassEffect()` modifier applies backdrop blur with specular highlights
- `glassCard` — project-specific `ViewModifier` combining glass effect with rounded corners and subtle border
- All UI components degrade gracefully on pre-iOS 26 simulators via `#if canImport(FoundationModels)` guards

### 10.2 Pixel Aesthetic
The design system overlays a retro pixel aesthetic on the glass foundation:
- `PixelTheme` — centralized color palette (indigo, violet, amber, emerald, white/gray neutrals)
- `PixelText` — custom font modifier with size/weight/color variants
- `PixelButton` — glassy button with amber gradient fill for primary actions
- `CompanionSprite` — animated pixel-art companion character with state-based animation (idle, thinking, speaking)

### 10.3 Conversation UI — Texting Paradigm
Both MIND and MIRROR interfaces deliver AI responses as segmented text bubbles:
- `splitIntoSegments()` splits on sentence-ending punctuation
- Each segment is delivered with a 600ms delay — simulates human typing rhythm
- `ChatBubble` / `PersonaChatBubble` render role-differentiated bubbles (right-aligned user, left-aligned companion/mirror)
- Input field: `TextField` with `axis: .vertical` and `lineLimit(4)` — expands naturally for longer inputs

### 10.4 Multi-Tab Navigation
`MainTabView` hosts 4 primary tabs:
1. **MIND** — Companion chat
2. **TRAIN** — Question cards
3. **MIRROR** — Persona chat
4. **MORE** — Settings, Legacy, Timeline, Progression

---

## 11. Onboarding & Hope Statement

### 11.1 Four-Page Onboarding
1. Welcome + brand introduction
2. Auth method selection (Apple, Google)
3. Name/alias setup
4. **Hope Statement** — user writes a personal north star (max 280 chars)

The hope statement is the most consequential piece of data in the app. It:
- Is always the **first line** of every AI system prompt (never truncated)
- Is included in the plaintext header of Legacy Exports (so it's always recoverable)
- Is displayed in the Persona view as a persistent reminder

### 11.2 Self-Portrait
During or after onboarding, the user completes a guided self-portrait questionnaire. The app synthesizes their answers into a first-person portrait paragraph (AI-authored) stored as JSON in `UserProfile.selfPortraitData`.

---

## 12. Third-Party Integrations

| Integration | Purpose | Data Shared |
|-------------|---------|------------|
| Apple Sign In | Primary auth | ownerID, optional name/email (first sign-in only) |
| Google Sign-In | Secondary auth | ownerID, display name |
| Groq API | Cloud AI inference | Conversation turns (no PII unless user shares) |
| Google Gemini API | Cloud AI inference | Same as above |
| OpenAI API | Cloud AI inference | Same as above |
| Anthropic Claude API | Cloud AI inference | Same as above |
| Firebase | Analytics / crash reporting | Configured; scope user-controlled |

All API keys are user-supplied and stored in Keychain. The app has no proprietary backend — no Altarego server receives user data.

---

## 13. Codebase Quality Metrics

| Metric | Status |
|--------|--------|
| Swift 6.2 strict concurrency | Full compliance — no data races |
| ownerID scoping on all DB queries | All 7 schema models |
| Protocol-driven AI layer | Zero concrete provider dependencies in ViewModels |
| Dependency injection | All engines, repositories, services injected via init |
| Dead code | Eliminated — no orphaned files |
| Error handling | No silent swallows; UI never sees raw error details |
| Immutability | `Message`, `TapAnswer`, `AuthenticatedIdentity` are value types |
| File size discipline | All files under 800 lines; most under 200 |

---

## 14. What Makes This Technically Distinctive

1. **On-device-first AI with graceful cloud fallback** — the only app in this category that runs its core intelligence locally via Apple FoundationModels, with a protocol-abstracted multi-provider cloud layer as backup.

2. **Tiered memory architecture** — solves the LLM context window problem for longitudinal personal AI without requiring a server. All memory lives in SwiftData on-device.

3. **Tappable belief mapping** — replaces open-ended journaling with structured psychological instruments, producing machine-readable belief vectors rather than unstructured text.

4. **Soul Package portability** — the digital twin export is LLM-agnostic. The `twinActivationPrompt` is a self-contained system prompt that works in ChatGPT, Claude, Gemini, or any future LLM — not locked to this app.

5. **Privacy-by-architecture** — no backend, no syncing, no analytics on conversation content. The app cannot leak user data because it never leaves the device (unless the user activates a cloud AI provider, in which case only the current conversation turn is transmitted).

6. **Remote engine deprecation** — the engine manifest system allows the team to sunset a provider globally (e.g., if an API is discontinued) by pushing a `shutdownRequired` status, without an app update.

---

## 15. Current Development Status

### Completed (16 of 17 steps)
All core features are implemented and have been through UI/UX, SWE logic, and security review passes. The app is functionally complete for its initial feature set.

### Pending: Step 12 — Final Hardening
- [ ] Keychain access group entitlement (for potential future iCloud Keychain sharing)
- [ ] App Transport Security configuration audit
- [ ] Input sanitization completeness audit
- [ ] Crash/error logging strategy (structured logging via `OSLog` already in place; crash reporting TBD)
- [ ] App Store privacy manifest (`PrivacyInfo.xcprivacy`)
- [ ] `@Query` predicate scoping at DB level (currently in-memory filtered in `MainTabView`)

### Build Requirement
Xcode 26 beta is required to compile `FoundationModels`, `GlassEffectContainer`, `glassEffect()`. On Xcode 16.4, the project compiles with stubs via `#if canImport(FoundationModels)` guards — enabling development and testing of all non-FoundationModels paths.

---

*Altarego — built by Conscience.ai*
*iOS 26 · Swift 6.2 · Private by design*
