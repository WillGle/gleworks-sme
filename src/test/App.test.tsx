// Smoke tests for the main route shell and a few public pages.
import { render, screen } from '@testing-library/react'
import App from '../App'

const renderAtRoute = (route = '/home') => {
  window.history.pushState({}, 'Test page', route)
  return render(<App />)
}

test('renders the landing page', () => {
  renderAtRoute('/home')
  expect(
    screen.getByRole('heading', {
      name: 'Masterpiece comes with immaculate craftsmanship',
    })
  ).toBeInTheDocument()
})

// Routes below are lazily loaded, so the heading appears a tick after render
// (Suspense shows a fallback first) — assertions use async findBy*.
test('renders the login page', async () => {
  renderAtRoute('/login')
  expect(await screen.findByRole('heading', { name: 'Login' })).toBeInTheDocument()
})

test('renders the signup page', async () => {
  renderAtRoute('/signup')
  expect(await screen.findByRole('heading', { name: 'Sign Up' })).toBeInTheDocument()
})

test('renders the forgot password page', async () => {
  renderAtRoute('/lost-password')
  expect(await screen.findByRole('heading', { name: 'Forgot Password' })).toBeInTheDocument()
})

test('hides the header and footer on password reset routes', async () => {
  localStorage.setItem('token', 'token-123')
  localStorage.setItem('role', 'user')

  renderAtRoute('/user/new-password')

  expect(await screen.findByRole('heading', { name: 'Reset Password' })).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: 'Service' })).not.toBeInTheDocument()
  expect(screen.queryByText('STAY IN THE LOOP')).not.toBeInTheDocument()
})

test('renders the not found page for unknown routes', async () => {
  renderAtRoute('/unknown')
  expect(await screen.findByRole('heading', { name: '404 - Page Not Found' })).toBeInTheDocument()
})

test('renders the policies page with anchor navigation', async () => {
  renderAtRoute('/policies')

  expect(await screen.findByRole('heading', { name: 'Term of Service' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Return Policy' })).toBeInTheDocument()

  const privacyLinks = screen.getAllByRole('link', { name: 'Privacy Policy' })
  expect(privacyLinks.some((link) => link.getAttribute('href') === '#privacy-policy')).toBe(true)
})
