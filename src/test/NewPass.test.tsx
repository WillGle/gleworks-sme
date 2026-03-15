// Covers password reset validation and the success redirect flow.
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import NewPass from '@components/LoginSignupPassword/NewPass'

const { mockResetPassword, mockNavigate } = vi.hoisted(() => ({
  mockResetPassword: vi.fn(),
  mockNavigate: vi.fn(),
}))

vi.mock('../api', async () => {
  const actual = await vi.importActual<typeof import('../api')>('../api')
  return {
    ...actual,
    resetPassword: mockResetPassword,
  }
})

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderNewPass = () =>
  render(
    <MemoryRouter>
      <NewPass />
    </MemoryRouter>
  )

test('shows an error when passwords do not match', async () => {
  renderNewPass()

  fireEvent.change(screen.getByLabelText('New Password'), {
    target: { value: 'Validpass1!' },
  })
  fireEvent.change(screen.getByLabelText('Confirm password'), {
    target: { value: 'Different1!' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

  expect(await screen.findByText('Password and Confirm Password do not match.')).toBeInTheDocument()
  expect(mockResetPassword).not.toHaveBeenCalled()
})

test('shows an error when user info is missing from storage', async () => {
  renderNewPass()

  fireEvent.change(screen.getByLabelText('New Password'), {
    target: { value: 'Validpass1!' },
  })
  fireEvent.change(screen.getByLabelText('Confirm password'), {
    target: { value: 'Validpass1!' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

  expect(await screen.findByText('User information is missing. Please log in again.')).toBeInTheDocument()
  expect(mockResetPassword).not.toHaveBeenCalled()
})

test('resets the password and navigates home after success', async () => {
  const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout')
  mockResetPassword.mockResolvedValue({})
  localStorage.setItem('user', JSON.stringify({ id: 'user-1' }))

  renderNewPass()

  fireEvent.change(screen.getByLabelText('New Password'), {
    target: { value: 'Validpass1!' },
  })
  fireEvent.change(screen.getByLabelText('Confirm password'), {
    target: { value: 'Validpass1!' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

  await waitFor(() => {
    expect(mockResetPassword).toHaveBeenCalledWith('user-1', 'Validpass1!')
  })

  expect(await screen.findByText('Your password has been updated successfully!')).toBeInTheDocument()

  const redirectTimeout = setTimeoutSpy.mock.calls.find((call) => call[1] === 3000)
  const scheduledCallback = redirectTimeout?.[0] as (() => void) | undefined
  expect(scheduledCallback).toBeDefined()
  scheduledCallback?.()
  expect(mockNavigate).toHaveBeenCalledWith('/home')
  setTimeoutSpy.mockRestore()
})
