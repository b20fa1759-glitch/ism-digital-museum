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
    if (!confirm('Энэ үйл явдлыг устгах уу?')) return
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
      <h1>Тэнхимийн түүх</h1>
      <p>
        Санхүү эдийн засгийн их сургууль (СЭЗИС) болон Мэдээллийн системийн
        менежментийн тэнхимийн түүхэн замнал.
      </p>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {isAdmin && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          <h3>{editingId ? 'Үйл явдал засах' : 'Үйл явдал нэмэх'}</h3>
          <input type="number" placeholder="Он" value={form.year} onChange={set('year')} required />
          <input placeholder="Гарчиг" value={form.title} onChange={set('title')} required />
          <textarea placeholder="Тайлбар" rows={3} value={form.description} onChange={set('description')} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit">{editingId ? 'Хадгалах' : 'Нэмэх'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(empty) }}>Болих</button>}
          </div>
        </form>
      )}

      {items.length === 0 && <p>Одоогоор мэдээлэл алга.</p>}
      {items.map(m => (
        <div key={m.id} style={{ borderLeft: '4px solid #1a0dbf', paddingLeft: 16, marginBottom: 20 }}>
          <strong style={{ fontSize: 20 }}>{m.year}</strong>
          <h3 style={{ margin: '4px 0' }}>{m.title}</h3>
          <p>{m.description}</p>
          {isAdmin && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => startEdit(m)}>Засах</button>
              <button onClick={() => handleDelete(m.id)}>Устгах</button>
            </div>
          )}
        </div>
      ))}

      <hr style={{ margin: '32px 0 12px', border: 'none', borderTop: '1px solid #dde0ee' }} />
      <p style={{ fontSize: 13 }}>
        <strong>Эх сурвалж:</strong>{' '}
        <a href="https://ufe.edu.mn/en/c/28" target="_blank" rel="noreferrer">СЭЗИС-ийн албан ёсны түүх</a>
        {' · '}
        <a href="https://en.wikipedia.org/wiki/University_of_Finance_and_Economics_(Mongolia)" target="_blank" rel="noreferrer">
          Wikipedia: University of Finance and Economics (Mongolia)
        </a>
      </p>
    </div>
  )
}

