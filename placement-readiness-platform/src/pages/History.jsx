import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { getHistory, deleteAnalysis, formatDate, getRelativeTime, hasCorruptedEntries, clearCorruptedFlag } from '../utils/historyStorage'
import { 
  Building2, 
  Briefcase, 
  Calendar, 
  Trash2, 
  ExternalLink,
  History,
  AlertCircle,
  Sparkles,
  AlertTriangle
} from 'lucide-react'

function HistoryPage() {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCorruptedWarning, setShowCorruptedWarning] = useState(false)

  useEffect(() => {
    loadHistory()
    // Check for corrupted entries
    if (hasCorruptedEntries()) {
      setShowCorruptedWarning(true)
      clearCorruptedFlag()
    }
  }, [])

  const loadHistory = () => {
    const data = getHistory()
    setHistory(data)
    setLoading(false)
  }

  const handleDelete = (id, e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      deleteAnalysis(id)
      loadHistory()
    }
  }

  const handleView = (id) => {
    navigate(`/dashboard/results?id=${id}`)
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Analysis History</h2>
          <p className="text-gray-600 mt-1">
            View all your past job description analyses and preparation plans.
          </p>
        </div>

        <div className="p-12 bg-gray-50 border border-gray-200 rounded-xl text-center">
          <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No History Yet</h3>
          <p className="text-gray-600 mb-6">
            Start by analyzing your first job description. Your analyses will be saved here automatically.
          </p>
          <button
            onClick={() => navigate('/dashboard/analysis')}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            Analyze Your First JD
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Corrupted Entry Warning */}
      {showCorruptedWarning && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-900">Data Notice</h4>
            <p className="text-sm text-amber-700 mt-1">
              One saved entry couldn't be loaded. Create a new analysis to continue.
            </p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Analysis History</h2>
        <p className="text-gray-600 mt-1">
          {history.length} {history.length === 1 ? 'analysis' : 'analyses'} saved. Click any entry to view details.
        </p>
      </div>

      <div className="space-y-4">
        {history.map((entry) => (
          <Card
            key={entry.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleView(entry.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {entry.company || 'Unknown Company'}
                    </h3>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{entry.role || 'Unknown Role'}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {getRelativeTime(entry.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {entry.categoryCount} {entry.categoryCount === 1 ? 'category' : 'categories'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {entry.jdText.length} chars
                    </span>
                  </div>

                  {/* Skills Preview */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.values(entry.extractedSkills).slice(0, 2).map((category, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {category.label}: {category.skills.slice(0, 3).join(', ')}
                        {category.skills.length > 3 && ` +${category.skills.length - 3}`}
                      </span>
                    ))}
                    {Object.keys(entry.extractedSkills).length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                        +{Object.keys(entry.extractedSkills).length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Score Badge */}
                <div className="flex items-center gap-4">
                  <div className={`px-4 py-2 rounded-lg ${getScoreColor(entry.finalScore ?? entry.readinessScore ?? 50)}`}>
                    <span className="text-2xl font-bold">{entry.finalScore ?? entry.readinessScore ?? 50}</span>
                    <span className="text-xs ml-1">/100</span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={(e) => handleView(entry.id)}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(entry.id, e)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-900">About Your History</h4>
          <p className="text-sm text-blue-700 mt-1">
            Your analyses are stored locally in your browser. They will persist even after refreshing the page. 
            History is limited to the 50 most recent analyses.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HistoryPage
