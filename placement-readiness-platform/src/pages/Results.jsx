import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import OverallReadiness from '../components/OverallReadiness'
import { getAnalysisById, getLatestAnalysis, formatDate } from '../utils/historyStorage'
import { 
  Building2, 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  Circle,
  Target,
  BookOpen,
  HelpCircle,
  ArrowLeft,
  AlertCircle,
  Lightbulb
} from 'lucide-react'

function Results() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const id = searchParams.get('id')
    let result = null

    if (id) {
      result = getAnalysisById(id)
    } else {
      result = getLatestAnalysis()
    }

    if (result) {
      setAnalysis(result)
    } else {
      setError('No analysis found. Please analyze a job description first.')
    }
    setLoading(false)
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">{error}</h3>
          <button
            onClick={() => navigate('/dashboard/analysis')}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Go to Analysis
          </button>
        </div>
      </div>
    )
  }

  if (!analysis) return null

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/analysis')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Analysis
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
              {analysis.company && (
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {analysis.company}
                </span>
              )}
              {analysis.role && (
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {analysis.role}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(analysis.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Readiness Score */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Readiness</CardTitle>
            </CardHeader>
            <CardContent>
              <OverallReadiness score={analysis.readinessScore} maxScore={100} />
            </CardContent>
          </Card>

          {/* Extracted Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Key Skills Extracted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analysis.extractedSkills).map(([categoryKey, category]) => (
                  <div key={categoryKey}>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{category.label}</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-primary-50 text-primary text-xs font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Goals Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Preparation Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Categories Detected</span>
                  <span className="font-medium text-gray-900">{analysis.categoryCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Checklist Items</span>
                  <span className="font-medium text-gray-900">
                    {Object.values(analysis.checklist).reduce((acc, round) => acc + round.items.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Study Days</span>
                  <span className="font-medium text-gray-900">7</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Practice Questions</span>
                  <span className="font-medium text-gray-900">{analysis.questions.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle & Right Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* 7-Day Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                7-Day Preparation Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.plan.map((day, idx) => (
                  <div key={idx} className="border-l-4 border-primary pl-4 py-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-primary">{day.day}</span>
                      <span className="text-sm font-medium text-gray-900">{day.focus}</span>
                    </div>
                    <ul className="space-y-1">
                      {day.tasks.map((task, taskIdx) => (
                        <li key={taskIdx} className="text-sm text-gray-600 flex items-start gap-2">
                          <Circle className="w-3 h-3 mt-1 text-gray-400 flex-shrink-0" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Round-wise Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Round-wise Preparation Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(analysis.checklist).map(([roundKey, round]) => (
                  <div key={roundKey} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">{round.title}</h4>
                    <ul className="space-y-2">
                      {round.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <Circle className="w-3 h-3 mt-1 text-gray-400 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Interview Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Likely Interview Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.questions.map((question, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-white text-xs font-medium rounded-full flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <p className="text-gray-700 group-hover:text-gray-900">{question}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Results
