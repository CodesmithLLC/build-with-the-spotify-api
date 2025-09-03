# Testing Setup

This project uses **Vitest** as the test runner along with **React Testing Library** for component testing and **Jest DOM** for enhanced assertions.

## Dependencies

- **Vitest**: Fast unit test framework
- **@testing-library/react**: React component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom Jest matchers for DOM elements
- **jsdom**: DOM implementation for Node.js
- **@vitest/ui**: Web UI for Vitest
- **@vitest/coverage-v8**: Coverage reporting

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

```
src/
├── test/
│   ├── setup.js                       # Global test setup
│   ├── utils/
│   │   └── testHelpers.js             # Testing utilities
│   └── integration/
│       └── App.integration.test.jsx
├── App.test.jsx                       # Main App component tests
└── pages/
    ├── LoginPage/
    │   └── LoginPage.test.jsx
    └── Dashboard/
        └── Dashboard.test.jsx
```

## Test Categories

### Unit Tests

- **App.test.jsx**: Tests for main App component including authentication flows
- **LoginPage.test.jsx**: Tests for login page component
- **Dashboard.test.jsx**: Tests for dashboard component including API interactions

### Integration Tests

- **App.integration.test.jsx**: End-to-end user flows testing the complete application

## Test Utilities

The `testHelpers.js` file provides utilities for:

- Creating mock Spotify API responses
- Setting up localStorage states
- Configuring authentication callbacks
- Generating test data

## Mocking Strategy

### Global Mocks

- **localStorage**: Mocked in setup.js
- **window.location**: Mocked for URL manipulation
- **window.history**: Mocked for navigation
- **fetch**: Mocked for API calls

### Component Mocks

- Spotify icon imports are mocked
- Child components are mocked in integration tests when needed

## Coverage

Tests cover:

- ✅ Authentication flows (login, logout, token persistence)
- ✅ API interactions (success, error handling)
- ✅ Component rendering and user interactions
- ✅ Mobile drawer functionality
- ✅ Time range and view switching
- ✅ Error states and loading states
- ✅ Edge cases (empty data, network errors)

## Best Practices

1. **Test behavior, not implementation**: Focus on what the user sees and does
2. **Use descriptive test names**: Clearly state what is being tested
3. **Group related tests**: Use `describe` blocks to organize tests
4. **Mock external dependencies**: Keep tests isolated and fast
5. **Test error cases**: Ensure the app handles failures gracefully
6. **Use async/await**: Properly handle asynchronous operations

## Example Test

```jsx
it('renders dashboard with correct initial state', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockTrackData,
  })

  render(<Dashboard accessToken="test-token" onLogout={vi.fn()} />)

  expect(screen.getByText('your top tracks')).toBeInTheDocument()
  expect(screen.getByDisplayValue('last 6 months')).toBeInTheDocument()
})
```

## Debugging Tests

- Use `screen.debug()` to see the current DOM state
- Use `--reporter=verbose` for detailed test output
- Use the Vitest UI (`npm run test:ui`) for interactive debugging
- Check the browser's developer tools when using jsdom
