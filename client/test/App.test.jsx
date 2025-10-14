import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../src/App'

describe('App', () => {
  it('renders main landmark', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('displays the dashboard heading', () => {
    render(<App />)
    // Use a more specific selector that targets the page title
    const heading = screen.getByText(/Dashboard/i, { selector: '.pageTitle' })
    expect(heading).toBeInTheDocument()
  })
})