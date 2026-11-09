// Generated cover used when an exhibit/event has no uploaded image.
const GRADIENTS = [
  ['#1a0dbf', '#6d5dfc'],
  ['#0f766e', '#34d399'],
  ['#b45309', '#fbbf24'],
  ['#9d174d', '#f472b6'],
  ['#1d4ed8', '#38bdf8'],
  ['#4c1d95', '#a78bfa'],
]

function pick(text = '') {
  let h = 0
  for (const ch of text) h = (h * 31 + ch.codePointAt(0)) % 997
  return GRADIENTS[h % GRADIENTS.length]
}

export default function Cover({ title, height = 150, small = false }) {
  const [a, b] = pick(title)
  return (
    <div
      className="cover"
      style={{
        height,
        width: small ? height : '100%',
        flexShrink: 0,
        borderRadius: small ? 4 : 0,
        background: `linear-gradient(135deg, ${a}, ${b})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 700,
        textAlign: 'center',
        padding: small ? 0 : 16,
        fontSize: small ? 18 : 18,
        overflow: 'hidden',
      }}
    >
      {small ? (title || '?').trim().charAt(0).toUpperCase() : <span style={{ textShadow: '0 1px 4px rgba(0,0,0,.25)' }}>{title}</span>}
    </div>
  )
}
