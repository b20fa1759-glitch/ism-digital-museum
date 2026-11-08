import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

export default function ExhibitDetail() {
  const { id } = useParams()
  const { user, role } = useAuth()
  const navigate = useNavigate()
  const [ex, setEx] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase
      .from('exhibits')
      .select('*, exhibition_categories(name), profiles(display_name)')
      .eq('id', id)
      .single()
      .then(({ data, error }) => (error ? setError('Exhibit not found.') : setEx(data)))
  }, [id])

  async function handleDelete() {
    if (!confirm('Delete this exhibit?')) return
    const { error } = await supabase.from('exhibits').delete().eq('id', id).select().single()
    if (error) setError(error.message)
    else navigate('/exhibits')
  }

  if (error) return <p style={{ padding: 24, color: 'red' }}>{error}</p>
  if (!ex) return <p style={{ padding: 24 }}>Loading...</p>

  const canEdit = user && (user.id === ex.creator_id || role === 'admin')

  return (
    <div style={{ padding: 24, maxWidth: 700 }}>
      <Link to="/exhibits">← Back to exhibits</Link>
      <h1>{ex.title}</h1>
      {ex.image_url && <img src={ex.image_url} alt={ex.title} style={{ maxWidth: '100%', borderRadius: 8 }} />}
      <p>{ex.description}</p>
      <p><strong>Category:</strong> {ex.exhibition_categories?.name ?? '-'}</p>
      <p><strong>Year:</strong> {ex.year_created ?? '-'}</p>
      <p><strong>Creator:</strong> {ex.profiles?.display_name ?? '-'}</p>
      <p><strong>Technologies:</strong> {ex.technology_stack?.join(', ') || '-'}</p>
      {ex.demo_url && <p><a href={ex.demo_url} target="_blank" rel="noreferrer">Live demo</a></p>}
      {ex.github_url && <p><a href={ex.github_url} target="_blank" rel="noreferrer">GitHub</a></p>}
      {canEdit && (
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <Link to={`/exhibits/${ex.id}/edit`}>Edit</Link>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  )
}
