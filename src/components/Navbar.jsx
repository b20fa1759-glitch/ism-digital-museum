import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav style={{ display: 'flex', gap: 16, padding: 16, borderBottom: '1px solid #ccc' }}>
      <Link to="/">Нүүр</Link>
      <Link to="/exhibits">Үзмэрүүд</Link>
      <Link to="/teachers">Багш нар</Link>
      <Link to="/events">Арга хэмжээ</Link>
      <Link to="/history">Түүх</Link>
      <Link to="/timeline">Цаг хугацааны машин</Link>
      <Link to="/creators">Бүтээгчид</Link>
      {user && <Link to="/exhibits/new">Үзмэр нэмэх</Link>}
      <span style={{ marginLeft: 'auto' }} />
      {user ? (
        <>
          <span>{user.email}</span>
          <button onClick={handleLogout}>Гарах</button>
        </>
      ) : (
        <>
          <Link to="/login">Нэвтрэх</Link>
          <Link to="/register">Бүртгүүлэх</Link>
        </>
      )}
    </nav>
  )
}
