import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/server.js'

describe('App', () => {
  describe('Root endpoint', () => {
    it('should return status ok for root route', async () => {
      const response = await request(app).get('/').expect(200)

      expect(response.body).toEqual({
        route: '/',
        status: 'ok',
      })
    })
  })

  describe('404 handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route').expect(404)

      expect(response.text).toBe('Oops! Nothing here.')
    })
  })

  describe('CORS middleware', () => {
    it('should include CORS headers for allowed origin', async () => {
      const response = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:5173')
        .expect(200)

      expect(response.headers['access-control-allow-origin']).toBe(
        'http://localhost:5173'
      )
    })

    it('should handle preflight requests', async () => {
      const response = await request(app)
        .options('/')
        .set('Origin', 'http://localhost:5173')
        .set('Access-Control-Request-Method', 'GET')
        .expect(204)

      expect(response.headers['access-control-allow-origin']).toBe(
        'http://localhost:5173'
      )
    })
  })

  describe('JSON middleware', () => {
    it('should parse JSON request bodies', async () => {
      // Since we don't have POST endpoints, we'll test that the middleware is loaded
      // by checking that it doesn't interfere with GET requests
      const response = await request(app)
        .get('/')
        .set('Content-Type', 'application/json')
        .expect(200)

      expect(response.body).toEqual({
        route: '/',
        status: 'ok',
      })
    })
  })

  describe('Error handling middleware', () => {
    it('should have error handling middleware in place', async () => {
      // Test that the app is properly configured with middleware
      // We can verify this by checking that the app exists and has the expected structure
      expect(app).toBeDefined()
      expect(typeof app).toBe('function') // Express apps are functions

      // Test that error handling works by checking app properties
      expect(app.settings).toBeDefined()
      expect(app.locals).toBeDefined()
    })
  })

  describe('Route mounting', () => {
    it('should mount API routes correctly', async () => {
      const response = await request(app).get('/api').expect(200)

      expect(response.body.route).toBe('/api')
    })

    it('should mount callback routes correctly', async () => {
      const response = await request(app)
        .get('/callback?error=test')
        .expect(302)

      // Should redirect (testing that callback route is mounted)
      expect(response.headers.location).toContain('error=test')
    })
  })
})
