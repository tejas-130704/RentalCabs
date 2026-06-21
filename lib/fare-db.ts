import { prisma } from './prisma'

export async function initFareDb() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS FareRate (
      id TEXT PRIMARY KEY,
      carType TEXT NOT NULL,
      capacity TEXT NOT NULL,
      ratePerKm TEXT,
      rateNonAc TEXT,
      rateAc TEXT,
      driverAllowance INTEGER NOT NULL,
      displayOrder INTEGER NOT NULL DEFAULT 0,
      isActive INTEGER NOT NULL DEFAULT 1
    )
  `)
}

export async function getFareRates() {
  await initFareDb()
  const fares = await prisma.$queryRawUnsafe<any[]>(
    'SELECT * FROM FareRate ORDER BY displayOrder ASC'
  )
  return fares || []
}

export async function saveFareRates(fares: any[]) {
  await initFareDb()
  
  // Clear existing
  await prisma.$executeRawUnsafe('DELETE FROM FareRate')
  
  for (const fare of fares) {
    const ratePerKm = fare.ratePerKm && String(fare.ratePerKm).trim() !== '' ? String(fare.ratePerKm) : null
    const rateNonAc = fare.rateNonAc && String(fare.rateNonAc).trim() !== '' ? String(fare.rateNonAc) : null
    const rateAc = fare.rateAc && String(fare.rateAc).trim() !== '' ? String(fare.rateAc) : null
    const driverAllowance = parseInt(String(fare.driverAllowance)) || 0
    const displayOrder = parseInt(String(fare.displayOrder)) || 0
    const isActive = fare.isActive ? 1 : 0

    await prisma.$executeRawUnsafe(
      `INSERT INTO FareRate (id, carType, capacity, ratePerKm, rateNonAc, rateAc, driverAllowance, displayOrder, isActive)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      fare.id,
      fare.carType,
      fare.capacity,
      ratePerKm,
      rateNonAc,
      rateAc,
      driverAllowance,
      displayOrder,
      isActive
    )
  }
}
