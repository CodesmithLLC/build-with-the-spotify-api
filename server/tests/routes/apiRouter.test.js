import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import request from 'supertest'

import app from '../../src/server.js'

describe('route: /api', () => {
  beforeAll(() => {
    // clear any existing env vars and mock them
    delete process.env.SPOTIFY_CLIENT_ID
    delete process.env.SPOTIFY_REDIRECT_URI

    vi.stubEnv('SPOTIFY_CLIENT_ID', 'test_client_id')
    vi.stubEnv('SPOTIFY_REDIRECT_URI', 'http://127.0.0.1:3000/callback')
  })

  afterAll(() => {
    vi.unstubAllEnvs()
  })

  describe('GET /api', () => {
    it('should return 200 w/ status "ok" for root route', async () => {
      const response = await request(app).get('/api').expect(200)

      expect(response.body).toEqual({
        route: '/api',
        status: 'ok',
      })
    })
  })

  describe('GET /api/spotify-login', () => {
    it('should redirect to Spotify authorization URL', async () => {
      const response = await request(app).get('/api/spotify-login').expect(302)

      const location = response.headers.location
      expect(location).toContain('https://accounts.spotify.com/authorize')
      expect(location).toMatch(/client_id=[A-Za-z0-9]+/) // should have some client ID
      expect(location).toContain('response_type=code')
      expect(location).toContain('scope=user-top-read') // change this based on requested scopes
      expect(location).toMatch(
        /redirect_uri=http%3A%2F%2F(localhost|127\.0\.0\.1)%3A3000%2Fcallback/
      )
    })

    it('should include a state parameter in the redirect URL', async () => {
      const response = await request(app).get('/api/spotify-login').expect(302)

      const location = response.headers.location
      expect(location).toMatch(/state=[A-Za-z0-9]{16}/)
    })

    it('should generate different state parameters on multiple requests', async () => {
      const response1 = await request(app).get('/api/spotify-login').expect(302)
      const response2 = await request(app).get('/api/spotify-login').expect(302)

      const state1 = new URL(response1.headers.location).searchParams.get(
        'state'
      )
      const state2 = new URL(response2.headers.location).searchParams.get(
        'state'
      )

      expect(state1).not.toBe(state2)
      expect(state1).toHaveLength(16)
      expect(state2).toHaveLength(16)
    })
  })
})
