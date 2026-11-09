import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Creators() {
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const [p, x] = await Promise.all([
        supabase.from('profiles').select('id, display_name, avatar_url'),
        supabase.from('exhibits').select('id, title, image_url, year_created, creator_id').eq('status', 'published'),
      ])
      if (p.error || x.error) {
        setError((p.error || x.error).message)
        setLoading(false)
        return
      }
      const list = p.data
        .map(profile => ({ ...profile, works: x.data.filter(e => e.creator_id === profile.id) }))
        .filter(c => c.works.length > 0)
      setCreators(list)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <h1>ISM Бүтээгчид</h1>
      <p>Музейд ажлаа нэмсэн оюутнууд болон тэдний бүтээлүүд.</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Ачаалж байна...</p>}
      {!loading && creators.length === 0 && <p>Одоогоор нийтэлсэн бүтээл алга.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {creators.map(c => (
          <div key={c.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>{c.display_name}</h3>
            <p>{c.works.length} бүтээл</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {c.works.map(w => (
                <Link key={w.id} to={`/exhibits/${w.id}`}
                      style={{ display: 'flex', gap: 8, alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                  {w.image_url
                    ? <img src={w.image_url} alt={w.title} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }} />
                    : <div style={{ width: 48, height: 48, background: '#eee', borderRadius: 4 }} />}
                  <span>{w.title} {w.year_created && `(${w.year_created})`}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
