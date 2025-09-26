import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../src/App'

describe('App', () => {
  it('renders main landmark', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('displays the main heading', () => {
    render(<App />)
    const heading = screen.getByRole('heading', { name: /vite \+ react/i })
    expect(heading).toBeInTheDocument()
  })
})