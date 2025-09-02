# Spotify API Client

A simple React application that demonstrates interaction with Spotify's Web API to display user's top tracks and artists.

## Features

- **Simple Authentication Flow**: Single button login that redirects to the server's Spotify OAuth endpoint
- **Responsive Dashboard**: Modern drawer-style navigation that works on both desktop and mobile
- **Top Tracks & Artists**: View your most played tracks and artists with different time ranges
- **Time Range Selection**: Choose between last 4 weeks, last 6 months, or all time data
- **Persistent Sessions**: Authentication tokens are stored in localStorage for seamless experience

## How it works

### Authentication Flow

1. User clicks "Log into Spotify" button on the home page
2. App redirects to `localhost:3000/api/spotify-login` (server endpoint)
3. Server handles Spotify OAuth and redirects back with access token in URL parameters
4. Client captures the token and stores it for API calls

### Dashboard Features

- **Drawer Navigation**: Hamburger menu on mobile, persistent sidebar on desktop
- **Data Display**: Shows track/artist name, album art, and popularity scores
- **Time Range Filter**: Dropdown to select different time periods for data
- **Logout**: Clear session and return to login screen

## Architecture

- **App.jsx**: Main component handling authentication state and routing
- **HomePage.jsx**: Simple landing page with login button
- **Dashboard.jsx**: Main dashboard with drawer navigation and data display
- **CSS Modules**: Separate CSS files for each component with Spotify-themed styling

## API Integration

The app directly calls Spotify's Web API endpoints:

- `/v1/me/top/tracks` - User's top tracks
- `/v1/me/top/artists` - User's top artists

Both endpoints support `time_range` parameter for different time periods.

## Development

```bash
npm run dev
```

The app will be available at http://localhost:5173 (or the next available port).
