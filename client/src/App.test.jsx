import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import App from './App'

// Mock the child components
vi.mock('./pages/LoginPage', () => ({
  default: ({ onLogin }) => (
    <div data-testid="login-page">
      <button onClick={onLogin}>Login</button>
    </div>
  ),
}))

vi.mock('./pages/Dashboard', () => ({
  default: ({ accessToken, onLogout }) => (
    <div data-testid="dashboard">
      <span data-testid="access-token">{accessToken}</span>
      <button onClick={onLogout}>Logout</button>
    </div>
  ),
}))

describe('App', () => {
  beforeEach(() => {
    // Reset URL search params
    window.location.search = ''
    vi.clearAllMocks()
  })

  describe('Initial Authentication State', () => {
    it('renders LoginPage when not authenticated', () => {
      localStorage.getItem.mockReturnValue(null)

      render(<App />)

      expect(screen.getByTestId('login-page')).toBeInTheDocument()
      expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
    })

    it('renders Dashboard when valid token exists in localStorage', async () => {
      const mockToken = 'valid-token'
      const futureExpiry = (new Date().getTime() + 3600000).toString()

      localStorage.getItem
        .mockReturnValueOnce(mockToken)
        .mockReturnValueOnce(futureExpiry)

      render(<App />)

      await waitFor(() => {
        expect(screen.getByTestId('dashboard')).toBeInTheDocument()
        expect(screen.getByTestId('access-token')).toHaveTextContent(mockToken)
      })
    })

    it('clears expired token and shows LoginPage', () => {
      const mockToken = 'expired-token'
      const pastExpiry = (new Date().getTime() - 3600000).toString()

      localStorage.getItem
        .mockReturnValueOnce(mockToken)
        .mockReturnValueOnce(pastExpiry)

      render(<App />)

      expect(localStorage.removeItem).toHaveBeenCalledWith(
        'spotify_access_token'
      )
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        'spotify_token_expiry'
      )
      expect(screen.getByTestId('login-page')).toBeInTheDocument()
    })
  })

  describe('Authentication Callback Handling', () => {
    it('processes successful authentication callback from URL', async () => {
      window.location.search = '?access_token=new-token&expires_in=3600'

      render(<App />)

      await waitFor(() => {
        expect(screen.getByTestId('dashboard')).toBeInTheDocument()
        expect(screen.getByTestId('access-token')).toHaveTextContent(
          'new-token'
        )
      })

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'spotify_access_token',
        'new-token'
      )
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'spotify_token_expiry',
        expect.any(String)
      )
      expect(window.history.replaceState).toHaveBeenCalledWith(null, '', '/')
    })

    it('handles authentication error from URL', () => {
      window.location.search = '?error=access_denied'
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(<App />)

      expect(consoleSpy).toHaveBeenCalledWith(
        'Authentication error:',
        'access_denied'
      )
      expect(window.history.replaceState).toHaveBeenCalledWith(null, '', '/')
      expect(screen.getByTestId('login-page')).toBeInTheDocument()

      consoleSpy.mockRestore()
    })

    it('ignores incomplete callback parameters', () => {
      window.location.search = '?access_token=token-only'

      render(<App />)

      expect(localStorage.setItem).not.toHaveBeenCalled()
      expect(screen.getByTestId('login-page')).toBeInTheDocument()
    })
  })

  describe('Login Flow', () => {
    it('redirects to server login endpoint when login is clicked', async () => {
      localStorage.getItem.mockReturnValue(null)

      render(<App />)

      const loginButton = screen.getByRole('button', { name: 'Login' })
      loginButton.click()

      expect(window.location.assign).toHaveBeenCalledWith(
        'http://localhost:3000/api/spotify-login'
      )
    })
  })

  describe('Logout Flow', () => {
    it('clears authentication state and localStorage on logout', async () => {
      const mockToken = 'valid-token'
      const futureExpiry = (new Date().getTime() + 3600000).toString()

      localStorage.getItem
        .mockReturnValueOnce(mockToken)
        .mockReturnValueOnce(futureExpiry)

      render(<App />)

      await waitFor(() => {
        expect(screen.getByTestId('dashboard')).toBeInTheDocument()
      })

      const logoutButton = screen.getByRole('button', { name: 'Logout' })
      logoutButton.click()

      expect(localStorage.removeItem).toHaveBeenCalledWith(
        'spotify_access_token'
      )
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        'spotify_token_expiry'
      )

      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument()
      })
    })
  })

  describe('Token Expiry Calculation', () => {
    it('calculates correct expiry time from expires_in parameter', async () => {
      const mockNow = 1000000000000
      vi.spyOn(Date.prototype, 'getTime').mockReturnValue(mockNow)

      window.location.search = '?access_token=test-token&expires_in=3600'

      render(<App />)

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'spotify_token_expiry',
          (mockNow + 3600 * 1000).toString()
        )
      })
    })
  })
})
