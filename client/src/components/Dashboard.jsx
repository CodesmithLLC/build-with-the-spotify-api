import { useState, useEffect } from 'react'

import './Dashboard.css'

const spotifyApiUrl =
  import.meta.env.VITE_SPOTIFY_API_BASE_URL || 'https://api.spotify.com'

const Dashboard = ({ accessToken, onLogout }) => {
  const [activeView, setActiveView] = useState('tracks')
  const [timeRange, setTimeRange] = useState('medium_term')
  const [topTracks, setTopTracks] = useState([])
  const [topArtists, setTopArtists] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const timeRangeOptions = [
    { value: 'short_term', label: 'Last 4 weeks' },
    { value: 'medium_term', label: 'Last 6 months' },
    { value: 'long_term', label: 'All time' },
  ]

  useEffect(() => {
    const getUsersTopItems = async (type) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `${spotifyApiUrl}/v1/me/top/${type}?time_range=${timeRange}&limit=20`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        if (!response.ok) throw new Error(`Failed to fetch from ${type}`)

        const data = await response.json()
        return data.items
      } catch (error) {
        console.error(error.message)
        setError(error.message)
        return []
      } finally {
        setIsLoading(false)
      }
    }

    const fetchDataFromSpotify = async () => {
      if (activeView === 'tracks') {
        const tracks = await getUsersTopItems('tracks')
        setTopTracks(tracks)
      } else {
        const artists = await getUsersTopItems('artists')
        setTopArtists(artists)
      }
    }

    fetchDataFromSpotify()
  }, [activeView, timeRange, accessToken])

  const handleViewChange = (view) => {
    setActiveView(view)
    setDrawerOpen(false)
  }

  const renderTrackItem = (track, index) => (
    <div key={track.id} className="data-item">
      <div className="item-rank">#{index + 1}</div>
      <img
        src={track.album.images[2]?.url || track.album.images[0]?.url}
        alt={track.album.name}
        className="item-image"
      />
      <div className="item-info">
        <h3>{track.name}</h3>
        <p>{track.artists.map((artist) => artist.name).join(', ')}</p>
        <span className="album-name">{track.album.name}</span>
      </div>
      <div className="item-popularity">
        <span className="popularity-score">{track.popularity}%</span>
      </div>
    </div>
  )

  const renderArtistItem = (artist, index) => (
    <div key={artist.id} className="data-item">
      <div className="item-rank">#{index + 1}</div>
      <img
        src={artist.images[2]?.url || artist.images[0]?.url}
        alt={artist.name}
        className="item-image"
      />
      <div className="item-info">
        <h3>{artist.name}</h3>
        <p>{artist.genres.slice(0, 3).join(', ')}</p>
        <span className="followers">
          {artist.followers.total.toLocaleString()} followers
        </span>
      </div>
      <div className="item-popularity">
        <span className="popularity-score">{artist.popularity}%</span>
      </div>
    </div>
  )

  return (
    <div className="dashboard">
      {/* Drawer Overlay */}
      {drawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />
      )}

      {/* Drawer */}
      <div className={`drawer ${drawerOpen ? 'drawer-open' : ''}`}>
        <div className="drawer-header">
          <h2>Spotify Dashboard</h2>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)}>
            x
          </button>
        </div>

        <nav className="drawer-nav">
          <button
            className={`nav-item ${activeView === 'tracks' ? 'active' : ''}`}
            onClick={() => handleViewChange('tracks')}
          >
            <span className="nav-icon">🎵</span>
            Top Tracks
          </button>
          <button
            className={`nav-item ${activeView === 'artists' ? 'active' : ''}`}
            onClick={() => handleViewChange('artists')}
          >
            <span className="nav-icon">🎤</span>
            Top Artists
          </button>
        </nav>

        <div className="drawer-footer">
          <button className="logout-btn" onClick={onLogout}>
            Log out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="dashboard-header">
          <button className="menu-btn" onClick={() => setDrawerOpen(true)}>
            ☰
          </button>
          <h1>
            {activeView === 'tracks' ? 'Your Top Tracks' : 'Your Top Artists'}
          </h1>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            {timeRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </header>

        <div className="dashboard-content">
          {isLoading && (
            <div className="isLoading">Loading your Spotify data...</div>
          )}
          {error && <div className="error">Error: {error}</div>}

          {!isLoading && !error && (
            <div className="data-list">
              {activeView === 'tracks'
                ? topTracks.map(renderTrackItem)
                : topArtists.map(renderArtistItem)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
