import { Building2, Users, Briefcase, Info } from 'lucide-react'

function CompanyIntel({ intel }) {
  const getSizeColor = (size) => {
    switch (size) {
      case 'Enterprise': return 'bg-blue-100 text-blue-700'
      case 'Mid-size': return 'bg-purple-100 text-purple-700'
      case 'Startup': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="p-6">
      {/* Company Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{intel.companyName}</h3>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="flex items-center gap-1.5 text-sm text-gray-600">
              <Building2 className="w-4 h-4" />
              {intel.industry}
            </span>
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getSizeColor(intel.size)}`}>
              {intel.size}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500">Size</span>
          <p className="text-sm font-medium text-gray-900">{intel.sizeRange}</p>
        </div>
      </div>

      {/* Hiring Focus */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Briefcase className="w-4 h-4 text-primary" />
          <h4 className="font-semibold text-gray-900">Typical Hiring Focus</h4>
          <span className="text-sm text-gray-500">— {intel.hiringFocus.title}</span>
        </div>
        <ul className="space-y-2">
          {intel.hiringFocus.points.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Demo Mode Note */}
      {intel.isDemo && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            Demo Mode: Company intel generated heuristically based on company name and detected skills.
          </p>
        </div>
      )}
    </div>
  )
}

export default CompanyIntel
