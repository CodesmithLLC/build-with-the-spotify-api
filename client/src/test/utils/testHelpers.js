import { render } from '@testing-library/react'

/**
 * Custom render function that includes common providers and setup
 */
export const renderWithProviders = (ui, options = {}) => {
  const { ...renderOptions } = options

  return render(ui, {
    ...renderOptions,
  })
}

/**
 * Mock Spotify API responses
 */
export const createMockSpotifyResponse = (data, ok = true) => ({
  ok,
  status: ok ? 200 : 400,
  json: async () => data,
})

/**
 * Create mock track data
 */
export const createMockTrack = (overrides = {}) => ({
  id: 'mock-track-id',
  name: 'Mock Track',
  popularity: 75,
  album: {
    name: 'Mock Album',
    images: [{ url: 'https://example.com/album.jpg' }],
  },
  artists: [{ name: 'Mock Artist' }],
  ...overrides,
})

/**
 * Create mock artist data
 */
export const createMockArtist = (overrides = {}) => ({
  id: 'mock-artist-id',
  name: 'Mock Artist',
  popularity: 80,
  genres: ['pop', 'rock'],
  followers: { total: 100000 },
  images: [{ url: 'https://example.com/artist.jpg' }],
  ...overrides,
})

/**
 * Create mock tracks response
 */
export const createMockTracksResponse = (count = 2) => ({
  items: Array.from({ length: count }, (_, index) =>
    createMockTrack({
      id: `track-${index}`,
      name: `Track ${index + 1}`,
      popularity: 80 + index,
    })
  ),
})

/**
 * Create mock artists response
 */
export const createMockArtistsResponse = (count = 2) => ({
  items: Array.from({ length: count }, (_, index) =>
    createMockArtist({
      id: `artist-${index}`,
      name: `Artist ${index + 1}`,
      popularity: 85 + index,
    })
  ),
})

/**
 * Setup localStorage with valid token
 */
export const setupValidToken = (
  token = 'valid-token',
  expiryOffset = 3600000
) => {
  const expiry = (new Date().getTime() + expiryOffset).toString()
  localStorage.getItem.mockImplementation((key) => {
    if (key === 'spotify_access_token') return token
    if (key === 'spotify_token_expiry') return expiry
    return null
  })
}

/**
 * Setup localStorage with expired token
 */
export const setupExpiredToken = (token = 'expired-token') => {
  const expiry = (new Date().getTime() - 3600000).toString()
  localStorage.getItem.mockImplementation((key) => {
    if (key === 'spotify_access_token') return token
    if (key === 'spotify_token_expiry') return expiry
    return null
  })
}

/**
 * Setup URL with authentication callback parameters
 */
export const setupAuthCallback = (
  accessToken = 'callback-token',
  expiresIn = '3600'
) => {
  window.location.search = `?access_token=${accessToken}&expires_in=${expiresIn}`
}

/**
 * Setup URL with authentication error
 */
export const setupAuthError = (error = 'access_denied') => {
  window.location.search = `?error=${error}`
}

/**
 * Wait for loading to complete
 */
export const waitForLoadingToComplete = async () => {
  const { waitForElementToBeRemoved, screen } = await import(
    '@testing-library/react'
  )
  try {
    await waitForElementToBeRemoved(
      () => screen.queryByText('Loading your Spotify data...'),
      { timeout: 3000 }
    )
  } catch (error) {
    // Loading text might not be present, which is fine
    console.error(error)
  }
}

/**
 * Mock fetch with success response
 */
export const mockFetchSuccess = (data) => {
  fetch.mockResolvedValueOnce(createMockSpotifyResponse(data))
}

/**
 * Mock fetch with error response
 */
export const mockFetchError = (error = new Error('API Error')) => {
  fetch.mockRejectedValueOnce(error)
}

/**
 * Mock fetch with HTTP error
 */
export const mockFetchHttpError = () => {
  fetch.mockResolvedValueOnce(createMockSpotifyResponse(null, false))
}
