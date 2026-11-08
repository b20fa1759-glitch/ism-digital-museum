import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

export default function EventDetail() {
  const { id } = useParams()
  const { role } = useAuth()
  const isAdmin = role === 'admin'
  const [event, setEvent] = useState(null)
  const [photos, setPhotos] = useState([])
  const [files, setFiles] = useState([])
  const [caption, setCaption] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  async function load() {
    const { data: ev, error: evErr } = await supabase.from('events').select('*').eq('id', id).single()
    if (evErr) return setError('Event not found.')
    setEvent(ev)
    const { data: ph } = await supabase.from('event_photos').select('*').eq('event_id', id).order('id')
    setPhotos(ph ?? [])
  }
  useEffect(() => { load() }, [id])

  async function handleUpload(e) {
    e.preventDefault()
    if (files.length === 0) return
    setError('')
    setUploading(true)
    for (const file of files) {
      const path = `event-photos/${id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
      const { error: upErr } = await supabase.storage.from('site-images').upload(path, file)
      if (upErr) { setError(upErr.message); break }
      const image_url = supabase.storage.from('site-images').getPublicUrl(path).data.publicUrl
      const { error: insErr } = await supabase.from('event_photos').insert({ event_id: Number(id), image_url, caption })
      if (insErr) { setError(insErr.message); break }
    }
    setFiles([]); setCaption(''); setUploading(false)
    e.target.reset()
    load()
  }

  async function handleDelete(photoId) {
    if (!confirm('Delete this photo?')) return
    const { error } = await supabase.from('event_photos').delete().eq('id', photoId)
    if (error) setError(error.message)
    else load()
  }

  if (error && !event) return <p style={{ padding: 24, color: 'red' }}>{error}</p>
  if (!event) return <p style={{ padding: 24 }}>Loading...</p>

  return (
    <div style={{ padding: 24 }}>
      <Link to="/events">← Back to events</Link>
      <h1>{event.title}</h1>
      <p><strong>{event.event_date}</strong></p>
      <p>{event.description}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {isAdmin && (
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 420, margin: '16px 0' }}>
          <h3>Add photos</h3>
          <input type="file" accept="image/*" multiple onChange={e => setFiles([...e.target.files])} />
          <input placeholder="Caption (applies to all selected photos)" value={caption} onChange={e => setCaption(e.target.value)} />
          <button type="submit" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
        </form>
      )}

      <h2>Photo album</h2>
      {photos.length === 0 && <p>No photos in this album yet.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {photos.map(p => (
          <figure key={p.id} style={{ margin: 0 }}>
            <img src={p.image_url} alt={p.caption || 'event photo'} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8 }} />
            {p.caption && <figcaption>{p.caption}</figcaption>}
            {isAdmin && <button onClick={() => handleDelete(p.id)}>Delete</button>}
          </figure>
        ))}
      </div>
    </div>
  )
}
