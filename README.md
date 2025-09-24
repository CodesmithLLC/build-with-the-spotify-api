# Spotify Top Tracks & Artists Dashboard

A full-stack web application that lets users view their top Spotify tracks and artists using the Spotify Web API. Built with React (frontend) and Express.js (backend).

_**Note: `vanilla-js-example` is a simplified, standalone example of how to use the Spotify Web API to fetch a user's profile data in a vanilla JavaScript application. Please see its README for more details.**_

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
- **ESLint** - Code linting and formatting

### Backend (`/server`)

- **Express.js** - Web server framework
- **Node.js** - JavaScript runtime
- **CORS** - Cross-origin resource sharing

## Project Structure

```
build-with-the-spotify-api/
├── client/                  # React frontend application
│   ├── src/
│   │   ├── pages/           # React components (LoginPage, Dashboard)
│   │   ├── App.jsx          # Main application component
│   │   └── main.jsx         # Application entry point
│   │
├── server/                  # Express.js backend API
│   ├── src/
│   │   ├── routes/          # API routes (auth, callbacks)
│   │   ├── utils/           # Helper functions
│   │   └── server.js        # Main server file
│   │
├── vanilla-js-example/      # Standalone vanilla JavaScript example of how to use the Spotify Web API
```

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Spotify Developer Account** - [Create one here](https://developer.spotify.com/)
- Basic proficiency with running commands in the terminal

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd build-with-the-spotify-api
```

### 2. Configure your Spotify App

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Note your `Client ID` and `Client Secret`
4. Add `http://127.0.0.1:3000/callback` to your Redirect URIs  
   a. Optionally, add `http://127.0.0.1:5173/callback` to your Redirect URIs to use the vanilla JavaScript example

### 3. Create Environment Variables

Create an `.env` file in the `/server` directory. Refer to `server/.env.example` for the correct format.

Your `server/.env` file should look like this:

```env
PORT=3000

SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/callback

CLIENT_URL=http://localhost:5173
```

Create an `.env` file in the `/client` directory. Refer to `client/.env.example` for the correct format.

Your `client/.env` file should look like this:

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

## Running the Application in Development Mode

```bash
npm run dev
```

This will run the frontend and backend development servers concurrently in one terminal instance.

The client (frontend) will run on `http://localhost:5173` and the server/API (backend) will run on `http://localhost:3000`.

## API Endpoints

- `GET /api/spotify-login` - Initiates Spotify OAuth flow
- `GET /callback` - Handles Spotify OAuth callback
- `GET /` - Health check endpoint

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE.txt) file for details.
