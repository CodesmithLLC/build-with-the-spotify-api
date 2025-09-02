import { beforeAll, afterAll, vi } from 'vitest'

// global test setup
beforeAll(() => {
  // suppress console.log/error during tests unless needed
  if (process.env.NODE_ENV !== 'test-verbose') {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  }
})

afterAll(() => {
  vi.restoreAllMocks() // restore console methods
})

// mock environment variables
export const mockEnvVars = {
  SPOTIFY_CLIENT_ID: 'test_client_id',
  SPOTIFY_CLIENT_SECRET: 'test_client_secret',
  SPOTIFY_REDIRECT_URI: 'http://127.0.0.1:3000/callback',
  CLIENT_URL: 'http://localhost:5173',
}

// set up environment for tests
export const setupTestEnv = () => {
  Object.entries(mockEnvVars).forEach(([key, value]) => {
    vi.stubEnv(key, value)
  })
}

// clean up environment after tests
export const cleanupTestEnv = () => {
  vi.unstubAllEnvs()
}
