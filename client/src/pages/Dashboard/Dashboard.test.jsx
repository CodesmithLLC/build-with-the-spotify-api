import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Dashboard from './Dashboard'

const mockAccessToken = 'mock-access-token'
const mockOnLogout = vi.fn()

const mockTrackData = {
  items: [
    {
      id: 'track1',
      name: 'Test Track 1',
      popularity: 85,
      album: {
        name: 'Test Album',
        images: [{ url: 'https://example.com/album1.jpg' }],
      },
      artists: [{ name: 'Artist 1' }, { name: 'Artist 2' }],
    },
    {
      id: 'track2',
      name: 'Test Track 2',
      popularity: 92,
      album: {
        name: 'Another Album',
        images: [{ url: 'https://example.com/album2.jpg' }],
      },
      artists: [{ name: 'Artist 3' }],
    },
  ],
}

const mockArtistData = {
  items: [
    {
      id: 'artist1',
      name: 'Test Artist 1',
      popularity: 78,
      genres: ['pop', 'rock', 'indie'],
      followers: { total: 1234567 },
      images: [{ url: 'https://example.com/artist1.jpg' }],
    },
    {
      id: 'artist2',
      name: 'Test Artist 2',
      popularity: 88,
      genres: ['electronic', 'dance'],
      followers: { total: 987654 },
      images: [{ url: 'https://example.com/artist2.jpg' }],
    },
  ],
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetch.mockClear()
  })

  describe('Initial Rendering', () => {
    it('renders dashboard with correct initial state', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTrackData,
      })

      render(
        <Dashboard accessToken={mockAccessToken} onLogout={mockOnLogout} />
      )

      expect(screen.getByText('your top tracks')).toBeInTheDocument()
      expect(screen.getByDisplayValue('last 6 months')).toBeInTheDocument()
      expect(screen.getByText('top tracks')).toHaveClass('active')
    })

    it('shows loading state initially', async () => {
      fetch.mockImplementation(() => new Promise(() => {})) // Never resolves

      render(
        <Dashboard accessToken={mockAccessToken} onLogout={mockOnLogout} />
      )

      expect(
        screen.getByText('Loading your Spotify data...')
      ).toBeInTheDocument()
    })
  })

  describe('API Integration', () => {
    it('fetches top tracks on mount', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTrackData,
      })

      render(
        <Dashboard accessToken={mockAccessToken} onLogout={mockOnLogout} />
      )

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=20',
          {
            headers: {
              Authorization: `Bearer ${mockAccessToken}`,
            },
          }
        )
      })
    })

    it('handles API errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      fetch.mockRejectedValueOnce(new Error('API Error'))

      render(
        <Dashboard accessToken={mockAccessToken} onLogout={mockOnLogout} />
      )

      await waitFor(() => {
        expect(screen.getByText('Error: API Error')).toBeInTheDocument()
      })

      consoleSpy.mockRestore()
    })

    it('handles HTTP error responses', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      })

      render(
        <Dashboard accessToken={mockAccessToken} onLogout={mockOnLogout} />
      )

      await waitFor(() => {
        expect(
          screen.getByText(/Error: Failed to fetch from tracks/)
        ).toBeInTheDocument()
      })

      consoleSpy.mockRestore()
    })
  })

  describe('View Switching', () => {
    it('switches from tracks to artists view', async () => {
      const user = userEvent.setup()

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTrackData,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockArtistData,
        })

      render(
        <Dashboard accessToken={mockAccessToken} onLogout={mockOnLogout} />
      )

      await waitFor(() => {
        expect(screen.getByText('Test Track 1')).toBeInTheDocument()
      })

      const artistsButton = screen.getByText('top artists')
      await user.click(artistsButton)

      await waitFor(() => {
        expect(screen.getByText('your top artists')).toBeInTheDocument()
        expect(screen.getByText('Test Artist 1')).toBeInTheDocument()
        expect(artistsButton).toHaveClass('active')
      })

      expect(fetch).toHaveBeenCalledTimes(2)
    })

    it('closes mobile drawer when view changes', async () => {
      const user = userEvent.setup()

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTrackData,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockArtistData,
        })

      render(
        <Dashboard accessToken={mockAccessToken} onLogout={mockOnLogout} />
      )

      // Open drawer
      const menuButton = screen.getByText('☰')
      await user.click(menuButton)

      expect(screen.getByRole('button', { name: 'x' })).toBeInTheDocument()

      // Switch view (should close drawer)
      const artistsButton = screen.getByText('top artists')
      await user.click(artistsButton)

      // Drawer should be closed
      const drawer = document.querySelector('.drawer')
      expect(drawer).not.toHaveClass('drawer-open')
    })
  })

  describe('Time Range Selection', () => {
    it('refetches data when time range changes', async () => {
      const user = userEvent.setup()

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockTrackData,
      })

      render(
        <Dashboard accessToken={mockAccessToken} onLogout={mockOnLogout} />
      )

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(1)
      })

      const timeRangeSelect = screen.getByDisplayValue('last 6 months')
      await user.selectOptions(timeRangeSelect, 'short_term')

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(2)
        expect(fetch).toHaveBeenLastCalledWith(
          'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=20',
          expect.any(Object)
        )
      })
    })

    it('displays all time range options', () => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockTrackData,
      })

      render(
        <Dashboard accessToken={mockAccessToken} onLogout={mockOnLogout} />
      )

      expect(screen.getByText('last 4 weeks')).toBeInTheDocument()
      expect(screen.getByText('last 6 months')).toBeInTheDocument()
      expect(screen.getByText('last year')).toBeInTheDocument()
    })
  })

  describe('Data Rendering', () => {
    it('renders track data correctly', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTrackData,
      })

      render(
        <Dashboard accessToken={mockAccessToken} onLogout={mockOnLogout} />
      )

      await waitFor(() => {
        expect(screen.getByText('Test Track 1')).toBeInTheDocument()
        expect(screen.getByText('Test Track 2')).toBeInTheDocument()
        expect(screen.getByText('Artist 1, Artist 2')).toBeInTheDocument()
        expect(screen.getByText('Artist 3')).toBeInTheDocument()
        expect(screen.getByText('Test Album')).toBeInTheDocument()
        expect(screen.getByText('85%')).toBeInTheDocument()
        expect(screen.getByText('92%')).toBeInTheDocument()
      })

      // Check rankings
      expect(screen.getByText('#1')).toBeInTheDocument()
      expect(screen.getByText('#2')).toBeInTheDocument()
    })

    it('renders artist data correctly', async () => {
      const user = userEvent.setup()

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTrackData,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockArtistData,
        })

      render(
        <Dashboard accessToken={mockAccessToken} onLogout={mockOnLogout} />
      )

      const artistsButton = screen.getByText('top artists')
      await user.click(artistsButton)

      await waitFor(() => {
        expect(screen.getByText('Test Artist 1')).toBeInTheDocument()
        expect(screen.getByText('Test Artist 2')).toBeInTheDocument()
        expect(screen.getByText('pop, rock, indie')).toBeInTheDocument()
        expect(screen.getByText('electronic, dance')).toBeInTheDocument()
        expect(screen.getByText('1,234,567 followers')).toBeInTheDocument()
        expect(screen.getByText('987,654 followers')).toBeInTheDocument()
        expect(screen.getByText('78%')).toBeInTheDocument()
        expect(screen.getByText('88%')).toBeInTheDocument()
      })
    })

    it('handles missing image data gracefully', async () => {
      const trackDataNoImages = {
        items: [
          {
            id: 'track1',
            name: 'Test Track',
            popularity: 85,
            album: {
              name: 'Test Album',
              images: [],
            },
            artists: [{ name: 'Artist' }],
          },
        ],
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => trackDataNoImages,
      })

      render(
        <Dashboard accessToken={mockAccessToken} onLogout={mockOnLogout} />
      )

      await waitFor(() => {
        expect(screen.getByText('Test Track')).toBeInTheDocument()
      })

      // Should not crash when accessing images[0]?.url
      expect(screen.getByAltText('Test Album')).toBeInTheDocument()
    })
  })

  describe('Mobile Drawer', () => {
    it('opens and closes mobile drawer', async () => {
      const user = userEvent.setup()

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockTrackData,
      })

      render(
        <Dashboard accessToken={mockAccessToken} onLogout={mockOnLogout} />
      )

      // Initially closed - check drawer class instead of button visibility
      const drawer = document.querySelector('.drawer')
      expect(drawer).not.toHaveClass('drawer-open')

      // Open drawer
      const menuButton = screen.getByText('☰')
      await user.click(menuButton)

      expect(drawer).toHaveClass('drawer-open')
      expect(screen.getByText('spotify dashboard')).toBeInTheDocument()

      // Close drawer via close button
      const closeButton = screen.getByRole('button', { name: 'x' })
      await user.click(closeButton)

      expect(drawer).not.toHaveClass('drawer-open')
    })

    it('closes drawer when overlay is clicked', async () => {
      const user = userEvent.setup()

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockTrackData,
      })

      render(
        <Dashboard accessToken={mockAccessToken} onLogout={mockOnLogout} />
      )

      // Open drawer
      const menuButton = screen.getByText('☰')
      await user.click(menuButton)

      const drawer = document.querySelector('.drawer')
      expect(drawer).toHaveClass('drawer-open')

      // Click overlay to close
      const overlay = document.querySelector('.drawer-overlay')
      fireEvent.click(overlay)

      expect(drawer).not.toHaveClass('drawer-open')
    })
  })

  describe('Logout Functionality', () => {
    it('calls onLogout when logout button is clicked', async () => {
      const user = userEvent.setup()

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockTrackData,
      })

      render(
        <Dashboard accessToken={mockAccessToken} onLogout={mockOnLogout} />
      )

      // Open drawer to access logout button
      const menuButton = screen.getByText('☰')
      await user.click(menuButton)

      const logoutButton = screen.getByText('log out')
      await user.click(logoutButton)

      expect(mockOnLogout).toHaveBeenCalledTimes(1)
    })
  })

  describe('Empty State Handling', () => {
    it('handles empty track data', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [] }),
      })

      render(
        <Dashboard accessToken={mockAccessToken} onLogout={mockOnLogout} />
      )

      await waitFor(() => {
        expect(
          screen.queryByText('Loading your Spotify data...')
        ).not.toBeInTheDocument()
      })

      // Should not crash with empty data
      const dataList = document.querySelector('.data-list')
      expect(dataList).toBeInTheDocument()
      expect(dataList.children).toHaveLength(0)
    })
  })
})
