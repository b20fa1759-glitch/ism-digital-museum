import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

export default function ExhibitForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    title: '', description: '', category_id: '', technology_stack: '',
    year_created: '', demo_url: '', github_url: '', status: 'published', image_url: '',
  })
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [loading, user, navigate])

  useEffect(() => {
    supabase.from('exhibition_categories').select('*').then(({ data }) => setCategories(data ?? []))
    if (isEdit) {
      supabase.from('exhibits').select('*').eq('id', id).single().then(({ data }) => {
        if (data) setForm({
          ...data,
          category_id: data.category_id ?? '',
          year_created: data.year_created ?? '',
          technology_stack: (data.technology_stack ?? []).join(', '),
          description: data.description ?? '',
          demo_url: data.demo_url ?? '',
          github_url: data.github_url ?? '',
          image_url: data.image_url ?? '',
        })
      })
    }
  }, [id, isEdit])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    let image_url = form.image_url
    if (file) {
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
      const path = `${user.id}/${Date.now()}-${safeName}`
      const { error: upErr } = await supabase.storage.from('exhibit-images').upload(path, file)
      if (upErr) { setError(upErr.message); setSaving(false); return }
      image_url = supabase.storage.from('exhibit-images').getPublicUrl(path).data.publicUrl
    }

    const payload = {
      title: form.title,
      description: form.description,
      category_id: form.category_id || null,
      technology_stack: form.technology_stack.split(',').map(s => s.trim()).filter(Boolean),
      year_created: form.year_created ? Number(form.year_created) : null,
      demo_url: form.demo_url || null,
      github_url: form.github_url || null,
      status: form.status,
      image_url,
    }

    const { error } = isEdit
      ? await supabase.from('exhibits').update(payload).eq('id', id).select().single()
      : await supabase.from('exhibits').insert({ ...payload, creator_id: user.id })

    setSaving(false)
    if (error) setError(error.message)
    else navigate('/exhibits')
  }

  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <h1>{isEdit ? 'Edit exhibit' : 'Add exhibit'}</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input placeholder="Title" value={form.title} onChange={set('title')} required />
        <textarea placeholder="Description" rows={4} value={form.description} onChange={set('description')} />
        <select value={form.category_id} onChange={set('category_id')}>
          <option value="">Select category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="Technologies (comma separated: React, Supabase)" value={form.technology_stack} onChange={set('technology_stack')} />
        <input type="number" placeholder="Year created" value={form.year_created} onChange={set('year_created')} />
        <input placeholder="Demo URL" value={form.demo_url} onChange={set('demo_url')} />
        <input placeholder="GitHub URL" value={form.github_url} onChange={set('github_url')} />
        <select value={form.status} onChange={set('status')}>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        {form.image_url && <img src={form.image_url} alt="current" style={{ maxWidth: 200 }} />}
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  )
}
