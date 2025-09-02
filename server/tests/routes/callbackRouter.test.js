import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  vi,
} from 'vitest'
import request from 'supertest'
import app from '../../src/server.js'

// Mock fetch globally
global.fetch = vi.fn()

describe('Callback Router', () => {
  beforeAll(() => {
    // Clear any existing env vars and mock them
    delete process.env.SPOTIFY_CLIENT_ID
    delete process.env.SPOTIFY_CLIENT_SECRET
    delete process.env.SPOTIFY_REDIRECT_URI
    delete process.env.CLIENT_URL

    // Mock environment variables
    vi.stubEnv('SPOTIFY_CLIENT_ID', 'test_client_id')
    vi.stubEnv('SPOTIFY_CLIENT_SECRET', 'test_client_secret')
    vi.stubEnv('SPOTIFY_REDIRECT_URI', 'http://localhost:3000/callback')
    vi.stubEnv('CLIENT_URL', 'http://localhost:5173')
  })

  afterAll(() => {
    vi.unstubAllEnvs()
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /callback', () => {
    it('should redirect to client with error when error parameter is present', async () => {
      const response = await request(app)
        .get('/callback?error=access_denied')
        .expect(302)

      expect(response.headers.location).toBe(
        'http://localhost:5173?error=access_denied'
      )
    })

    it('should redirect to client with state_mismatch error when state is missing', async () => {
      const response = await request(app)
        .get('/callback?code=test_code')
        .expect(302)

      expect(response.headers.location).toBe(
        'http://localhost:5173?error=state_mismatch'
      )
    })

    it('should successfully exchange code for access token and redirect', async () => {
      // Mock successful Spotify token response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'test_access_token',
          expires_in: 3600,
        }),
      })

      const response = await request(app)
        .get('/callback?code=test_code&state=test_state')
        .expect(302)

      expect(response.headers.location).toBe(
        'http://localhost:5173?access_token=test_access_token&expires_in=3600'
      )

      // Verify fetch was called with correct parameters
      expect(fetch).toHaveBeenCalledWith(
        'https://accounts.spotify.com/api/token',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: expect.stringMatching(/^Basic [A-Za-z0-9+/]+=*$/),
          }),
          body: expect.any(URLSearchParams),
        })
      )
    })

    it('should handle Spotify API failure gracefully', async () => {
      // Mock failed Spotify token response
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      })

      const response = await request(app)
        .get('/callback?code=invalid_code&state=test_state')
        .expect(302)

      expect(response.headers.location).toContain(
        'http://localhost:5173?error='
      )
      expect(response.headers.location).toContain(
        'Failed+to+obtain+access+token+from+Spotify'
      )
    })

    it('should handle network errors gracefully', async () => {
      // Mock network error
      fetch.mockRejectedValueOnce(new Error('Network error'))

      const response = await request(app)
        .get('/callback?code=test_code&state=test_state')
        .expect(302)

      expect(response.headers.location).toContain(
        'http://localhost:5173?error='
      )
      expect(response.headers.location).toContain('Network+error')
    })

    it('should use correct Authorization header format', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'test_token',
          expires_in: 3600,
        }),
      })

      await request(app)
        .get('/callback?code=test_code&state=test_state')
        .expect(302)

      const fetchCall = fetch.mock.calls[0]
      const authHeader = fetchCall[1].headers.Authorization

      // Decode the base64 to verify it's in the correct format
      const base64Part = authHeader.replace('Basic ', '')
      const decoded = Buffer.from(base64Part, 'base64').toString()
      expect(decoded).toMatch(/^.+:.+$/) // Should be in format "clientId:clientSecret"
      expect(authHeader).toMatch(/^Basic [A-Za-z0-9+/]+=*$/)
    })

    it('should send correct form data in request body', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'test_token',
          expires_in: 3600,
        }),
      })

      await request(app)
        .get('/callback?code=auth_code&state=test_state')
        .expect(302)

      const fetchCall = fetch.mock.calls[0]
      const body = fetchCall[1].body

      expect(body.get('code')).toBe('auth_code')
      expect(body.get('redirect_uri')).toMatch(
        /http:\/\/(localhost|127\.0\.0\.1):3000\/callback/
      )
      expect(body.get('grant_type')).toBe('authorization_code')
    })

    it('should use default CLIENT_URL when environment variable is not set', async () => {
      vi.stubEnv('CLIENT_URL', undefined)

      const response = await request(app)
        .get('/callback?error=test_error')
        .expect(302)

      expect(response.headers.location).toBe(
        'http://localhost:5173?error=test_error'
      )

      vi.stubEnv('CLIENT_URL', 'http://localhost:5173')
    })
  })
})
