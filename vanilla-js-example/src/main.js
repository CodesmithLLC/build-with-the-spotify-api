const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
const redirect_uri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI

const params = new URLSearchParams(window.location.search)
const authorizationCode = params.get('code')

async function initializeApp() {
  if (authorizationCode) {
    const accessToken = await getAccessToken(
      client_id,
      client_secret,
      redirect_uri,
      authorizationCode
    )
    const profile = await fetchProfile(accessToken)
    console.log(profile)
    populateUI(profile)
  } else {
    obtainAuthorizationCode(client_id, redirect_uri)
  }
}
initializeApp()

function obtainAuthorizationCode(clientId, redirectUri) {
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

    const { access_token } = await response.json()

    return access_token
  } catch (error) {
    console.error(error.message)
  }
}

async function fetchProfile(accessToken) {
  const response = await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const data = await response.json()

  return data
}

function populateUI(profile) {
  document.getElementById('display-name').innerText = profile.display_name
  document.getElementById('avatar').setAttribute('src', profile.images[0].url)
  document.getElementById('user-id').innerText = profile.id
  document.getElementById('profile-uri').innerText = profile.uri
  document
    .getElementById('profile-uri')
    .setAttribute('href', profile.external_urls.spotify)
  document.getElementById('profile-image').innerText = profile.images[0].url
  document
    .getElementById('profile-image')
    .setAttribute('href', profile.images[0].url)
}

/* helper functions */

function generateRandomString(length) {
  let randomString = ''
  const charSet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    randomString += charSet.charAt(Math.floor(Math.random() * charSet.length))
  }

  return randomString
}

function createBase64EncodedString(clientId, clientSecret) {
  const basicAuthString = clientId + ':' + clientSecret

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa
  const base64EncodedString = btoa(basicAuthString)

  return base64EncodedString
}
