import express from 'express'
const router = express.Router()

import { generateRandomString } from './utils/generateRandomString.js'

const client_id = process.env.SPOTIFY_CLIENT_ID
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI

router.get('/', (req, res) => {
  res.send('hello from /api!')
})

router.get('/spotify-login', (req, res) => {
  // https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  const scope = 'user-top-read'

  const params = new URLSearchParams({
    response_type: 'code',
    client_id,
    scope,
    redirect_uri,
    state: generateRandomString(16),
  }).toString()

  res.redirect('https://accounts.spotify.com/authorize?' + params)
})

export default router
