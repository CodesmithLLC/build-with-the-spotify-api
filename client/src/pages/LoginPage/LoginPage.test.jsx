import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import LoginPage from './LoginPage'

// Mock the Spotify icon import
vi.mock('../../../assets/spotify.svg', () => ({
  default: 'mocked-spotify-icon.svg',
}))

describe('LoginPage', () => {
  const mockOnLogin = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the login page with correct content', () => {
    render(<LoginPage onLogin={mockOnLogin} />)

    expect(
      screen.getByRole('heading', { name: /spotify dashboard/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/connect your spotify account to view/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/your top tracks & artists/i)).toBeInTheDocument()

    const loginButton = screen.getByRole('button', {
      name: /log into spotify/i,
    })
    expect(loginButton).toBeInTheDocument()
  })

  it('renders Spotify icon in login button', () => {
    render(<LoginPage onLogin={mockOnLogin} />)

    const spotifyIcon = screen.getByAltText('Spotify')
    expect(spotifyIcon).toBeInTheDocument()
    expect(spotifyIcon).toHaveAttribute('src', 'mocked-spotify-icon.svg')
    expect(spotifyIcon).toHaveAttribute('width', '24')
    expect(spotifyIcon).toHaveAttribute('height', '24')
  })

  it('calls onLogin when login button is clicked', async () => {
    const user = userEvent.setup()
    render(<LoginPage onLogin={mockOnLogin} />)

    const loginButton = screen.getByRole('button', {
      name: /log into spotify/i,
    })
    await user.click(loginButton)

    expect(mockOnLogin).toHaveBeenCalledTimes(1)
  })

  it('applies correct CSS classes', () => {
    render(<LoginPage onLogin={mockOnLogin} />)

    const homePageDiv = screen.getByRole('heading').closest('.home-page')
    expect(homePageDiv).toBeInTheDocument()

    const homeContentDiv = screen.getByRole('heading').closest('.home-content')
    expect(homeContentDiv).toBeInTheDocument()

    const loginButton = screen.getByRole('button', {
      name: /log into spotify/i,
    })
    expect(loginButton).toHaveClass('spotify-login-btn')
  })

  it('handles missing onLogin prop gracefully', () => {
    // This test ensures the component doesn't crash if onLogin is undefined
    expect(() => {
      render(<LoginPage />)
    }).not.toThrow()
  })
})
