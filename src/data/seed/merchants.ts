import type { Merchant } from "@/src/types/entities"

const areas = ["Blok M", "Menteng", "Kuningan", "Dago", "Cihampelas", "Tunjungan", "Gubeng", "Imam Bonjol", "Petisah", "Teuku Umar", "Renon", "Sanur"]

function merchant(index: number, branchId: string, latitude: number, longitude: number, overrides: Partial<Merchant> = {}): Merchant {
  return {
    id: `MRC-${String(index).padStart(3, "0")}`,
    storeName: `Toko ${areas[index % areas.length]} ${index}`,
    owner: `Owner ${index}`,
    cif: `9001${String(100000 + index)}`,
    area: areas[index % areas.length],
    branchId,
    latitude,
    longitude,
    edcStatus: index % 7 === 0 ? "INACTIVE" : index % 5 === 0 ? "QRIS_ONLY" : "ACTIVE",
    monthlySales: 6_000_000 + (index % 9) * 1_000_000,
    monthlyTransactions: 12 + (index % 8),
    mdrPercent: index % 2 === 0 ? 0.7 : 0.9,
    ...overrides,
  }
}

const branches = [
  { id: "KC-JKT-THAMRIN", latitude: -6.1944, longitude: 106.8229 },
  { id: "KC-BDG-DAGO", latitude: -6.885, longitude: 107.613 },
  { id: "KC-SBY-TUNJUNGAN", latitude: -7.262, longitude: 112.742 },
  { id: "KC-MDN-IMAM", latitude: 3.583, longitude: 98.673 },
  { id: "KC-DPS-TEUKU", latitude: -8.67, longitude: 115.212 },
]

export const merchants: Merchant[] = branches.flatMap((branch, branchIndex) =>
  Array.from({ length: 20 }, (_, offset) => {
    const index = branchIndex * 20 + offset + 1
    const ring = Math.floor(offset / 5)
    const angle = (offset % 5) * ((Math.PI * 2) / 5)
    return merchant(
      index,
      branch.id,
      branch.latitude + Math.cos(angle) * (0.004 + ring * 0.003),
      branch.longitude + Math.sin(angle) * (0.004 + ring * 0.003),
    )
  }),
)

merchants[0] = merchant(1, "KC-JKT-THAMRIN", -6.197, 106.825, {
  storeName: "Warung Alert Thamrin",
  edcStatus: "ACTIVE",
  monthlySales: 3_000_000,
  monthlyTransactions: 14,
})
merchants[1] = merchant(2, "KC-JKT-THAMRIN", -6.191, 106.819, {
  storeName: "Kopi Aman Thamrin",
  edcStatus: "ACTIVE",
  monthlySales: 8_000_000,
  monthlyTransactions: 12,
})
merchants[2] = merchant(3, "KC-JKT-THAMRIN", -6.2, 106.828, {
  storeName: "Bakso Alert Menteng",
  edcStatus: "ACTIVE",
  monthlySales: 9_000_000,
  monthlyTransactions: 8,
})
merchants[3] = merchant(4, "KC-JKT-THAMRIN", -6.188, 106.816, {
  storeName: "Toko Batas Tepat",
  edcStatus: "ACTIVE",
  monthlySales: 5_000_000,
  monthlyTransactions: 10,
})
