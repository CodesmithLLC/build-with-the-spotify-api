# Testing Setup

This directory contains comprehensive unit and integration tests for the Spotify API server.

## Testing Stack

- **Vitest**: Modern, fast testing framework with excellent ESM support
- **Supertest**: HTTP assertion library for testing Express applications
- **Built-in mocking**: Using Vitest's powerful mocking capabilities

## Test Structure

```
tests/
├── app.test.js                             # Main server integration tests
├── routes/
│   ├── apiRouter.test.js                   # API routes tests
│   └── callbackRouter.test.js              # Callback routes tests
├── utils/                                  # Utility function tests
│   ├── generateRandomString.test.js
│   └── createBase64EncodedString.test.js
├── setup.js                                # Global test setup
└── README.md                               # This file
```

## Running Tests

```bash
# Run tests in watch mode (for development)
npm test

# Run tests once and exit
npm run test:run

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

The tests cover:

### Unit Tests

- ✅ `generateRandomString()` - Random string generation utility
- ✅ `createBase64EncodedString()` - Base64 encoding utility

### Integration Tests

- ✅ API Router (`/api/*`)
  - Root endpoint status
  - Spotify login redirect functionality
  - State parameter generation
- ✅ Callback Router (`/callback`)
  - Error handling
  - State validation
  - Spotify token exchange (mocked)
  - Network error handling
- ✅ Main App
  - Root endpoint
  - 404 handling
  - CORS middleware
  - Route mounting

## Test Features

### Environment Mocking

Tests use mocked environment variables to avoid requiring real Spotify credentials:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REDIRECT_URI`
- `CLIENT_URL`

### External API Mocking

The Spotify token exchange API calls are mocked using Vitest's `vi.fn()` to:

- Test success scenarios
- Test API failure scenarios
- Test network error scenarios
- Verify correct request formatting

### Console Suppression

Console logs are suppressed during tests for cleaner output. Set `NODE_ENV=test-verbose` to see console output during tests.

## Writing New Tests

When adding new functionality, follow these patterns:

1. **Unit tests** for utility functions
2. **Integration tests** for routes using Supertest
3. **Mock external dependencies** appropriately
4. **Test both success and failure cases**
5. **Use descriptive test names** that explain the expected behavior

## Example Test Command Output

```bash
npm run test:coverage

✓ tests/utils/generateRandomString.test.js (6)
✓ tests/utils/createBase64EncodedString.test.js (6)
✓ tests/routes/apiRouter.test.js (4)
✓ tests/routes/callbackRouter.test.js (8)
✓ tests/app.test.js (7)

Test Files  5 passed (5)
Tests  31 passed (31)
```
