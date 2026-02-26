import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { 
  getTestChecklist, 
  toggleTestItem, 
  resetTestChecklist, 
  getPassedCount, 
  getTotalCount,
  getCompletionPercentage,
  isChecklistComplete
} from '../utils/testChecklist'
import { 
  CheckCircle2, 
  Circle, 
  HelpCircle, 
  RotateCcw, 
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ClipboardCheck
} from 'lucide-react'

function TestChecklist() {
  const navigate = useNavigate()
  const [checklist, setChecklist] = useState([])
  const [passedCount, setPassedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(10)
  const [percentage, setPercentage] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [expandedHints, setExpandedHints] = useState({})

  useEffect(() => {
    loadChecklist()
  }, [])

  const loadChecklist = () => {
    const items = getTestChecklist()
    setChecklist(items)
    setPassedCount(getPassedCount())
    setTotalCount(getTotalCount())
    setPercentage(getCompletionPercentage())
    setIsComplete(isChecklistComplete())
  }

  const handleToggle = (id) => {
    const updated = toggleTestItem(id)
    setChecklist(updated)
    setPassedCount(getPassedCount())
    setPercentage(getCompletionPercentage())
    setIsComplete(isChecklistComplete())
  }

  const handleReset = () => {
    if (window.confirm('Reset all test items to unchecked?')) {
      const reset = resetTestChecklist()
      setChecklist(reset)
      setPassedCount(0)
      setPercentage(0)
      setIsComplete(false)
    }
  }

  const toggleHint = (id) => {
    setExpandedHints(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const getProgressColor = () => {
    if (percentage === 100) return 'bg-green-500'
    if (percentage >= 70) return 'bg-yellow-500'
    if (percentage >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getStatusIcon = () => {
    if (isComplete) return <CheckCircle className="w-8 h-8 text-green-600" />
    return <AlertTriangle className="w-8 h-8 text-amber-600" />
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Test Checklist</h2>
        <p className="text-gray-600 mt-1">
          Verify all features work correctly before shipping.
        </p>
      </div>

      {/* Summary Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {getStatusIcon()}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tests Passed: {passedCount} / {totalCount}
                </h3>
                <span className="text-2xl font-bold text-gray-900">
                  {percentage}%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
                <div 
                  className={`h-full transition-all duration-500 ${getProgressColor()}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              {!isComplete && (
                <div className="flex items-center gap-2 text-amber-700 bg-amber-50 p-3 rounded-lg">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">
                    Fix issues before shipping.
                  </p>
                </div>
              )}

              {isComplete && (
                <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">
                    All tests passed! Ready to ship.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" />
              Test Items
            </CardTitle>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset checklist
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {checklist.map((item, index) => (
              <div 
                key={item.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  item.checked ? 'bg-green-50/50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggle(item.id)}
                    className="flex-shrink-0 mt-0.5"
                  >
                    {item.checked ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-sm font-medium ${
                        item.checked ? 'text-gray-700 line-through' : 'text-gray-900'
                      }`}>
                        {index + 1}. {item.label}
                      </span>
                      
                      <button
                        onClick={() => toggleHint(item.id)}
                        className="flex-shrink-0 text-gray-400 hover:text-primary transition-colors"
                        title="How to test"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {expandedHints[item.id] && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                        <span className="font-medium">How to test:</span>{' '}
                        {item.hint}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ship Page Link */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/prp/08-ship')}
          disabled={!isComplete}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
            isComplete 
              ? 'bg-primary text-white hover:bg-primary-600' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Go to Ship Page
          <ArrowRight className="w-5 h-5" />
        </button>
        
        {!isComplete && (
          <p className="text-sm text-gray-500">
            Complete all tests to unlock shipping.
          </p>
        )}
      </div>
    </div>
  )
}

export default TestChecklist
