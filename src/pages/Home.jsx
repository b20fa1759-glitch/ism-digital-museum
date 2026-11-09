import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Cover from '../components/Cover'

const cards = [
  { to: '/exhibits', icon: '🖼️', title: 'Үзмэрүүд', text: 'Оюутнуудын төслүүдийг ангилал, он, технологиор нь хайж үзээрэй.' },
  { to: '/teachers', icon: '👩‍🏫', title: 'Багш нар', text: 'Тэнхимийн багш нартай танилцаарай.' },
  { to: '/events', icon: '📸', title: 'Арга хэмжээ', text: 'Тэнхимийн өдөрлөг, арга хэмжээний фото албум.' },
  { to: '/timeline', icon: '⏳', title: 'Цаг хугацааны машин', text: 'Тэнхимийн түүхээр цаг хугацаагаар аялаарай.' },
  { to: '/creators', icon: '🎓', title: 'Бүтээгчид', text: 'Оюутнууд болон тэдний бүтээсэн ажлууд.' },
  { to: '/history', icon: '📜', title: 'Түүх', text: 'Тэнхимийн түүхэн үйл явдлууд.' },
]

async function count(table, filter) {
  let q = supabase.from(table).select('*', { count: 'exact', head: true })
  if (filter) q = filter(q)
  const { count: c } = await q
  return c ?? 0
}

export default function Home() {
  const [stats, setStats] = useState({ exhibits: 0, teachers: 0, events: 0, history: 0 })
  const [latest, setLatest] = useState([])

  useEffect(() => {
    async function load() {
      const [exhibits, teachers, events, history] = await Promise.all([
        count('exhibits', q => q.eq('status', 'published')),
        count('teachers'),
        count('events'),
        count('history_milestones'),
      ])
      setStats({ exhibits, teachers, events, history })
      const { data } = await supabase
        .from('exhibits')
        .select('id, title, image_url, year_created, exhibition_categories(name)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(4)
      setLatest(data ?? [])
    }
    load()
  }, [])

  const statItems = [
    { n: stats.exhibits, label: 'Үзмэр' },
    { n: stats.teachers, label: 'Багш' },
    { n: stats.events, label: 'Арга хэмжээ' },
    { n: stats.history, label: 'Түүхэн үйл явдал' },
  ]

  return (
    <div>
      <section className="hero">
        <p className="hero-tag">СЭЗИС · Мэдээллийн системийн менежментийн тэнхим</p>
        <h1>ISM Дижитал музей</h1>
        <p className="hero-text">
          ISM Дижитал музей нь Мэдээллийн Системийн Менежментийн тэнхимийн түүх, багш нарын танилцуулга, тэнхимийн өдөрлөг болон арга хэмжээний гэрэл зураг, оюутнуудын бүтээл, судалгаа, технологийн төслүүдийг нэг дор хадгалж, интерактив хэлбэрээр танилцуулах веб аппликейшн юм.
        </p>
        <div className="hero-actions">
          <Link to="/exhibits" className="btn-light">Үзмэрүүдийг үзэх</Link>
          <Link to="/timeline" className="btn-outline">Цаг хугацааны машин</Link>
        </div>
      </section>

      <div className="stats">
        {statItems.map(s => (
          <div key={s.label} className="stat">
            <strong>{s.n}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '8px 24px 24px' }}>
        <h2 className="section-title">Музейн хэсгүүд</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {cards.map(c => (
            <Link key={c.to} to={c.to} className="lift"
                  style={{ background: 'white', border: '1px solid #dde0ee', borderRadius: 10, padding: 20, textDecoration: 'none' }}>
              <div style={{ fontSize: 28 }}>{c.icon}</div>
              <h3 style={{ margin: '8px 0', color: '#1a0dbf' }}>{c.title}</h3>
              <p style={{ margin: 0 }}>{c.text}</p>
            </Link>
          ))}
        </div>

        {latest.length > 0 && (
          <>
            <h2 className="section-title" style={{ marginTop: 40 }}>Сүүлд нэмэгдсэн үзмэрүүд</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {latest.map(ex => (
                <Link key={ex.id} to={`/exhibits/${ex.id}`} className="lift"
                      style={{ border: '1px solid #dde0ee', background: 'white', borderRadius: 10, overflow: 'hidden', textDecoration: 'none', color: 'inherit' }}>
                  {ex.image_url
                    ? <img src={ex.image_url} alt={ex.title} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                    : <Cover title={ex.title} height={140} />}
                  <div style={{ padding: 12 }}>
                    <strong>{ex.title}</strong>
                    <div style={{ color: '#5b5f72', fontSize: 14 }}>
                      {ex.exhibition_categories?.name} {ex.year_created && `· ${ex.year_created}`}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
