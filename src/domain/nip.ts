/** True only for exactly 18 digits (StaffMember.nip). */
export function isValidNipFormat(value: string): boolean {
  return /^\d{18}$/.test(value)
}
