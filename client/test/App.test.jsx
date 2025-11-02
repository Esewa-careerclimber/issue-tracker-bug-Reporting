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
  it('renders main landmark', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('displays the dashboard link', () => {
    render(<App />)
    // Look for the dashboard link in the navigation instead
    const dashboardLink = screen.getByText(/Dashboard/i, { selector: '.navLink' })
    expect(dashboardLink).toBeInTheDocument()
  })
})