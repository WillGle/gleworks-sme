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

test('renders the login page', () => {
  renderAtRoute('/login')
  expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
})

test('renders the signup page', () => {
  renderAtRoute('/signup')
  expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument()
})

test('renders the forgot password page', () => {
  renderAtRoute('/lost-password')
  expect(screen.getByRole('heading', { name: 'Forgot Password' })).toBeInTheDocument()
})

test('renders the not found page for unknown routes', () => {
  renderAtRoute('/unknown')
  expect(screen.getByRole('heading', { name: '404 - Page Not Found' })).toBeInTheDocument()
})
