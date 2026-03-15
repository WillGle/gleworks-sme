// Covers forgot-password validation and submission behavior.
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import LostPass from '@components/LoginSignupPassword/LostPass'

const { mockForgotPassword, mockNavigate, mockDotLottieDestroy } = vi.hoisted(() => ({
  mockForgotPassword: vi.fn(),
  mockNavigate: vi.fn(),
  mockDotLottieDestroy: vi.fn(),
}))

vi.mock('../api', () => ({
  forgotPassword: mockForgotPassword,
}))

vi.mock('@lottiefiles/dotlottie-web', () => ({
  DotLottie: class {
    destroy = mockDotLottieDestroy
  },
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderLostPass = () =>
  render(
    <MemoryRouter>
      <LostPass />
    </MemoryRouter>
  )

test('shows an error when email is missing', async () => {
  renderLostPass()

  fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link' }))

  expect(await screen.findByText('Please enter your email address.')).toBeInTheDocument()
  expect(mockForgotPassword).not.toHaveBeenCalled()
})

test('shows an error when email is invalid', async () => {
  renderLostPass()

  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'invalid-email' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link' }))

  expect(await screen.findByText('Invalid email address.')).toBeInTheDocument()
  expect(mockForgotPassword).not.toHaveBeenCalled()
})

test('shows the API success message after sending reset link', async () => {
  mockForgotPassword.mockResolvedValue({ message: 'Reset email sent.' })

  renderLostPass()

  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'user@example.com' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link' }))

  await waitFor(() => {
    expect(mockForgotPassword).toHaveBeenCalledWith('user@example.com')
  })

  expect(await screen.findByText('Reset email sent.')).toBeInTheDocument()
})
