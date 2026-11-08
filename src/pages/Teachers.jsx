import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

const empty = { name: '', position: '', courses: '', bio: '', photo_url: '' }

export default function Teachers() {
  const { role } = useAuth()
  const isAdmin = role === 'admin'
  const [teachers, setTeachers] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  async function load() {
    const { data, error } = await supabase.from('teachers').select('*').order('name')
    if (error) setError(error.message)
    else setTeachers(data)
  }
  useEffect(() => { load() }, [])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    let photo_url = form.photo_url
    if (file) {
      const path = `teachers/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
      const { error: upErr } = await supabase.storage.from('site-images').upload(path, file)
      if (upErr) return setError(upErr.message)
      photo_url = supabase.storage.from('site-images').getPublicUrl(path).data.publicUrl
    }
    const payload = { name: form.name, position: form.position, courses: form.courses, bio: form.bio, photo_url }
    const { error } = editingId
      ? await supabase.from('teachers').update(payload).eq('id', editingId)
      : await supabase.from('teachers').insert(payload)
    if (error) return setError(error.message)
    setForm(empty); setFile(null); setEditingId(null)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this teacher?')) return
    const { error } = await supabase.from('teachers').delete().eq('id', id)
    if (error) setError(error.message)
    else load()
  }

  function startEdit(t) {
    setEditingId(t.id)
    setForm({ name: t.name, position: t.position ?? '', courses: t.courses ?? '', bio: t.bio ?? '', photo_url: t.photo_url ?? '' })
    window.scrollTo(0, 0)
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Teachers</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {isAdmin && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 420, marginBottom: 24 }}>
          <h3>{editingId ? 'Edit teacher' : 'Add teacher'}</h3>
          <input placeholder="Name" value={form.name} onChange={set('name')} required />
          <input placeholder="Position" value={form.position} onChange={set('position')} />
          <input placeholder="Courses" value={form.courses} onChange={set('courses')} />
          <textarea placeholder="Short bio" rows={3} value={form.bio} onChange={set('bio')} />
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit">{editingId ? 'Update' : 'Add'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(empty) }}>Cancel</button>}
          </div>
        </form>
      )}

      {teachers.length === 0 && <p>No teachers added yet.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {teachers.map(t => (
          <div key={t.id} style={{ border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden' }}>
            {t.photo_url
              ? <img src={t.photo_url} alt={t.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
              : <div style={{ height: 180, background: '#eee' }} />}
            <div style={{ padding: 12 }}>
              <strong>{t.name}</strong>
              <div>{t.position}</div>
              <div><em>{t.courses}</em></div>
              <p>{t.bio}</p>
              {isAdmin && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => startEdit(t)}>Edit</button>
                  <button onClick={() => handleDelete(t.id)}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
