import express from 'express'
const router = express.Router()

import { generateRandomString } from '../utils/generateRandomString.js'

const client_id = process.env.SPOTIFY_CLIENT_ID
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI

router.get('/', (_req, res) => {
  res.status(200).json({ route: '/api', status: 'ok' })
})

router.get('/spotify-login', (_req, res) => {
  const state = generateRandomString(16)
  const scope = 'user-top-read'

  // create query string with necessary parameters
  const params = new URLSearchParams({
    response_type: 'code',
    client_id,
    redirect_uri,
    scope,
    state,

    // for demo purposes; ensures that spotify's auth dialog is always shown
    show_dialog: 'true',
  }).toString()

  res.redirect('https://accounts.spotify.com/authorize?' + params)
})

export default router
