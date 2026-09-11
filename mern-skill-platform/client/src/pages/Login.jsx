import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const { login, loading } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome, ${user.name}!`)
      navigate(user.role === 'faculty' ? '/faculty' : '/student')
    } catch (err) {
      const msg = err.response?.data?.message || (err.response?.data?.errors ? err.response.data.errors.map(e => e.msg || e.path).join(', ') : null) || err.message || 'Login failed'
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🎓</div>
          <h1 className="text-3xl font-bold text-white">SkillTrack Platform</h1>
          <p className="text-indigo-200 mt-2">Faculty Guided Student Skill Enhancement</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" required value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="input-field" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs text-center text-gray-500 font-medium mb-3">⚡ Quick Demo Login:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm({ email: 'faculty@college.edu', password: 'password123' })}
                className="text-xs py-2 px-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-medium border border-indigo-200 transition">
                👨‍🏫 Faculty Demo
              </button>
              <button
                type="button"
                onClick={() => setForm({ email: 'student@college.edu', password: 'password123' })}
                className="text-xs py-2 px-3 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-medium border border-purple-200 transition">
                👨‍🎓 Student Demo
              </button>
            </div>
          </div>

          <p className="text-center text-gray-500 mt-6 text-sm">
            New student?{' '}
            <Link to="/register" className="text-indigo-600 font-medium hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
