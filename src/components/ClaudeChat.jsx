import { useState, useRef, useEffect } from 'react'
import { FiMessageSquare, FiX, FiSend, FiPaperclip } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { isImage, isPdf, fileKind, extractFileText } from '../lib/fileText'

const PROXY_URL = 'https://api.ska032104.online'

// Formats the browser accepts in the file picker.
const ACCEPT = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf',
  '.xlsx', '.xls', '.xlsm', '.csv', '.ods',
  '.docx',
  '.pptx',
  '.txt', '.md', '.markdown', '.json', '.log', '.rtf', 'text/plain',
].join(',')

async function callClaude(messages) {
  // Send only the fields the API expects (strip display-only metadata).
  const apiMessages = messages.map(({ role, content }) => ({ role, content }))
  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: apiMessages,
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`)
  }
  const data = await res.json()
  return data.content[0]?.text ?? ''
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function FileChip({ file, onRemove }) {
  const showImage = isImage(file)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (showImage) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [file, showImage])

  return (
    <div className="flex items-center gap-1 bg-[#1A2236] border border-[#1A2236] rounded-lg overflow-hidden pr-2 max-w-[160px]">
      {showImage && preview ? (
        <img src={preview} alt={file.name} className="h-8 w-8 object-cover flex-shrink-0" />
      ) : (
        <div className="h-8 w-8 flex items-center justify-center bg-[#111826] flex-shrink-0 text-[#00D4AA] text-[10px] font-mono">
          {fileKind(file)}
        </div>
      )}
      <span className="text-xs text-gray-400 truncate">{file.name}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 text-gray-500 hover:text-gray-200 flex-shrink-0"
        >
          <FiX size={12} />
        </button>
      )}
    </div>
  )
}

function AttachmentTag({ name, kind }) {
  return (
    <div className="inline-flex items-center gap-1.5 mb-1.5 mr-1.5 bg-[#1A2236]/60 border border-[#1A2236] rounded-md px-2 py-1">
      <span className="text-[10px] font-mono text-[#00D4AA]">{kind}</span>
      <span className="text-xs text-gray-300 truncate max-w-[180px]">{name}</span>
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'

  // For assistant messages the text lives in the content blocks; for user
  // messages we keep the typed text separately so file context isn't shown.
  const textContent =
    msg.displayText !== undefined
      ? msg.displayText
      : Array.isArray(msg.content)
        ? msg.content.find((c) => c.type === 'text')?.text ?? ''
        : msg.content

  const imageContents = Array.isArray(msg.content)
    ? msg.content.filter((c) => c.type === 'image')
    : []

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`${isUser ? 'max-w-[85%]' : 'max-w-[92%]'} rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-[#00D4AA]/20 border border-[#00D4AA]/30 text-gray-100'
            : 'bg-[#0C1018] border border-[#1A2236] text-gray-200'
        }`}
      >
        {imageContents.map((img, i) => (
          <img
            key={i}
            src={`data:${img.source.media_type};base64,${img.source.data}`}
            alt="attached"
            className="rounded-lg mb-2 max-h-32 object-cover"
          />
        ))}
        {msg.files?.length > 0 && (
          <div className="flex flex-wrap">
            {msg.files.map((f, i) => (
              <AttachmentTag key={i} name={f.name} kind={f.kind} />
            ))}
          </div>
        )}
        {textContent &&
          (isUser ? (
            <p className="whitespace-pre-wrap">{textContent}</p>
          ) : (
            <div className="markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{textContent}</ReactMarkdown>
            </div>
          ))}
      </div>
    </div>
  )
}

function LoadingDots() {
  return (
    <div className="flex justify-start mb-3">
      <div className="bg-[#0C1018] border border-[#1A2236] rounded-2xl px-4 py-3 flex gap-1 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-[#00D4AA] rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

const CORRECT_PASSWORD = '032104'

export default function ClaudeChat() {
  const [open, setOpen] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [fileError, setFileError] = useState('')
  const bottomRef = useRef(null)
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function submitPassword(e) {
    e.preventDefault()
    if (passwordInput === CORRECT_PASSWORD) {
      setAuthed(true)
      setPasswordError(false)
      setPasswordInput('')
    } else {
      setPasswordError(true)
      setPasswordInput('')
    }
  }

  async function send() {
    const text = input.trim()
    if (!text && files.length === 0) return
    if (loading) return

    setFileError('')
    const contentArray = []
    const displayFiles = []

    try {
      for (const file of files) {
        if (isImage(file)) {
          const data = await fileToBase64(file)
          contentArray.push({
            type: 'image',
            source: { type: 'base64', media_type: file.type || 'image/png', data },
          })
          displayFiles.push({ name: file.name, kind: fileKind(file) })
        } else if (isPdf(file)) {
          const data = await fileToBase64(file)
          contentArray.push({
            type: 'document',
            source: { type: 'base64', media_type: 'application/pdf', data },
          })
          displayFiles.push({ name: file.name, kind: 'PDF' })
        } else {
          const extracted = await extractFileText(file)
          contentArray.push({
            type: 'text',
            text: `Attached file "${file.name}":\n\n${extracted}`,
          })
          displayFiles.push({ name: file.name, kind: fileKind(file) })
        }
      }
    } catch (err) {
      setFileError(`Could not read file: ${err.message}`)
      return
    }

    if (text) {
      contentArray.push({ type: 'text', text })
    }

    const userMsg = {
      role: 'user',
      content: contentArray,
      displayText: text,
      files: displayFiles,
    }
    const updatedMessages = [...messages, userMsg]

    setMessages(updatedMessages)
    setInput('')
    setFiles([])
    setLoading(true)

    try {
      const assistantText = await callClaude(updatedMessages)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: [{ type: 'text', text: assistantText }] },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: [{ type: 'text', text: `Error: ${err.message}` }],
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  function handleFileChange(e) {
    const picked = Array.from(e.target.files)
    setFileError('')
    setFiles((prev) => [...prev, ...picked])
    e.target.value = ''
  }

  return (
    <>
      {/* Chat drawer */}
      {open && (
        <div className="fixed inset-x-4 top-4 bottom-24 z-50 flex flex-col glass border border-[#1A2236] rounded-2xl shadow-2xl md:inset-x-auto md:right-6 md:left-auto md:top-6 md:bottom-28 md:w-[min(720px,calc(100vw-3rem))]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A2236]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse" />
              <span className="font-display text-sm font-semibold text-gray-100">Ask Claude</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-200 transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>

          {!authed ? (
            /* Password gate */
            <div className="flex-1 flex flex-col items-center justify-center px-8 gap-4">
              <p className="text-gray-400 text-sm text-center font-mono">Enter password to chat</p>
              <form onSubmit={submitPassword} className="w-full flex flex-col gap-3">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false) }}
                  placeholder="Password"
                  autoFocus
                  className="w-full bg-[#0C1018] border border-[#1A2236] rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-[#00D4AA]/50 transition-colors font-mono text-center tracking-widest"
                />
                {passwordError && (
                  <p className="text-red-400 text-xs text-center">Incorrect password</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-[#00D4AA] text-[#07090F] font-semibold rounded-xl py-2.5 text-sm hover:bg-[#00bfa0] transition-colors"
                >
                  Unlock
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 scroll-smooth">
                {messages.length === 0 && (
                  <p className="text-center text-gray-600 text-xs mt-8 font-mono">
                    Ask me anything about this portfolio
                  </p>
                )}
                {messages.map((msg, i) => (
                  <Message key={i} msg={msg} />
                ))}
                {loading && <LoadingDots />}
                <div ref={bottomRef} />
              </div>

              {/* File previews */}
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 px-4 py-2 border-t border-[#1A2236]">
                  {files.map((f, i) => (
                    <FileChip
                      key={i}
                      file={f}
                      onRemove={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    />
                  ))}
                </div>
              )}

              {fileError && (
                <p className="px-4 py-1 text-xs text-red-400 border-t border-[#1A2236]">{fileError}</p>
              )}

              {/* Input row */}
              <div className="flex items-end gap-2 px-3 py-3 border-t border-[#1A2236]">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-500 hover:text-[#00D4AA] transition-colors pb-2 flex-shrink-0"
                  title="Attach image, PDF, Word, Excel, PowerPoint or text file"
                >
                  <FiPaperclip size={16} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPT}
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message…"
                  rows={1}
                  className="flex-1 bg-[#0C1018] border border-[#1A2236] rounded-xl px-3 py-2 text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:border-[#00D4AA]/50 transition-colors font-sans"
                  style={{ maxHeight: 100, overflowY: 'auto' }}
                />
                <button
                  onClick={send}
                  disabled={loading || (!input.trim() && files.length === 0)}
                  className="pb-2 flex-shrink-0 text-[#00D4AA] disabled:text-gray-700 hover:text-white transition-colors"
                >
                  <FiSend size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          open
            ? 'bg-[#0C1018] border border-[#1A2236] text-gray-400 hover:text-gray-200'
            : 'bg-[#00D4AA] text-[#07090F] hover:bg-[#00bfa0] glow-accent'
        }`}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? <FiX size={22} /> : <FiMessageSquare size={22} />}
      </button>
    </>
  )
}
