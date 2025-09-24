// prettier-ignore-file

// secure credentials imported from .env file
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI

// main function that initializes the authentication + authorization flow
async function initializeApp() {
  const urlParams = new URLSearchParams(window.location.search)
  const authorizationCode = urlParams.get('code')

  if (authorizationCode === null) {
    obtainAuthorizationCode(clientId, redirectUri)
  } else {
    const accessToken = await getAccessToken(clientId, clientSecret, redirectUri, authorizationCode)

    const profile = await fetchProfile(accessToken)
    populateUI(profile)
  }
}
initializeApp()

// step 1: obtain authorization code from spotify's authorization endpoint
function obtainAuthorizationCode(clientId, redirectUri) {
  // best practice for preventing CSRF attacks
  const state = generateRandomString(16)

  // create query string with appropriate parameters
  const urlParams = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
    show_dialog: 'true',
    // (^ for demo purposes; ensures that spotify's auth dialog is always shown)
  }).toString()

  document.location = 'https://accounts.spotify.com/authorize?' + urlParams
}

// step 2: exchange authorization code for access token
async function getAccessToken(clientId, clientSecret, redirectUri, authorizationCode) {
  try {
    // make 'POST' HTTP request to spotify's token endpoint
    const response = await fetch(
      'https://accounts.spotify.com/api/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + createBase64EncodedString(clientId, clientSecret)
        },
        body: new URLSearchParams({
          code: authorizationCode,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        })
      }
    )
    const data = await response.json()

    return data.access_token
  } catch (error) {
    console.error(error.message)
  }
}

// step 3: fetch user profile data from spotify's user profile endpoint
async function fetchProfile(accessToken) {
  try {
    const response = await fetch(
      'https://api.spotify.com/v1/me',
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    )
    const data = await response.json()
  
    return data
  } catch (error) {
    console.error(error.message)
  }
}

// step 4: use DOM manipulation to update the UI with our profile data
function populateUI(profile) {
  const displayNameElement = document.getElementById('display-name')
  displayNameElement.innerText = profile.display_name

  const avatarElement = document.getElementById('avatar')
  avatarElement.setAttribute('src', profile.images[0].url)

  const userIdElement = document.getElementById('user-id')
  userIdElement.innerText = profile.id

  const profileUriElement = document.getElementById('profile-uri')
  profileUriElement.innerText = profile.uri
  profileUriElement.setAttribute('href', profile.external_urls.spotify)

  const profileImageLinkElement = document.getElementById('profile-image')
  profileImageLinkElement.innerText = profile.images[0].url
  profileImageLinkElement.setAttribute('href', profile.images[0].url)
}

/* helper functions */

function generateRandomString(length) {
  let randomString = ''
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    randomString += charSet.charAt(Math.floor(Math.random() * charSet.length))
  }

  return randomString
}

function createBase64EncodedString(clientId, clientSecret) {
  const basicAuthString = clientId + ':' + clientSecret

  // create a Base64-encoded ASCII string from a binary string
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa
  const base64EncodedString = btoa(basicAuthString)

  return base64EncodedString
}
