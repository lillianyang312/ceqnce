import { useSpecialist } from '../contexts/SpecialistContext'

export default function SpecialistSelector() {
  const { activeSpecialist, setActiveSpecialist, allSpecialists } = useSpecialist()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const specialist = allSpecialists.find(s => s.id === e.target.value)
    if (specialist) {
      setActiveSpecialist(specialist)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="specialist-select" className="text-sm font-medium text-gray-700">
        Specialist:
      </label>
      <select
        id="specialist-select"
        value={activeSpecialist?.id || ''}
        onChange={handleChange}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
      >
        {allSpecialists.map(specialist => (
          <option key={specialist.id} value={specialist.id}>
            {specialist.name} ({specialist.division})
          </option>
        ))}
      </select>
    </div>
  )
}
