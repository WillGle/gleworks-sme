// Covers the guest/admin/user rules used by the route guard.
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '@components/ProtectedRoute'

// Render the guard inside real routes so redirects can be asserted.
const renderProtectedRoute = (initialPath: string) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <div>Admin Dashboard</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/account"
          element={
            <ProtectedRoute>
              <div>User Account</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/not-authorized" element={<div>Not Authorized</div>} />
      </Routes>
    </MemoryRouter>
  )

test('redirects guests to login', () => {
  renderProtectedRoute('/admin/dashboard')

  expect(screen.getByText('Login Page')).toBeInTheDocument()
})

test('blocks non-admin users from admin routes', () => {
  localStorage.setItem('token', 'token')
  localStorage.setItem('role', 'user')

  renderProtectedRoute('/admin/dashboard')

  expect(screen.getByText('Not Authorized')).toBeInTheDocument()
})

test('renders protected content for a matching user role', () => {
  localStorage.setItem('token', 'token')
  localStorage.setItem('role', 'user')

  renderProtectedRoute('/user/account')

  expect(screen.getByText('User Account')).toBeInTheDocument()
})
