import { describe, it, expect } from 'vitest'
import { generateRandomString } from '../../src/utils/generateRandomString.js'

describe('generateRandomString', () => {
  it('should generate a string of the specified length', () => {
    const length = 10
    const result = generateRandomString(length)
    expect(result).toHaveLength(length)
  })

  it('should generate different strings on multiple calls', () => {
    const length = 16
    const result1 = generateRandomString(length)
    const result2 = generateRandomString(length)
    expect(result1).not.toBe(result2)
  })

  it('should only contain alphanumeric characters', () => {
    const length = 50
    const result = generateRandomString(length)
    const alphanumericRegex = /^[A-Za-z0-9]+$/
    expect(result).toMatch(alphanumericRegex)
  })

  it('should handle edge case of length 0', () => {
    const result = generateRandomString(0)
    expect(result).toBe('')
  })

  it('should handle edge case of length 1', () => {
    const result = generateRandomString(1)
    expect(result).toHaveLength(1)
    expect(result).toMatch(/^[A-Za-z0-9]$/)
  })

  it('should generate strings with all possible characters from the charset', () => {
    // Generate many strings to increase probability of getting all character types
    const results = Array.from({ length: 1000 }, () => generateRandomString(50))
    const allChars = results.join('')

    // Check for presence of uppercase, lowercase, and digits
    expect(allChars).toMatch(/[A-Z]/) // Has uppercase
    expect(allChars).toMatch(/[a-z]/) // Has lowercase
    expect(allChars).toMatch(/[0-9]/) // Has digits
  })
})
