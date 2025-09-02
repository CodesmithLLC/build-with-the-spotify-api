import { describe, it, expect } from 'vitest'

import { createBase64EncodedString } from '../../src/utils/createBase64EncodedString.js'

describe('createBase64EncodedString', () => {
  it('should create a valid base64 encoded string from a client ID and client secret', () => {
    const clientId = 'testClientId'
    const clientSecret = 'testClientSecret'
    const result = createBase64EncodedString(clientId, clientSecret)

    const decoded = Buffer.from(result, 'base64').toString()
    expect(decoded).toBe('testClientId:testClientSecret')
  })

  it('should handle empty strings', () => {
    const result = createBase64EncodedString('', '')

    const decoded = Buffer.from(result, 'base64').toString()
    expect(decoded).toBe(':')
  })

  it('should handle special characters in client ID and client secret', () => {
    const clientId = 'client@#$%'
    const clientSecret = 'secret!@#$%^&*()'
    const result = createBase64EncodedString(clientId, clientSecret)

    const decoded = Buffer.from(result, 'base64').toString()
    expect(decoded).toBe('client@#$%:secret!@#$%^&*()')
  })

  it('should return a valid base64 string format', () => {
    const result = createBase64EncodedString('test', 'secret')

    // base64 strings only contain 'A-Z', 'a-z', '0-9', '+', '/', and '=' for padding
    const base64RegEx = /^[A-Za-z0-9+/]*={0,2}$/
    expect(result).toMatch(base64RegEx)
  })

  it('should produce different results for different inputs', () => {
    const result1 = createBase64EncodedString('client1', 'secret1')
    const result2 = createBase64EncodedString('client2', 'secret2')

    expect(result1).not.toBe(result2)
  })

  it('should match expected base64 encoding for known values', () => {
    const clientId = 'myClientId'
    const clientSecret = 'myClientSecret'
    const result = createBase64EncodedString(clientId, clientSecret)

    // manual verification: 'myClientId:myClientSecret' in base64
    const expected = Buffer.from('myClientId:myClientSecret').toString('base64')
    expect(result).toBe(expected)
  })
})
