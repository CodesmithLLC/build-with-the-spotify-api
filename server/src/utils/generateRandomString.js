/**
 * Generates a random alphanumeric string of a specified length.
 *
 * The string contains uppercase letters, lowercase letters, and digits (0-9).
 *
 * @param {number} length - The desired length of the generated string.
 * @returns {string} A randomly generated string containing characters from A-Z, a-z, and 0-9.
 *
 * @example
 * // Generate a random string of length 10
 * const randomStr = generateRandomString(10)
 * console.log(randomStr) // e.g., 'aZ3kLmP0Qr'
 */

export const generateRandomString = (length) => {
  let randomString = ''
  const charSet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    randomString += charSet.charAt(Math.floor(Math.random() * charSet.length))
  }

  return randomString
}
