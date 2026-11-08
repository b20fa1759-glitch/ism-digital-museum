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
      <Link to="/">Home</Link>
      <Link to="/exhibits">Exhibits</Link>
      <Link to="/teachers">Teachers</Link>
      <Link to="/events">Events</Link>
      <Link to="/history">History</Link>
      <Link to="/timeline">Time Machine</Link>
      {user && <Link to="/exhibits/new">Add exhibit</Link>}
      <span style={{ marginLeft: 'auto' }} />
      {user ? (
        <>
          <span>{user.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  )
}
