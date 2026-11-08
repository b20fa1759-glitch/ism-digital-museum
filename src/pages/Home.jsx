import { Link } from 'react-router-dom'

const cards = [
  { to: '/exhibits', title: 'Exhibits', text: 'Browse student projects by category, year and technology.' },
  { to: '/teachers', title: 'Teachers', text: 'Meet the department faculty.' },
  { to: '/events', title: 'Events', text: 'Photo albums from department events.' },
  { to: '/timeline', title: 'Time Machine', text: 'Travel through the history of the department.' },
  { to: '/creators', title: 'Creators', text: 'Students and the works they created.' },
  { to: '/history', title: 'History', text: 'Milestones in the department story.' },
]

export default function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1>ISM Digital Museum</h1>
      <p style={{ maxWidth: 650 }}>
        ISM Digital Museum нь Мэдээллийн Системийн Менежментийн тэнхимийн түүх, багш нарын танилцуулга, тэнхимийн өдөрлөг болон арга хэмжээний гэрэл зураг, оюутнуудын бүтээл, судалгаа, технологийн төслүүдийг нэг дор хадгалж, интерактив хэлбэрээр танилцуулах веб аппликейшн юм.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginTop: 24 }}>
        {cards.map(c => (
          <Link key={c.to} to={c.to}
                style={{ background: 'white', border: '1px solid #dde0ee', borderRadius: 10, padding: 20, textDecoration: 'none' }}>
            <h3 style={{ margin: '0 0 8px', color: '#1a0dbf' }}>{c.title}</h3>
            <p style={{ margin: 0 }}>{c.text}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}