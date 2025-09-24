import { useState, useEffect } from 'react'

import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'

const serverUrl = import.meta.env.VITE_SERVER_URL

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessToken, setAccessToken] = useState(null)

  // check for existing token in localStorage on app load
  useEffect(() => {
    const savedToken = localStorage.getItem('spotify_access_token')
    const savedExpiry = localStorage.getItem('spotify_token_expiry')

    if (savedToken && savedExpiry) {
      const now = new Date().getTime()

      if (now < parseInt(savedExpiry)) {
        setAccessToken(savedToken)
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('spotify_access_token')
        localStorage.removeItem('spotify_token_expiry')
      }
    }
  }, [])

  // check for authentication callback in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const access_token = urlParams.get('access_token')
    const expires_in = urlParams.get('expires_in')
    const error = urlParams.get('error')

    if (error) {
      console.error('Authentication error:', error)
      window.history.replaceState(null, '', window.location.pathname)
    }

    if (access_token && expires_in) {
      const expiryTime = new Date().getTime() + parseInt(expires_in) * 1000

      setAccessToken(access_token)
      setIsAuthenticated(true)

      // store in localStorage
      localStorage.setItem('spotify_access_token', access_token)
      localStorage.setItem('spotify_token_expiry', expiryTime.toString())

      // clean up URL
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  const handleLogin = async () => {
    window.location.assign(`${serverUrl}/api/spotify-login`)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAccessToken(null)

    localStorage.removeItem('spotify_access_token')
    localStorage.removeItem('spotify_token_expiry')
  }

  return (
    <div className='app'>
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <Dashboard accessToken={accessToken} onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App
