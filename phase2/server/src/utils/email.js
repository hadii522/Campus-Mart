export function isFastLahoreEmail(email) {
  const e = String(email || '').trim().toLowerCase()
  return e.endsWith('@lhr.nu.edu.pk')
}
