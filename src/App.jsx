import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'

export default function App() {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase.from('exhibition_categories').select('*').then(({ data, error }) => {
      if (error) setError(error.message)
      else setCategories(data)
    })
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <h1>ISM Digital Museum</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <ul>{categories.map(c => <li key={c.id}>{c.name}</li>)}</ul>
    </div>
  )
}
