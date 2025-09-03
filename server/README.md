# Spotify API Server

A Node.js Express server that handles Spotify OAuth authentication for the client application. This server acts as an intermediary between the client and Spotify's authentication services, managing the OAuth flow and token exchange.

## Features

- **Spotify OAuth Integration**: Complete OAuth 2.0 authorization code flow implementation
- **CORS Configuration**: Configured to work seamlessly with the React client on localhost:5173
- **Token Exchange**: Secure handling of authorization codes and access token retrieval
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Environment Configuration**: Secure environment variable management for API credentials
- **Testing Suite**: Complete test coverage with Vitest and Supertest

## How it works

### OAuth Authentication Flow

1. Client redirects user to `/api/spotify-login` endpoint
2. Server redirects to Spotify's authorization URL with required parameters
3. User authorizes the application on Spotify's consent screen
4. Spotify redirects back to `/callback` with authorization code
5. Server exchanges authorization code for access token via Spotify's token endpoint
6. Server redirects back to client with access token in URL parameters

### API Endpoints

#### Authentication Routes (`/api`)

- **GET `/api`** - Health check endpoint returning server status
- **GET `/api/spotify-login`** - Initiates Spotify OAuth flow
  - Redirects to Spotify's authorization URL
  - Includes required OAuth parameters (`client_id`, `scope`, `redirect_uri`, `state`)
  - Uses `user-top-read` scope for accessing user's top tracks and artists

#### Callback Routes (`/callback`)

- **GET `/callback`** - Handles OAuth callback from Spotify
  - Processes authorization code from Spotify
  - Exchanges code for access token
  - Handles OAuth errors and state validation
  - Redirects back to client with token or error information

## Architecture

### Core Components

- **`server.js`**: Main Express application with middleware setup and route mounting
- **`routes/apiRouter.js`**: Handles authentication initiation and OAuth redirect
- **`routes/callbackRouter.js`**: Manages OAuth callback processing and token exchange

## Development

### Installation

```bash
npm install
```

### Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will be available at `http://localhost:3000` (or the `PORT` specified in your `.env` file).

## API Integration

### OAuth Scopes

- `user-top-read`: Required for accessing user's top tracks and artists data

### Spotify API Endpoints Used

- `https://accounts.spotify.com/authorize` - OAuth authorization endpoint
- `https://accounts.spotify.com/api/token` - Token exchange endpoint

## Error Handling

The server includes comprehensive error handling:

- **OAuth Errors**: Handles authorization denied, state mismatch, and token exchange failures
- **Network Errors**: Manages API communication failures with Spotify
- **Validation Errors**: Ensures required parameters are present
- **Global Error Handler**: Catches and logs unexpected server errors

All errors are properly logged and user-friendly error messages are returned to the client.
