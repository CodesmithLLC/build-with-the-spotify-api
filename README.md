# Spotify Top Tracks & Artists Dashboard

A full-stack web application that lets users view their top Spotify tracks and artists using the Spotify Web API. Built with React (frontend) and Express.js (backend).

## Features

- 🎵 **Spotify Authentication** - Secure OAuth 2.0 login with Spotify
- 🎧 **Top Tracks** - View your most played tracks
- 🎤 **Top Artists** - Discover your favorite artists
- ⏰ **Time Ranges** - Filter by last 4 weeks, 6 months, or year
- 💾 **Token Persistence** - Automatic token storage and refresh
- 📱 **Responsive Design** - Works on desktop and mobile

## Tech Stack

### Frontend (`/client`)

- **React 19** - Modern React with hooks
- **Vite** - Fast development and build tool
- **Vitest** - Unit testing framework
- **ESLint** - Code linting and formatting

### Backend (`/server`)

- **Express.js** - Web server framework
- **Node.js** - JavaScript runtime
- **CORS** - Cross-origin resource sharing
- **Vitest** - API testing

## Project Structure

```
build-with-the-spotify-api/
├── client/                  # React frontend application
│   ├── src/
│   │   ├── pages/           # React components (LoginPage, Dashboard)
│   │   ├── App.jsx          # Main application component
│   │   └── main.jsx         # Application entry point
│   ├── package.json
│   └── vite.config.js
├── server/                  # Express.js backend API
│   ├── src/
│   │   ├── routes/          # API routes (auth, callbacks)
│   │   ├── utils/           # Helper functions
│   │   └── server.js        # Main server file
│   └── package.json
├── LICENSE.txt
└── README.md
```

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Spotify Developer Account** - [Create one here](https://developer.spotify.com/)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd build-with-the-spotify-api
```

### 2. Spotify App Configuration

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Note your `Client ID` and `Client Secret`
4. Add `http://127.0.0.1:3000/callback` to your Redirect URIs

### 3. Environment Variables

Create an `.env` file in the `/server` directory:

```env
PORT=3000

SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/callback

CLIENT_URL=http://localhost:5173
```

Create an `.env` file in the `/client` directory:

```env
VITE_SERVER_URL=http://localhost:3000
VITE_SPOTIFY_API_BASE_URL=https://api.spotify.com
```

### 4. Install Dependencies

**Backend:**

```bash
cd server
npm install
```

**Frontend:**

```bash
cd client
npm install
```

## Running the Application

### Development Mode

**Start the backend server:**

```bash
cd server
npm run dev
```

Server will run on `http://localhost:3000`

**Start the frontend development server:**

```bash
cd client
npm run dev
```

Client will run on `http://localhost:5173`

### Production Mode

**Build and start the backend:**

```bash
cd server
npm start
```

**Build and preview the frontend:**

```bash
cd client
npm run build
npm run preview
```

## Testing

**Run backend tests:**

```bash
cd server
npm test
```

**Run frontend tests:**

```bash
cd client
npm test
```

**Run tests with coverage:**

```bash
npm run test:coverage
```

## API Endpoints

- `GET /api/spotify-login` - Initiates Spotify OAuth flow
- `GET /callback` - Handles Spotify OAuth callback
- `GET /` - Health check endpoint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE.txt) file for details.
