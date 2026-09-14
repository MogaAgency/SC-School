/**
 * Normalises a phone number the way people actually type it in Egypt into
 * E.164 (+20XXXXXXXXXX) so the same student can't register twice with
 * "0100 123 4567" and "+20 100 123 4567".
 *
 *   "0100 123 4567"    → "+201001234567"
 *   "00201001234567"   → "+201001234567"
 *   "+20 100-123-4567" → "+201001234567"
 *   "1001234567"       → "+201001234567"
 * Anything else is returned with only the formatting stripped.
 */
export function normalizePhone(raw) {
  let value = (raw ?? '').replace(/[\s\-().]/g, '')
  // Arabic-Indic digits → ASCII
  value = value.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))

  if (value.startsWith('00')) value = `+${value.slice(2)}`
  if (/^01\d{9}$/.test(value)) value = `+2${value}`
  if (/^1\d{9}$/.test(value)) value = `+20${value}`
  return value
}

/** True for a plausible international number after normalisation. */
export function isValidPhone(value) {
  return /^\+\d{10,15}$/.test(value)
}
