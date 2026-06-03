export const RESERVED_ALIASES = ['api', 'login', 'signup', 'analytics', 'assets', 'dashboard']

export function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function validateAlias(alias) {
  if (!alias) return { valid: true, message: '' }
  if (!/^[A-Za-z0-9\-_]+$/.test(alias))
    return { valid: false, message: 'Only letters, numbers, hyphens, and underscores allowed.' }
  if (alias.length < 3 || alias.length > 30)
    return { valid: false, message: 'Alias must be 3–30 characters.' }
  if (RESERVED_ALIASES.includes(alias.toLowerCase()))
    return { valid: false, message: 'This alias is reserved for system use.' }
  return { valid: true, message: '' }
}

export function todayString() {
  return new Date().toISOString().split('T')[0]
}

export function formatDate(value) {
  if (!value) return null
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value))
}
