// Heavy parsers (xlsx / mammoth / jszip) are loaded on demand so they stay
// out of the main bundle and only download when a user attaches such a file.

// Native Claude API support: images + PDF go through as binary blocks.
// Everything else (Office docs, plain text) is converted to text client-side
// and sent as context, because the API has no document block for them.

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

const EXT = (name) => name.slice(name.lastIndexOf('.') + 1).toLowerCase()

const TEXT_EXTS = new Set([
  'txt', 'md', 'markdown', 'csv', 'tsv', 'json', 'log', 'rtf',
  'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'h', 'cs',
  'go', 'rs', 'rb', 'php', 'html', 'css', 'xml', 'yml', 'yaml', 'sh',
])
const EXCEL_EXTS = new Set(['xlsx', 'xls', 'xlsm', 'xlsb', 'ods'])
const WORD_EXTS = new Set(['docx'])
const PPT_EXTS = new Set(['pptx'])

/** Files the browser/API can handle as binary blocks. */
export function isImage(file) {
  return IMAGE_TYPES.includes(file.type) || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(EXT(file.name))
}

export function isPdf(file) {
  return file.type === 'application/pdf' || EXT(file.name) === 'pdf'
}

/** Short label shown on the file chip. */
export function fileKind(file) {
  if (isImage(file)) return 'IMG'
  if (isPdf(file)) return 'PDF'
  const ext = EXT(file.name)
  if (EXCEL_EXTS.has(ext)) return 'XLS'
  if (WORD_EXTS.has(ext)) return 'DOC'
  if (PPT_EXTS.has(ext)) return 'PPT'
  if (TEXT_EXTS.has(ext)) return 'TXT'
  return ext ? ext.toUpperCase().slice(0, 4) : 'FILE'
}

function readArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

function readText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

async function extractExcel(file) {
  const XLSX = await import('xlsx')
  const buf = await readArrayBuffer(file)
  const wb = XLSX.read(buf, { type: 'array' })
  return wb.SheetNames.map((name) => {
    const csv = XLSX.utils.sheet_to_csv(wb.Sheets[name])
    return `## Sheet: ${name}\n${csv}`.trim()
  }).join('\n\n')
}

async function extractWord(file) {
  const mammoth = (await import('mammoth/mammoth.browser')).default
  const buf = await readArrayBuffer(file)
  const { value } = await mammoth.extractRawText({ arrayBuffer: buf })
  return value.trim()
}

async function extractPptx(file) {
  const JSZip = (await import('jszip')).default
  const buf = await readArrayBuffer(file)
  const zip = await JSZip.loadAsync(buf)
  const slideFiles = Object.keys(zip.files)
    .filter((p) => /^ppt\/slides\/slide\d+\.xml$/.test(p))
    .sort((a, b) => {
      const n = (s) => parseInt(s.match(/slide(\d+)\.xml/)[1], 10)
      return n(a) - n(b)
    })

  const slides = []
  for (const path of slideFiles) {
    const xml = await zip.files[path].async('string')
    const texts = [...xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((m) => m[1])
    const slideNum = path.match(/slide(\d+)\.xml/)[1]
    if (texts.length) slides.push(`## Slide ${slideNum}\n${texts.join('\n')}`)
  }
  return slides.join('\n\n')
}

const MAX_CHARS = 60000

/**
 * Extract text from an Office / text file. Returns the extracted string,
 * truncated to a safe length. Throws if the format is unsupported.
 */
export async function extractFileText(file) {
  const ext = EXT(file.name)
  let text = ''

  if (EXCEL_EXTS.has(ext)) text = await extractExcel(file)
  else if (WORD_EXTS.has(ext)) text = await extractWord(file)
  else if (PPT_EXTS.has(ext)) text = await extractPptx(file)
  else if (TEXT_EXTS.has(ext) || file.type.startsWith('text/')) text = await readText(file)
  else throw new Error(`Unsupported file type: .${ext}`)

  if (text.length > MAX_CHARS) {
    text = text.slice(0, MAX_CHARS) + '\n\n…[truncated]'
  }
  return text
}
