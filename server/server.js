import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import apiRouter from './apiRouter.js'

const app = express()
const PORT = 3000

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI

app.use(express.json())
app.use(
  cors({
    origin: ['http://localhost:5173'],
  })
)

app.use('/api', apiRouter)

app.get('/', (_, res) => {
  res.send('hello world!')
})

app.get('/callback', async (req, res) => {
  const { code, state, error } = req.query

  // error handling
  if (error) {
    res.status(400).send(`something went wrong: ${error}`)
    return
  } else if (!state) {
    res.redirect('/#error=state_mismatch')
    return
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

app.use((_, res) => {
  res.status(404).send('oops! nothing here.')
})

const globalErrorHandler = (err, _req, res, _next) => {
  console.error(err.stack)
  res.status(500).send('something broke!')
}
app.use(globalErrorHandler)

app.listen(PORT, () =>
  console.log(`📡 server listening on http://localhost:${PORT}...`)
)
