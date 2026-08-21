export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '')
}

export function isValidPhone(value) {
  return /^[0-9]{10}$/.test(value || '')
}

export function isNotEmpty(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined
}

export function minLength(value, len) {
  return (value || '').length >= len
}
