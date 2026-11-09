import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>ISM Дижитал музей</strong>
        <p>Санхүү эдийн засгийн их сургууль · Мэдээллийн системийн менежментийн тэнхим</p>
      </div>
      <div className="footer-links">
        <Link to="/exhibits">Үзмэрүүд</Link>
        <Link to="/teachers">Багш нар</Link>
        <Link to="/events">Арга хэмжээ</Link>
        <Link to="/history">Түүх</Link>
      </div>
      <p className="copy">© 2026 ISM Дижитал музей. Бүх эрх хуулиар хамгаалагдсан.</p>
    </footer>
  )
}
