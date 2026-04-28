import { useState, useEffect } from 'react'
import UserNavbar from '../../components/Navbar'
import VendorCard from '../../components/VendorCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import { getVendors } from '../../api/vendors'

const SERVICE_TYPES = ['All', 'Electrician', 'Plumber', 'Carpenter', 'Painter', 'AC Technician', 'Cleaner', 'Mason', 'Mechanic', 'TV Repair', 'Gardener']

export default function UserHome() {
  const { user } = useAuth()
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [availableOnly, setAvailableOnly] = useState(false)

  const fetchVendors = async () => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (selectedType !== 'All') params.serviceType = selectedType
      if (availableOnly) params.availableOnly = 'true'
      const res = await getVendors(params)
      setVendors(res.data.vendors)
    } catch {
      setVendors([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchVendors() }, [selectedType, availableOnly])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchVendors()
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <UserNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-white">
            Hi {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400 mt-1">Looking for help today? Find trusted service providers near you.</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            <input
              id="vendor-search"
              type="text"
              placeholder="Search by service type or shop name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11 pr-28 py-4 text-base"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary px-5 py-2 text-sm">
              Search
            </button>
          </div>
        </form>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          {/* Available Only Toggle */}
          <button
            onClick={() => setAvailableOnly(!availableOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
              availableOnly
                ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40'
                : 'bg-transparent text-slate-400 border-slate-600 hover:border-slate-500'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${availableOnly ? 'bg-emerald-400' : 'bg-slate-600'}`} />
            Available Only
          </button>

          {/* Service Type Pills */}
          <div className="flex gap-2 flex-wrap">
            {SERVICE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  selectedType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            {loading ? 'Searching...' : `${vendors.length} vendor${vendors.length !== 1 ? 's' : ''} found`}
          </h2>
        </div>

        {/* Vendor Grid */}
        {loading ? (
          <LoadingSpinner text="Finding vendors near you..." />
        ) : vendors.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No vendors found</h3>
            <p className="text-slate-400">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {vendors.map((vendor) => (
              <VendorCard key={vendor._id} vendor={vendor} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
