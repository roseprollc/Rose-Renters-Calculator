'use client'

import { useState } from 'react'
import { AnalysisType, AnalysisFilters } from '@/types/analysis'
import { Search, Filter } from 'lucide-react'

interface SearchFiltersProps {
  onFiltersChange: (filters: AnalysisFilters) => void
}

const analysisTypes: { value: AnalysisType | 'all', label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'rental', label: 'Rental' },
  { value: 'mortgage', label: 'Mortgage' },
  { value: 'wholesale', label: 'Wholesale' }
]

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'price-low', label: 'Price: Low to High' }
] as const

export default function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState<AnalysisFilters>({
    search: '',
    type: 'all',
    sortBy: 'newest'
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...filters, type: e.target.value as AnalysisType | 'all' }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...filters, sortBy: e.target.value as AnalysisFilters['sortBy'] }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by address or notes..."
          value={filters.search}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-[#2ecc71]/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent transition-all duration-200"
        />
      </div>
      <div className="flex gap-4">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filters.type}
            onChange={handleTypeChange}
            className="pl-10 pr-8 py-2 bg-gray-900 border border-[#2ecc71]/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent appearance-none transition-all duration-200"
          >
            {analysisTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <select
          value={filters.sortBy}
          onChange={handleSortChange}
          className="px-4 py-2 bg-gray-900 border border-[#2ecc71]/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent transition-all duration-200"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
} 