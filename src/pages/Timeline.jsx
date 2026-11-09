import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const TYPES = {
  milestone: { label: 'Түүх', color: '#1a0dbf' },
  event: { label: 'Арга хэмжээ', color: '#d97706' },
  exhibit: { label: 'Үзмэрүүд', color: '#059669' },
}

export default function Timeline() {
  const [items, setItems] = useState([])
  const [active, setActive] = useState({ milestone: true, event: true, exhibit: true })
  const [openKey, setOpenKey] = useState(null)
  const [fromYear, setFromYear] = useState(null)
  const [toYear, setToYear] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const [m, e, x] = await Promise.all([
        supabase.from('history_milestones').select('*'),
        supabase.from('events').select('*'),
        supabase.from('exhibits').select('*').eq('status', 'published'),
      ])
      const err = m.error || e.error || x.error
      if (err) { setError(err.message); setLoading(false); return }

      const all = [
        ...m.data.map(r => ({
          key: `m${r.id}`, type: 'milestone', year: r.year, sort: `${r.year}-01-01`,
          title: r.title, description: r.description, image: null, link: null,
        })),
        ...e.data.filter(r => r.event_date).map(r => ({
          key: `e${r.id}`, type: 'event', year: Number(r.event_date.slice(0, 4)), sort: r.event_date,
          title: r.title, description: r.description, image: r.cover_image_url, link: `/events/${r.id}`,
        })),
        ...x.data.filter(r => r.year_created).map(r => ({
          key: `x${r.id}`, type: 'exhibit', year: r.year_created, sort: `${r.year_created}-06-01`,
          title: r.title, description: r.description, image: r.image_url, link: `/exhibits/${r.id}`,
        })),
      ].sort((a, b) => a.sort.localeCompare(b.sort))

      setItems(all)
      if (all.length) {
        setFromYear(all[0].year)
        setToYear(all[all.length - 1].year)
      }
      setLoading(false)
    }
    load()
  }, [])

  const minYear = items.length ? items[0].year : 0
  const maxYear = items.length ? items[items.length - 1].year : 0

  const visible = useMemo(
    () => items.filter(i => active[i.type] && i.year >= fromYear && i.year <= toYear),
    [items, active, fromYear, toYear]
  )

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>ISM Цаг хугацааны машин</h1>
      <p>Тэнхимийн түүхээр аялаарай: түүхэн үйл явдал, арга хэмжээ, оюутнуудын үзмэрүүд.</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Ачаалж байна...</p>}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '16px 0' }}>
        {Object.entries(TYPES).map(([key, t]) => (
          <button key={key} onClick={() => setActive({ ...active, [key]: !active[key] })}
            style={{
              padding: '6px 14px', borderRadius: 20, border: `2px solid ${t.color}`,
              background: active[key] ? t.color : 'white', color: active[key] ? 'white' : t.color, cursor: 'pointer',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {items.length > 0 && minYear < maxYear && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          <label>Эхлэх он: <strong>{fromYear}</strong>
            <input type="range" min={minYear} max={maxYear} value={fromYear}
              onChange={e => setFromYear(Math.min(Number(e.target.value), toYear))} style={{ width: '100%' }} />
          </label>
          <label>Дуусах он: <strong>{toYear}</strong>
            <input type="range" min={minYear} max={maxYear} value={toYear}
              onChange={e => setToYear(Math.max(Number(e.target.value), fromYear))} style={{ width: '100%' }} />
          </label>
        </div>
      )}

      {!loading && visible.length === 0 && <p>Энэ шүүлтүүрт тохирох зүйл олдсонгүй.</p>}

      <div style={{ borderLeft: '3px solid #ccc', marginLeft: 12 }}>
        {visible.map(item => {
          const t = TYPES[item.type]
          const open = openKey === item.key
          return (
            <div key={item.key} style={{ position: 'relative', paddingLeft: 24, marginBottom: 20 }}>
              <span style={{
                position: 'absolute', left: -9, top: 6, width: 15, height: 15,
                borderRadius: '50%', background: t.color,
              }} />
              <div onClick={() => setOpenKey(open ? null : item.key)} style={{ cursor: 'pointer' }}>
                <strong style={{ color: t.color }}>{item.year} · {t.label}</strong>
                <h3 style={{ margin: '4px 0' }}>{item.title}</h3>
              </div>
              {open && (
                <div>
                  {item.image && <img src={item.image} alt={item.title} style={{ maxWidth: '100%', maxHeight: 220, borderRadius: 8 }} />}
                  <p>{item.description}</p>
                  {item.link && <Link to={item.link}>Дэлгэрэнгүй үзэх →</Link>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
