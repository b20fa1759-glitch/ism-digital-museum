import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } },
    })
    if (error) setError(error.message)
    else navigate('/')
  }

  return (
    <div style={{ padding: 24, maxWidth: 360 }}>
      <h1>Бүртгүүлэх</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input placeholder="Нэр" value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="И-мэйл" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Нууц үг (дор хаяж 6 тэмдэгт)" value={password}
               onChange={e => setPassword(e.target.value)} minLength={6} required />
        <button type="submit">Бүртгэл үүсгэх</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  )
}
