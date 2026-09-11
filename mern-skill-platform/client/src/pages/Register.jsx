import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', department: '', rollNumber: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const { register, loading } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleInputChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (fieldErrors[key]) {
      setFieldErrors(prev => ({ ...prev, [key]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFieldErrors({})

    // Client-side quick checks
    if (form.password.length < 6) {
      setFieldErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters long' }))
      toast.error('Password must be at least 6 characters long')
      return
    }

    try {
      const user = await register(form)
      toast.success('Account created!')
      navigate(user.role === 'faculty' ? '/faculty' : '/student')
    } catch (err) {
      const backendFieldErrors = err.response?.data?.fieldErrors
      if (backendFieldErrors) {
        setFieldErrors(backendFieldErrors)
      }
      const msg = err.response?.data?.message || (err.response?.data?.errors ? err.response.data.errors.map(e => e.msg || e.path).join(', ') : null) || err.message || 'Registration failed'
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md page-enter">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🎓</div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => handleInputChange('role', 'student')}
                className={`py-2 rounded-lg text-sm font-medium border-2 transition ${form.role === 'student' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500'}`}>
                👨‍🎓 Student
              </button>
              <button type="button" onClick={() => handleInputChange('role', 'faculty')}
                className={`py-2 rounded-lg text-sm font-medium border-2 transition ${form.role === 'faculty' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500'}`}>
                👨‍🏫 Faculty
              </button>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => handleInputChange('name', e.target.value)}
                className={`input-field ${fieldErrors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="e.g. John Doe"
              />
              {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => handleInputChange('email', e.target.value)}
                className={`input-field ${fieldErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="you@college.edu"
              />
              {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                required
                value={form.department}
                onChange={e => handleInputChange('department', e.target.value)}
                className={`input-field ${fieldErrors.department ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="e.g. Computer Science"
              />
              {fieldErrors.department && <p className="text-xs text-red-500 mt-1">{fieldErrors.department}</p>}
            </div>

            {/* Roll Number (Student only) */}
            {form.role === 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                <input
                  type="text"
                  required
                  value={form.rollNumber}
                  onChange={e => handleInputChange('rollNumber', e.target.value)}
                  className={`input-field ${fieldErrors.rollNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="e.g. CS2024001"
                />
                {fieldErrors.rollNumber && <p className="text-xs text-red-500 mt-1">{fieldErrors.rollNumber}</p>}
              </div>
            )}

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <span className="text-xs text-gray-400">Min. 6 characters</span>
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={e => handleInputChange('password', e.target.value)}
                className={`input-field ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="••••••••"
              />
              {fieldErrors.password ? (
                <p className="text-xs text-red-500 mt-1">⚠️ {fieldErrors.password}</p>
              ) : (
                <p className="text-xs text-gray-400 mt-1">Password must be at least 6 characters long</p>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-gray-500 mt-4 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
