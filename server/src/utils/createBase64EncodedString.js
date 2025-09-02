/**
 * Creates a Base64-encoded string from a client ID and client secret.
 *
 * This is commonly used for HTTP Basic Authentication headers, e.g., when requesting an access token from APIs like Spotify.
 *
 * @param {string} clientId - The client ID provided by the API service.
 * @param {string} clientSecret - The client secret provided by the API service.
 * @returns {string} A Base64-encoded string in the format 'clientId:clientSecret'.
 *
 * @example
 * const encoded = createBase64EncodedString('myClientId', 'myClientSecret')
 * console.log(encoded) // e.g., 'bXlDbGllbnRJZDpteUNsaWVudFNlY3JldA=='
 */

export const createBase64EncodedString = (clientId, clientSecret) => {
  const basicAuthString = clientId + ':' + clientSecret
  const binaryRepresentation = Buffer.from(basicAuthString)
  const base64EncodedString = binaryRepresentation.toString('base64')

  return base64EncodedString
}
