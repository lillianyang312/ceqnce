import { createContext, useContext, useState, ReactNode } from 'react'
import { Specialist } from '../types/auctionHouse'
import { specialists } from '../data/auctionMockData'

interface SpecialistContextType {
  activeSpecialist: Specialist | null
  setActiveSpecialist: (specialist: Specialist) => void
  allSpecialists: Specialist[]
}

const SpecialistContext = createContext<SpecialistContextType | undefined>(undefined)

export function SpecialistProvider({ children }: { children: ReactNode }) {
  // Default to first specialist (simulating "test test" specialist)
  const [activeSpecialist, setActiveSpecialist] = useState<Specialist | null>(
    specialists[0] || null
  )

  return (
    <SpecialistContext.Provider
      value={{
        activeSpecialist,
        setActiveSpecialist,
        allSpecialists: specialists
      }}
    >
      {children}
    </SpecialistContext.Provider>
  )
}

export function useSpecialist() {
  const context = useContext(SpecialistContext)
  if (context === undefined) {
    throw new Error('useSpecialist must be used within a SpecialistProvider')
  }
  return context
}
