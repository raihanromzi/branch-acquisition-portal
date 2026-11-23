/** Parse a Rupiah text input into an integer. Rejects letters; rounds decimals. */
export function parseRupiah(input: string): number | null {
  const cleaned = input.replace(/rp/gi, "").replace(/\s/g, "").replace(/\./g, "")
  if (cleaned === "" || cleaned === "-") return null
  const normalized = cleaned.replace(",", ".")
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) return null
  return Math.round(Number(normalized))
}

/** Format an integer Rupiah amount as `Rp 1.500.000`. */
export function formatRupiah(amount: number): string {
  const sign = amount < 0 ? "-" : ""
  const digits = Math.abs(Math.round(amount)).toString()
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `${sign}Rp ${grouped}`
}
