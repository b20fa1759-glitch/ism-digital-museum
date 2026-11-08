import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

const empty = { year: '', title: '', description: '' }

export default function History() {
  const { role } = useAuth()
  const isAdmin = role === 'admin'
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  async function load() {
    const { data, error } = await supabase.from('history_milestones').select('*').order('year')
    if (error) setError(error.message)
    else setItems(data)
  }
  useEffect(() => { load() }, [])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const payload = { year: Number(form.year), title: form.title, description: form.description }
    const { error } = editingId
      ? await supabase.from('history_milestones').update(payload).eq('id', editingId)
      : await supabase.from('history_milestones').insert(payload)
    if (error) return setError(error.message)
    setForm(empty); setEditingId(null)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this milestone?')) return
    const { error } = await supabase.from('history_milestones').delete().eq('id', id)
    if (error) setError(error.message)
    else load()
  }

  function startEdit(m) {
    setEditingId(m.id)
    setForm({ year: m.year, title: m.title, description: m.description ?? '' })
    window.scrollTo(0, 0)
  }

  return (
    <div style={{ padding: 24, maxWidth: 700 }}>
      <h1>Department History</h1>
      <p>
        The history of the University of Finance and Economics (UFE) and the Management
        Information Systems department.
      </p>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {isAdmin && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          <h3>{editingId ? 'Edit milestone' : 'Add milestone'}</h3>
          <input type="number" placeholder="Year" value={form.year} onChange={set('year')} required />
          <input placeholder="Title" value={form.title} onChange={set('title')} required />
          <textarea placeholder="Description" rows={3} value={form.description} onChange={set('description')} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit">{editingId ? 'Update' : 'Add'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(empty) }}>Cancel</button>}
          </div>
        </form>
      )}

      {items.length === 0 && <p>No milestones yet.</p>}
      {items.map(m => (
        <div key={m.id} style={{ borderLeft: '4px solid #1a0dbf', paddingLeft: 16, marginBottom: 20 }}>
          <strong style={{ fontSize: 20 }}>{m.year}</strong>
          <h3 style={{ margin: '4px 0' }}>{m.title}</h3>
          <p>{m.description}</p>
          {isAdmin && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => startEdit(m)}>Edit</button>
              <button onClick={() => handleDelete(m.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}

      <hr style={{ margin: '32px 0 12px', border: 'none', borderTop: '1px solid #dde0ee' }} />
      <p style={{ fontSize: 13 }}>
        <strong>Sources:</strong>{' '}
        <a href="https://ufe.edu.mn/en/c/28" target="_blank" rel="noreferrer">UFE official history</a>
        {' · '}
        <a href="https://en.wikipedia.org/wiki/University_of_Finance_and_Economics_(Mongolia)" target="_blank" rel="noreferrer">
          Wikipedia: University of Finance and Economics (Mongolia)
        </a>
      </p>
    </div>
  )
}

