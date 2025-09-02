import express from 'express'
const router = express.Router()

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI

router.get('/', async (req, res) => {
  const { code, state, error } = req.query

  // error handling
  if (error) {
    return res.status(400).send(`something went wrong: ${error}`)
  } else if (!state) {
    return res.redirect('/#error=state_mismatch')
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
            'Basic ' +
            Buffer.from(client_id + ':' + client_secret).toString('base64'),
        },

        body: new URLSearchParams({
          code,
          redirect_uri,
          grant_type: 'authorization_code',
        }),
      }
    )
    const accessTokenData = await accessTokenResponse.json()

    const { access_token, expires_in } = accessTokenData
    res.status(200).json({ accessToken: access_token, expiresIn: expires_in })
  } catch (error) {
    console.error(error.message)

    res.status(400).send(`something went wrong: ${error.message}`)
  }
})

export default router
