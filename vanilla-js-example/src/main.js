// prettier-ignore-file
// (^ this directive comment prevents Prettier from formatting this file)

// import secure credentials from .env file
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI

// step 0: invoke the function that initiates this entire process!
main()

// main function that initializes the authentication + authorization flow
async function main() {
  // obtain authorization code from URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const authorizationCode = urlParams.get('code')

  if (authorizationCode === null) {
    // step 1
    obtainAuthorizationCode(clientId, redirectUri)
  } else {
    // step 2
    const accessToken = await getAccessToken(clientId, clientSecret, redirectUri, authorizationCode)

    // steps 3 & 4
    const profile = await fetchProfile(accessToken)
    populateUIWithProfileData(profile)

    // steps 5 & 6: fetch top items and render them to the UI
    const topTwentyTracks = await fetchTopItems('tracks', 'medium_term', accessToken)
    const topTwentyArtists = await fetchTopItems('artists', 'medium_term', accessToken)
    populateUIWithTopItems(topTwentyTracks, 'top-tracks-container')
    populateUIWithTopItems(topTwentyArtists, 'top-artists-container')
  }
}

// step 1: obtain authorization code from spotify's authorization endpoint
function obtainAuthorizationCode(clientId, redirectUri) {
  const state = generateRandomString(16) // best practice for preventing CSRF attacks
  const scope = 'user-top-read' // gives our app permission to read the user's top tracks and artists

  // create query string with necessary parameters
  const urlParams = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
    scope: scope,
    show_dialog: 'true' // (for demo purposes)
  }).toString()

  // redirect browser to spotify's authorization endpoint
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
          'Content-Type': 'application/x-www-form-urlencoded', // spotify's token endpoint expects form-encoded data
          Authorization: 'Basic ' + createBase64EncodedString(clientId, clientSecret)
        },
        body: new URLSearchParams({
          code: authorizationCode,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
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
    // make 'GET' HTTP request to spotify's user profile endpoint
    const response = await fetch(
      'https://api.spotify.com/v1/me',
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    )
    const data = await response.json()
    // console.log('profile data:', data)
  
    return data
  } catch (error) {
    console.error(error.message)
  }
}

// step 4: use DOM manipulation to update the UI with our profile data
function populateUIWithProfileData(profile) {
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

// step 5: fetch top items (tracks or artists) based on a given time range
async function fetchTopItems(type, timeRange, accessToken) {
  // make 'GET' HTTP request to spotify's "top items" endpoint
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=20`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    )
    const data = await response.json()

    // dynamically generate the results array based on the type of top items we're fetching
    const results = []
    if (type === 'tracks') {
      for (const track of data.items) {
        results.push(`"${track.name}" by ${track.artists[0].name}`)
      }
    } else if (type === 'artists') {
      for (const artist of data.items) {
        results.push(artist.name)
      }
    }

    return results
  } catch (error) {
    console.error(error.message)
  }
}

// step 6: populate UI with top items as a bulleted list
function populateUIWithTopItems(items, elementId) {
  const container = document.getElementById(elementId)
  
  // create unordered list html element
  const unorderedList = document.createElement('ul')
  
  // create a list item for each item and append it to the unordered list
  items.forEach((item) => {
    const listItem = document.createElement('li')
    listItem.textContent = item
    unorderedList.appendChild(listItem)
  })
  
  // append the unordered list to the specified container
  container.appendChild(unorderedList)
}

// ------------------------------------------------------------------------------------------------ //

/*
  helper functions:
  1. generateRandomString: generates a random string of a given length
  2. createBase64EncodedString: creates a Base64-encoded ASCII string from a binary string
*/

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

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa
  const base64EncodedString = window.btoa(basicAuthString)

  return base64EncodedString
}
