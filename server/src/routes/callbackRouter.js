import express from 'express'
const router = express.Router()

import { createBase64EncodedString } from '../utils/createBase64EncodedString.js'

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI
const client_url = process.env.CLIENT_URL || 'http://localhost:5173'

router.get('/', async (req, res) => {
  const { code, state, error } = req.query

  // error handling
  if (error) {
    const errorParams = new URLSearchParams({ error }).toString()
    return res.redirect(client_url + '?' + errorParams)
  } else if (!state) {
    const stateMismatchParams = new URLSearchParams({
      error: 'state_mismatch',
    }).toString()
    return res.redirect(client_url + '?' + stateMismatchParams)
  }

  try {
    // obtain access token with authorization code
    const accessTokenResponse = await fetch(
      'https://accounts.spotify.com/api/token',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' + createBase64EncodedString(client_id, client_secret),
        },

        body: new URLSearchParams({
          code,
          redirect_uri,
          grant_type: 'authorization_code',
        }),
      }
    )
    if (!accessTokenResponse.ok) throw new Error('access token error')

    const accessTokenData = await accessTokenResponse.json()
    const { access_token, expires_in } = accessTokenData

    // Redirect back to client with access token as URL parameters
    const accessTokenParams = new URLSearchParams({
      access_token,
      expires_in,
    }).toString()

    res.redirect(client_url + '?' + accessTokenParams)
  } catch (error) {
    console.error(error.message)

    const errorParams = new URLSearchParams({ error: error.message }).toString()
    res.redirect(client_url + '?' + errorParams)
  }
})

export default router
