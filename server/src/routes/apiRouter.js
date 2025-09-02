import express from 'express'
const router = express.Router()

import { generateRandomString } from '../utils/generateRandomString.js'

const client_id = process.env.SPOTIFY_CLIENT_ID
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI

router.get('/', (_req, res) => {
  res.status(200).json({ route: '/api', status: 'ok' })
})

router.get('/spotify-login', (_req, res) => {
  // https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  const scope = 'user-top-read'

  // https://stackoverflow.com/questions/26132066/what-is-the-purpose-of-the-state-parameter-in-oauth-authorization-request
  const state = generateRandomString(16)

  // create query string with appropriate parameters
  const params = new URLSearchParams({
    response_type: 'code',
    client_id,
    scope,
    redirect_uri,
    state,

    // for demo purposes; ensures that spotify's auth dialog is always shown
    show_dialog: 'true',
  }).toString()

  res.redirect('https://accounts.spotify.com/authorize?' + params)
})

export default router
