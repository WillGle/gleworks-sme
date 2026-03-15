// Covers validation, login success, and role-based redirect behavior.
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Login from '@components/LoginSignupPassword/Login'

const { mockLogin, mockNavigate } = vi.hoisted(() => ({
  mockLogin: vi.fn(),
  mockNavigate: vi.fn(),
}))

vi.mock('../api', async () => {
  const actual = await vi.importActual<typeof import('../api')>('../api')
  return {
    ...actual,
    login: mockLogin,
  }
})

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )

test('shows an error when required fields are missing', async () => {
  renderLogin()

  fireEvent.click(screen.getByRole('button', { name: 'Login' }))

  expect(await screen.findByText('Please fill in all required fields.')).toBeInTheDocument()
  expect(mockLogin).not.toHaveBeenCalled()
})

test('shows an error when email format is invalid', async () => {
  renderLogin()

  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'not-an-email' },
  })
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'password123!' },
  })

  fireEvent.click(screen.getByRole('button', { name: 'Login' }))

  expect(await screen.findByText('Invalid email address.')).toBeInTheDocument()
  expect(mockLogin).not.toHaveBeenCalled()
})

test('logs in and routes admins to the dashboard', async () => {
  mockLogin.mockResolvedValue({
    id: 'admin-1',
    token: 'token-123',
    role: 'admin',
  })

  renderLogin()

  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'admin@example.com' },
  })
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'password123!' },
  })

  fireEvent.click(screen.getByRole('button', { name: 'Login' }))

  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalledWith('admin@example.com', 'password123!')
  })

  expect(localStorage.getItem('userId')).toBe('admin-1')
  expect(localStorage.getItem('token')).toBe('token-123')
  expect(localStorage.getItem('role')).toBe('admin')
  expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard')
})
