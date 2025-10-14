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
    const heading = screen.getByText(/Dashboard/i)
    expect(heading).toBeInTheDocument()
  })
})