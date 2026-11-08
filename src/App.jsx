import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Exhibits from './pages/Exhibits'
import ExhibitDetail from './pages/ExhibitDetail'
import ExhibitForm from './pages/ExhibitForm'
import Login from './pages/Login'
import Register from './pages/Register'
import Teachers from './pages/Teachers'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import History from './pages/History'
import Timeline from './pages/Timeline'

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exhibits" element={<Exhibits />} />
        <Route path="/exhibits/new" element={<ExhibitForm />} />
        <Route path="/exhibits/:id" element={<ExhibitDetail />} />
        <Route path="/exhibits/:id/edit" element={<ExhibitForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/history" element={<History />} />
        <Route path="/timeline" element={<Timeline />} />
      </Routes>
    </AuthProvider>
  )
}
