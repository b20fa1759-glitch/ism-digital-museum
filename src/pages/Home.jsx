import { Link } from 'react-router-dom'

const cards = [
  { to: '/exhibits', title: 'Үзмэрүүд', text: 'Оюутнуудын төслүүдийг ангилал, он, технологиор нь хайж үзээрэй.' },
  { to: '/teachers', title: 'Багш нар', text: 'Тэнхимийн багш нартай танилцаарай.' },
  { to: '/events', title: 'Арга хэмжээ', text: 'Тэнхимийн өдөрлөг, арга хэмжээний фото албум.' },
  { to: '/timeline', title: 'Цаг хугацааны машин', text: 'Тэнхимийн түүхээр цаг хугацаагаар аялаарай.' },
  { to: '/creators', title: 'Бүтээгчид', text: 'Оюутнууд болон тэдний бүтээсэн ажлууд.' },
  { to: '/history', title: 'Түүх', text: 'Тэнхимийн түүхэн үйл явдлууд.' },
]

export default function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1>ISM Дижитал музей</h1>
      <p style={{ maxWidth: 650 }}>
        ISM Дижитал музей нь Мэдээллийн Системийн Менежментийн тэнхимийн түүх, багш нарын танилцуулга, тэнхимийн өдөрлөг болон арга хэмжээний гэрэл зураг, оюутнуудын бүтээл, судалгаа, технологийн төслүүдийг нэг дор хадгалж, интерактив хэлбэрээр танилцуулах веб аппликейшн юм.
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