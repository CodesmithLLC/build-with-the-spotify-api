import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import App from '../../App'
import {
  createMockTracksResponse,
  createMockArtistsResponse,
  setupValidToken,
  setupAuthCallback,
  mockFetchSuccess,
} from '../utils/testHelpers'

describe('App Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.location.search = ''
    fetch.mockClear()
  })

  it('completes full authentication flow from callback to dashboard', async () => {
    const user = userEvent.setup()

    // Setup authentication callback
    setupAuthCallback('integration-token', '3600')

    // Mock API responses
    const mockTracks = createMockTracksResponse(3)
    const mockArtists = createMockArtistsResponse(2)

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTracks,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockArtists,
      })

    render(<App />)

    // Should automatically authenticate and show dashboard
    await waitFor(() => {
      expect(screen.getByText('your top tracks')).toBeInTheDocument()
    })

    // Should store token in localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'spotify_access_token',
      'integration-token'
    )
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'spotify_token_expiry',
      expect.any(String)
    )

    // Should clean up URL
    expect(window.history.replaceState).toHaveBeenCalledWith(null, '', '/')

    // Should display track data
    await waitFor(() => {
      expect(screen.getByText('Track 1')).toBeInTheDocument()
      expect(screen.getByText('Track 2')).toBeInTheDocument()
    })

    // Switch to artists view
    const artistsButton = screen.getByText('top artists')
    await user.click(artistsButton)

    await waitFor(() => {
      expect(screen.getByText('your top artists')).toBeInTheDocument()
      expect(screen.getByText('Artist 1')).toBeInTheDocument()
    })

    // Test logout
    const menuButton = screen.getByText('☰')
    await user.click(menuButton)

    const logoutButton = screen.getByText('log out')
    await user.click(logoutButton)

    // Should return to login page
    expect(screen.getByText('spotify dashboard')).toBeInTheDocument()
    expect(
      screen.getByText(/connect your spotify account to view/i)
    ).toBeInTheDocument()

    // Should clear localStorage
    expect(localStorage.removeItem).toHaveBeenCalledWith('spotify_access_token')
    expect(localStorage.removeItem).toHaveBeenCalledWith('spotify_token_expiry')
  })

  it('handles persistent authentication across app reloads', async () => {
    userEvent.setup()

    // Setup valid token in localStorage
    setupValidToken('persistent-token')

    const mockTracks = createMockTracksResponse(2)
    mockFetchSuccess(mockTracks)

    render(<App />)

    // Should automatically authenticate and show dashboard
    await waitFor(() => {
      expect(screen.getByText('your top tracks')).toBeInTheDocument()
    })

    // Should fetch data with stored token
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/me/top/tracks'),
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer persistent-token',
        },
      })
    )

    await waitFor(() => {
      expect(screen.getByText('Track 1')).toBeInTheDocument()
    })
  })

  it('handles complete user journey with time range changes', async () => {
    const user = userEvent.setup()

    setupValidToken('journey-token')

    const mockTracks = createMockTracksResponse(2)
    const mockTracksShortTerm = createMockTracksResponse(1)

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTracks,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTracksShortTerm,
      })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Track 1')).toBeInTheDocument()
      expect(screen.getByText('Track 2')).toBeInTheDocument()
    })

    // Change time range
    const timeRangeSelect = screen.getByDisplayValue('last 6 months')
    await user.selectOptions(timeRangeSelect, 'short_term')

    // Should refetch with new time range
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2)
      expect(fetch).toHaveBeenLastCalledWith(
        expect.stringContaining('time_range=short_term'),
        expect.any(Object)
      )
    })
  })

  it('handles API errors gracefully throughout the app', async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    setupValidToken('error-token')

    // Mock API error
    fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument()
    })

    // Try switching views - should still handle errors
    const artistsButton = screen.getByText('top artists')

    fetch.mockRejectedValueOnce(new Error('Another error'))
    await user.click(artistsButton)

    await waitFor(() => {
      expect(screen.getByText('Error: Another error')).toBeInTheDocument()
    })

    consoleSpy.mockRestore()
  })

  it('handles mobile drawer interactions in full flow', async () => {
    const user = userEvent.setup()

    setupValidToken('mobile-token')
    const mockTracks = createMockTracksResponse(1)
    const mockArtists = createMockArtistsResponse(1)

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTracks,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockArtists,
      })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Track 1')).toBeInTheDocument()
    })

    // Open mobile drawer
    const menuButton = screen.getByText('☰')
    await user.click(menuButton)

    expect(screen.getByText('spotify dashboard')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'x' })).toBeInTheDocument()

    // Switch view via mobile drawer
    const artistsButton = screen.getByText('top artists')
    await user.click(artistsButton)

    // Drawer should close and view should change
    await waitFor(() => {
      const drawer = document.querySelector('.drawer')
      expect(drawer).not.toHaveClass('drawer-open')
      expect(screen.getByText('your top artists')).toBeInTheDocument()
    })
  })

  it('handles edge cases with empty API responses', async () => {
    setupValidToken('empty-token')

    // Mock empty responses
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [] }),
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('your top tracks')).toBeInTheDocument()
    })

    // Should not crash with empty data
    const dataList = document.querySelector('.data-list')
    expect(dataList).toBeInTheDocument()
    expect(dataList.children).toHaveLength(0)
  })

  it('preserves user preferences during session', async () => {
    const user = userEvent.setup()

    setupValidToken('preferences-token')

    const mockTracks = createMockTracksResponse(1)
    const mockArtists = createMockArtistsResponse(1)

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTracks,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockArtists,
      })

    render(<App />)

    // Change to artists view
    await waitFor(() => {
      expect(screen.getByText('Track 1')).toBeInTheDocument()
    })

    const artistsButton = screen.getByText('top artists')
    await user.click(artistsButton)

    await waitFor(() => {
      expect(screen.getByText('your top artists')).toBeInTheDocument()
    })

    // Change time range
    const timeRangeSelect = screen.getByDisplayValue('last 6 months')
    await user.selectOptions(timeRangeSelect, 'long_term')

    // Preferences should be maintained
    expect(screen.getByDisplayValue('last year')).toBeInTheDocument()
    expect(screen.getByText('top artists')).toHaveClass('active')
  })
})
