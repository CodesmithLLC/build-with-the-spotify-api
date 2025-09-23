import { config } from './config.js'

const client_id = config.SPOTIFY_CLIENT_ID
const client_secret = config.SPOTIFY_CLIENT_SECRET
const redirect_uri = config.SPOTIFY_REDIRECT_URI

const params = new URLSearchParams(window.location.search)
const authorizationCode = params.get('code')
const accessToken = params.get('access_token')

async function init() {
  if (accessToken) {
    console.log('Access token:', accessToken)
    return
  }

  if (authorizationCode) {
    console.log('Authorization code:', authorizationCode)

    await getAccessToken(
      client_id,
      client_secret,
      redirect_uri,
      authorizationCode
    )
  } else {
    obtainAuthorizationCode(client_id, redirect_uri)
  }
}
init()

function obtainAuthorizationCode(clientId, redirectUri) {
  const generateRandomString = (length) => {
    let randomString = ''
    const charSet =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
      randomString += charSet.charAt(Math.floor(Math.random() * charSet.length))
    }

    return randomString
  }

  // https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  const scope = 'user-top-read'

  // https://stackoverflow.com/questions/26132066/what-is-the-purpose-of-the-state-parameter-in-oauth-authorization-request
  const state = generateRandomString(16)

  // create query string with appropriate parameters
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    state,

    // for demo purposes; ensures that spotify's auth dialog is always shown
    show_dialog: 'true',
  }).toString()

  document.location = 'https://accounts.spotify.com/authorize?' + params
}

async function getAccessToken(
  clientId,
  clientSecret,
  redirectUri,
  authorizationCode
) {
  const createBase64EncodedString = (clientId, clientSecret) => {
    const basicAuthString = clientId + ':' + clientSecret
    const binaryRepresentation = Buffer.from(basicAuthString)
    const base64EncodedString = binaryRepresentation.toString('base64')

    return base64EncodedString
  }

  try {
    // obtain access token with authorization code
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' + createBase64EncodedString(clientId, clientSecret),
      },

      body: new URLSearchParams({
        code: authorizationCode,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })
    if (!response.ok)
      throw new Error('Failed to obtain access token from Spotify')

    const { access_token, expires_in } = await response.json()
    console.log('Access token:', access_token)
    console.log('Expires in:', expires_in)

    // redirect back to client with access token + expiration time as URL parameters
    const accessTokenParams = new URLSearchParams({
      access_token,
      expires_in,
    }).toString()

    document.location = redirectUri + '?' + accessTokenParams
  } catch (error) {
    console.error(error.message)

    const errorParams = new URLSearchParams({ error: error.message }).toString()
    document.location = redirectUri + '?' + errorParams
  }
}
