# Interacting with the Spotify Web API using vanilla JavaScript

This is a simple web application that demonstrates how to interact with the Spotify Web API using vanilla JavaScript. This example fetches and displays user profile information after authentication.

## Features

- **Spotify Authentication**: Implements OAuth 2.0 [Authorization Code Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)
- **User Profile Display**: Shows user's display name, avatar, ID, and Spotify URI
- **Vanilla JavaScript**: No frameworks or libraries required
- **Modern ES6+**: Uses modern JavaScript features like async/await and modules
- **Vite Development Server**: Fast development with hot module replacement

## Prerequisites

Before running this project, you need:

1. **Spotify Developer Account**: Create one at [Spotify for Developers](https://developer.spotify.com/)
2. **Spotify App**: Create an app in the Spotify Developer Dashboard
3. **Node.js**: Version 14 or higher

## Setup

### 1. Install Dependencies

```bash
cd vanilla-js-example
npm install
```

### 2. Configure Environment Variables

Create an `.env` file in the `vanilla-js-example` directory with your Spotify app credentials. Refer to the `.env.example` file in this directory for the correct format.

```env
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_SPOTIFY_CLIENT_SECRET=your_client_secret_here
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

### 3. Configure Redirect URI

In your Spotify Developer Dashboard:

1. Go to your app settings
2. Add `http://127.0.0.1:5173/callback` to the "Redirect URIs" field
3. Save the changes

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start the Vite development server at `http://localhost:5173`.

## How It Works

The application follows Spotify's Authorization Code Flow:

1. **Authorization Request**: The user is redirected to Spotify's authorization endpoint and is prompted to grant the app access to their data
2. **Authorization Code**: Upon user consent, Spotify redirects back to `http://127.0.0.1:5173/callback` with an authorization code
3. **Access Token Exchange**: The authorization code is exchanged for an access token
4. **API Request**: The access token is used to fetch user profile data
5. **UI Update**: Profile information is displayed on the page

## Project Structure

```
vanilla-js-example/
├── src/
│   └── main.js        # Main application logic
├── public/
│   └── spotify.svg    # Spotify logo favicon
├── index.html         # HTML template
├── package.json       # Dependencies and scripts
├── .env               # Environment variables (create this)
└── README.md          # This file
```

## Key Files

- **`src/main.js`**: Contains all the authentication logic and API calls
- **`index.html`**: Simple HTML structure for displaying user profile
- **`.env`**: Environment variables for Spotify app credentials

## API Endpoints Used

- **Authorization**: `https://accounts.spotify.com/authorize`
- **Token Exchange**: `https://accounts.spotify.com/api/token`
- **User Profile**: `https://api.spotify.com/v1/me`

## Troubleshooting

### Common Issues

1. **Invalid Redirect URI**: Ensure the redirect URI in your `.env` matches exactly what's configured in your Spotify app
2. **Missing Environment Variables**: Make sure all required environment variables are set in your `.env` file

### Environment Variables Not Loading

If your environment variables aren't loading:

1. Ensure the `.env` file is in the project root
2. Restart the development server after creating/modifying `.env`
3. Check that variable names start with `VITE_`

## Learn More

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api/)
- [Authorization Code Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)

## License

This project is for educational purposes and demonstration of the Spotify Web API integration.
