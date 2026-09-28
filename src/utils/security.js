/**
 * UPGRADE Web Application Security Utilities
 * - Cryptographic SHA-256 Hashing (Web Crypto API)
 * - Input Sanitization & XSS Mitigation
 * - Brute-Force Rate Limiting & Cooldown Protection
 * - Session Data Sanitization (Protection against credential leakage in localStorage)
 */

/**
 * Computes SHA-256 hash of a string using browser native Web Crypto API
 * @param {string} text 
 * @returns {Promise<string>}
 */
export async function hashPassword(text) {
  if (!text) return ''
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  } catch {
    // Fallback simple hash if SubtleCrypto is unavailable (e.g. non-HTTPS iframe)
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i)
      hash |= 0
    }
    return 'fallback_' + Math.abs(hash).toString(16)
  }
}

/**
 * Verifies if an input password matches the stored password (hash or legacy plaintext)
 * @param {string} inputPassword
 * @param {string} storedPassword
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(inputPassword, storedPassword) {
  if (!inputPassword || !storedPassword) return false

  // 1. Direct match (covers legacy plaintext passwords in mock DB)
  if (inputPassword === storedPassword) return true

  // 2. SHA-256 hash match
  const inputHash = await hashPassword(inputPassword)
  if (inputHash === storedPassword) return true
  if (storedPassword === `sha256:${inputHash}`) return true

  return false
}

/**
 * Strips dangerous HTML and scripts to mitigate XSS (Cross-Site Scripting)
 * @param {string} input 
 * @returns {string}
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input
  return input
    .replace(/[<>]/g, '') // remove angle brackets
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '') // remove event handlers like onerror=, onclick=
    .trim()
}

/**
 * Removes sensitive fields (like password) before storing in session/localStorage
 * @param {Object} user 
 * @returns {Object}
 */
export function sanitizeUserForSession(user) {
  if (!user) return null
  const { password: _password, ...safeUser } = user
  return safeUser
}

/**
 * Brute-Force Protection Rate Limiter
 * Max 5 failed login attempts -> 30-second lockout
 */
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 30 * 1000 // 30 seconds

export function getLoginAttemptsInfo() {
  try {
    const raw = sessionStorage.getItem('upg_auth_attempts')
    if (!raw) return { count: 0, lockedUntil: null }
    const data = JSON.parse(raw)
    
    // Check if lockout is still active
    if (data.lockedUntil && Date.now() < data.lockedUntil) {
      return data
    }
    
    // If lockout expired, reset
    if (data.lockedUntil && Date.now() >= data.lockedUntil) {
      resetLoginAttempts()
      return { count: 0, lockedUntil: null }
    }
    
    return data
  } catch {
    return { count: 0, lockedUntil: null }
  }
}

export function recordFailedAttempt() {
  try {
    const info = getLoginAttemptsInfo()
    const nextCount = (info.count || 0) + 1
    
    let lockedUntil = info.lockedUntil
    if (nextCount >= MAX_ATTEMPTS) {
      lockedUntil = Date.now() + LOCKOUT_DURATION_MS
    }
    
    sessionStorage.setItem(
      'upg_auth_attempts',
      JSON.stringify({ count: nextCount, lockedUntil })
    )
    
    return { count: nextCount, lockedUntil }
  } catch {
    return { count: 1, lockedUntil: null }
  }
}

export function resetLoginAttempts() {
  try {
    sessionStorage.removeItem('upg_auth_attempts')
  } catch {}
}
