import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Exhibits() {
  const [exhibits, setExhibits] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [year, setYear] = useState('')
  const [tech, setTech] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('exhibition_categories').select('*').then(({ data }) => setCategories(data ?? []))
  }, [])

  useEffect(() => {
    setLoading(true)
    let query = supabase
      .from('exhibits')
      .select('*, exhibition_categories(name)')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    if (category) query = query.eq('category_id', category)
    if (year) query = query.eq('year_created', Number(year))
    if (tech.trim()) query = query.contains('technology_stack', [tech.trim()])
    if (search.trim()) query = query.ilike('title', `%${search.trim()}%`)
    query.then(({ data, error }) => {
      if (error) setError(error.message)
      else setExhibits(data)
      setLoading(false)
    })
  }, [search, category, year, tech])

  return (
    <div style={{ padding: 24 }}>
      <h1>Exhibits</h1>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <input placeholder="Search by title..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="number" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} style={{ width: 90 }} />
        <input placeholder="Technology (e.g. React)" value={tech} onChange={e => setTech(e.target.value)} />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && exhibits.length === 0 && <p>No exhibits found. Try a different search or filter.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {exhibits.map(ex => (
          <Link key={ex.id} to={`/exhibits/${ex.id}`}
                style={{ border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden', textDecoration: 'none', color: 'inherit' }}>
            {ex.image_url
              ? <img src={ex.image_url} alt={ex.title} style={{ width: '100%', height: 150, objectFit: 'cover' }} />
              : <div style={{ height: 150, background: '#eee' }} />}
            <div style={{ padding: 12 }}>
              <strong>{ex.title}</strong>
              <div>{ex.exhibition_categories?.name} {ex.year_created && `· ${ex.year_created}`}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
