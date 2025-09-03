/* eslint-disable no-undef */
import '@testing-library/jest-dom'

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_SERVER_URL: 'http://localhost:3000',
    VITE_SPOTIFY_API_BASE_URL: 'https://api.spotify.com',
  },
  writable: true,
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    search: '',
    pathname: '/',
    assign: vi.fn(),
  },
  writable: true,
})

// Mock window.history
Object.defineProperty(window, 'history', {
  value: {
    replaceState: vi.fn(),
  },
  writable: true,
})

// Mock fetch globally
global.fetch = vi.fn()

beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks()
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.clear.mockClear()
  window.location.assign.mockClear()
  window.history.replaceState.mockClear()
  fetch.mockClear()

  // Reset URL search params
  window.location.search = ''
})

// Suppress act warnings in tests (they're mostly harmless for our use case)
const originalError = console.error
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: An update to')
  ) {
    return
  }
  originalError.call(console, ...args)
}
