import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import App from '../src/App'

// Wrapper component for Router
const AppWithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

describe('App', () => {
  it('renders the landing page heading', () => {
    render(<App />)
    const heading = screen.getByText(/Track Issues/i)
    expect(heading).toBeInTheDocument()
  })

  it('displays the Ship Faster text', () => {
    render(<App />)
    const shipText = screen.getByText(/Ship Faster/i)
    expect(shipText).toBeInTheDocument()
  })

  it('displays the login and signup buttons', () => {
    render(<App />)
    const loginButton = screen.getByText(/Login/i)
    const signupButton = screen.getByText(/Signup/i)
    expect(loginButton).toBeInTheDocument()
    expect(signupButton).toBeInTheDocument()
  })

  it('displays the Powered by AI text', () => {
    render(<App />)
    const aiText = screen.getByText(/Powered by/i)
    expect(aiText).toBeInTheDocument()
  })
})