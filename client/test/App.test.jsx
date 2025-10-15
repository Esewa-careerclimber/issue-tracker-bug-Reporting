import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../src/App'

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