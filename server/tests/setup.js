import { beforeAll, afterAll, vi } from 'vitest'

// Global test setup
beforeAll(() => {
  // Suppress console.log during tests unless needed
  if (process.env.NODE_ENV !== 'test-verbose') {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  }
})

afterAll(() => {
  // Restore console methods
  vi.restoreAllMocks()
})

// Mock environment variables that are commonly needed
export const mockEnvVars = {
  SPOTIFY_CLIENT_ID: 'test_client_id',
  SPOTIFY_CLIENT_SECRET: 'test_client_secret',
  SPOTIFY_REDIRECT_URI: 'http://localhost:3000/callback',
  CLIENT_URL: 'http://localhost:5173',
}

// Helper function to setup environment for tests
export const setupTestEnv = () => {
  Object.entries(mockEnvVars).forEach(([key, value]) => {
    vi.stubEnv(key, value)
  })
}

// Helper function to cleanup environment after tests
export const cleanupTestEnv = () => {
  vi.unstubAllEnvs()
}
