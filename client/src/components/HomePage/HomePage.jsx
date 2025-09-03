import './HomePage.css'
import spotifyIcon from '../../assets/spotify.svg'

const HomePage = ({ onLogin }) => {
  return (
    <div className="home-page">
      <div className="home-content">
        <h1>spotify dashboard</h1>

        <p>
          connect your spotify account to view <br />
          your top tracks & artists
        </p>

        <button className="spotify-login-btn" onClick={onLogin}>
          <img src={spotifyIcon} alt="Spotify" width="24" height="24" />
          log into spotify
        </button>
      </div>
    </div>
  )
}

export default HomePage
