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
    const heading = screen.getByText(/Got an Issue with Your Team/i)
    expect(heading).toBeInTheDocument()
  })

  it('displays the Access Your Workspace section', () => {
    render(<App />)
    const workspaceHeading = screen.getByText(/Access Your Workspace/i)
    expect(workspaceHeading).toBeInTheDocument()
  })
})