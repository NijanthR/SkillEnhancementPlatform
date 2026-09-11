import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'

// Auth Pages
import Login from './pages/Login'
import Register from './pages/Register'

// Student Pages
import StudentDashboard from './pages/student/Dashboard'
import StudentSkills from './pages/student/Skills'
import StudentCerts from './pages/student/Certificates'
import StudentCompetitions from './pages/student/Competitions'
import StudentLeaderboard from './pages/student/Leaderboard'
import StudentFeedback from './pages/student/Feedback'
import StudentProfile from './pages/student/Profile'
import StudentResources from './pages/student/Resources'

// Faculty Pages
import FacultyDashboard from './pages/faculty/Dashboard'
import FacultyStudents from './pages/faculty/Students'
import FacultyStudentDetail from './pages/faculty/StudentDetail'
import FacultyVerify from './pages/faculty/Verify'
import FacultyAnalytics from './pages/faculty/Analytics'
import FacultyResources from './pages/faculty/Resources'
import FacultyFeedback from './pages/faculty/Feedback'

const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext)
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'faculty' ? '/faculty' : '/student'} replace />
  }
  return children
}

export default function App() {
  const { user } = useContext(AuthContext)
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route path="/student"              element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />
        <Route path="/student/skills"       element={<PrivateRoute role="student"><StudentSkills /></PrivateRoute>} />
        <Route path="/student/certificates" element={<PrivateRoute role="student"><StudentCerts /></PrivateRoute>} />
        <Route path="/student/competitions" element={<PrivateRoute role="student"><StudentCompetitions /></PrivateRoute>} />
        <Route path="/student/leaderboard"  element={<PrivateRoute role="student"><StudentLeaderboard /></PrivateRoute>} />
        <Route path="/student/feedback"     element={<PrivateRoute role="student"><StudentFeedback /></PrivateRoute>} />
        <Route path="/student/profile"      element={<PrivateRoute role="student"><StudentProfile /></PrivateRoute>} />
        <Route path="/student/resources"    element={<PrivateRoute role="student"><StudentResources /></PrivateRoute>} />

        {/* Faculty Routes */}
        <Route path="/faculty"              element={<PrivateRoute role="faculty"><FacultyDashboard /></PrivateRoute>} />
        <Route path="/faculty/students"     element={<PrivateRoute role="faculty"><FacultyStudents /></PrivateRoute>} />
        <Route path="/faculty/students/:id" element={<PrivateRoute role="faculty"><FacultyStudentDetail /></PrivateRoute>} />
        <Route path="/faculty/verify"       element={<PrivateRoute role="faculty"><FacultyVerify /></PrivateRoute>} />
        <Route path="/faculty/analytics"    element={<PrivateRoute role="faculty"><FacultyAnalytics /></PrivateRoute>} />
        <Route path="/faculty/resources"    element={<PrivateRoute role="faculty"><FacultyResources /></PrivateRoute>} />
        <Route path="/faculty/feedback"     element={<PrivateRoute role="faculty"><FacultyFeedback /></PrivateRoute>} />

        <Route path="/" element={
          user
            ? <Navigate to={user.role === 'faculty' ? '/faculty' : '/student'} replace />
            : <Navigate to="/login" replace />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
