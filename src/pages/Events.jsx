import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import Cover from '../components/Cover'

const empty = { title: '', event_date: '', description: '', cover_image_url: '' }

export default function Events() {
  const { role } = useAuth()
  const isAdmin = role === 'admin'
  const [events, setEvents] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  async function load() {
    const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: false })
    if (error) setError(error.message)
    else setEvents(data)
  }
  useEffect(() => { load() }, [])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    let cover_image_url = form.cover_image_url
    if (file) {
      const path = `events/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
      const { error: upErr } = await supabase.storage.from('site-images').upload(path, file)
      if (upErr) return setError(upErr.message)
      cover_image_url = supabase.storage.from('site-images').getPublicUrl(path).data.publicUrl
    }
    const payload = {
      title: form.title,
      event_date: form.event_date || null,
      description: form.description,
      cover_image_url,
    }
    const { error } = editingId
      ? await supabase.from('events').update(payload).eq('id', editingId)
      : await supabase.from('events').insert(payload)
    if (error) return setError(error.message)
    setForm(empty); setFile(null); setEditingId(null)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Энэ арга хэмжээ болон зургуудыг устгах уу?')) return
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) setError(error.message)
    else load()
  }

  function startEdit(ev) {
    setEditingId(ev.id)
    setForm({
      title: ev.title,
      event_date: ev.event_date ?? '',
      description: ev.description ?? '',
      cover_image_url: ev.cover_image_url ?? '',
    })
    window.scrollTo(0, 0)
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Арга хэмжээ</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {isAdmin && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 420, marginBottom: 24 }}>
          <h3>{editingId ? 'Арга хэмжээ засах' : 'Арга хэмжээ нэмэх'}</h3>
          <input placeholder="Гарчиг" value={form.title} onChange={set('title')} required />
          <input type="date" value={form.event_date} onChange={set('event_date')} />
          <textarea placeholder="Тайлбар" rows={3} value={form.description} onChange={set('description')} />
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit">{editingId ? 'Хадгалах' : 'Нэмэх'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(empty) }}>Болих</button>}
          </div>
        </form>
      )}

      {events.length === 0 && <p>Одоогоор арга хэмжээ нэмэгдээгүй байна.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {events.map(ev => (
          <div key={ev.id} className="lift" style={{ border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden' }}>
            <Link to={`/events/${ev.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {ev.cover_image_url
                ? <img src={ev.cover_image_url} alt={ev.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                : <Cover title={ev.title} height={160} />}
              <div style={{ padding: 12 }}>
                <strong>{ev.title}</strong>
                <div>{ev.event_date}</div>
              </div>
            </Link>
            {isAdmin && (
              <div style={{ display: 'flex', gap: 8, padding: '0 12px 12px' }}>
                <button onClick={() => startEdit(ev)}>Засах</button>
                <button onClick={() => handleDelete(ev.id)}>Устгах</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
