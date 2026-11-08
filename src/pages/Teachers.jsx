import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

const DEPT = 'Мэдээллийн системийн менежментийн тэнхим'
const empty = { name: '', position: '', department: DEPT, degree: '', email: '', office: '', courses: '', bio: '', photo_url: '' }

export default function Teachers() {
  const { role } = useAuth()
  const isAdmin = role === 'admin'
  const [teachers, setTeachers] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  async function load() {
    const { data, error } = await supabase.from('teachers').select('*').order('id')
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
    const payload = {
      name: form.name, position: form.position, department: form.department,
      degree: form.degree || null, email: form.email || null, office: form.office || null,
      courses: form.courses || null, bio: form.bio || null, photo_url,
    }
    const { error } = editingId
      ? await supabase.from('teachers').update(payload).eq('id', editingId).select().single()
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
    setForm({
      name: t.name, position: t.position ?? '', department: t.department ?? DEPT,
      degree: t.degree ?? '', email: t.email ?? '', office: t.office ?? '',
      courses: t.courses ?? '', bio: t.bio ?? '', photo_url: t.photo_url ?? '',
    })
    window.scrollTo(0, 0)
  }

  const row = { display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderTop: '1px solid #eef0f8', fontSize: 14 }

  return (
    <div style={{ padding: 24 }}>
      <h1>Багш нар · Teachers</h1>
      <p>{DEPT}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {isAdmin && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 440, marginBottom: 24 }}>
          <h3>{editingId ? 'Edit teacher' : 'Add teacher'}</h3>
          <input placeholder="Нэр (name)" value={form.name} onChange={set('name')} required />
          <input placeholder="Албан тушаал (position)" value={form.position} onChange={set('position')} />
          <input placeholder="Алба нэгж (unit)" value={form.department} onChange={set('department')} />
          <input placeholder="Цол зэрэг (degree/title)" value={form.degree} onChange={set('degree')} />
          <input type="email" placeholder="И-Мэйл" value={form.email} onChange={set('email')} />
          <input placeholder="Өрөөний дугаар (office)" value={form.office} onChange={set('office')} />
          <input placeholder="Заадаг хичээлүүд (courses, separated by ;)" value={form.courses} onChange={set('courses')} />
          <textarea placeholder="Товч танилцуулга (bio)" rows={3} value={form.bio} onChange={set('bio')} />
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit">{editingId ? 'Update' : 'Add'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(empty) }}>Cancel</button>}
          </div>
        </form>
      )}

      {teachers.length === 0 && <p>No teachers added yet.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {teachers.map(t => (
          <div key={t.id} style={{ background: 'white', border: '1px solid #dde0ee', borderTop: '4px solid #1a0dbf', borderRadius: 10, padding: 20, textAlign: 'center' }}>
            {t.photo_url
              ? <img src={t.photo_url} alt={t.name} style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top' }} />
              : <div style={{ width: 120, height: 120, borderRadius: '50%', background: '#eee', margin: '0 auto' }} />}
            <h3 style={{ margin: '12px 0 2px', textTransform: 'uppercase' }}>{t.name}</h3>
            <div style={{ color: '#5b5f72', marginBottom: 12 }}>{t.position}</div>
            <div style={{ textAlign: 'left' }}>
              {t.department && <div style={row}><strong>Алба нэгж</strong><span style={{ textAlign: 'right' }}>{t.department}</span></div>}
              {t.degree && <div style={row}><strong>Цол зэрэг</strong><span>{t.degree}</span></div>}
              {t.email && <div style={row}><strong>И-Мэйл</strong><a href={`mailto:${t.email}`}>{t.email}</a></div>}
              {t.office && <div style={row}><strong>Өрөөний дугаар</strong><span>{t.office}</span></div>}
              {t.courses && (
                <div style={{ padding: '8px 0', borderTop: '1px solid #eef0f8', fontSize: 13 }}>
                  <strong>Заадаг хичээлүүд</strong>
                  <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
                    {t.courses.split(';').map(c => <li key={c}>{c.trim()}</li>)}
                  </ul>
                </div>
              )}
            </div>
            {t.bio && <p style={{ textAlign: 'left' }}>{t.bio}</p>}
            {isAdmin && (
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                <button onClick={() => startEdit(t)}>Edit</button>
                <button onClick={() => handleDelete(t.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
