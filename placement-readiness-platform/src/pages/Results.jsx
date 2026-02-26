import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import OverallReadiness from '../components/OverallReadiness'
import CompanyIntel from '../components/CompanyIntel'
import RoundMapping from '../components/RoundMapping'
import { getAnalysisById, getLatestAnalysis, updateAnalysis, formatDate } from '../utils/historyStorage'
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
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Copy,
  Download,
  Zap
} from 'lucide-react'

function Results() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [skillConfidence, setSkillConfidence] = useState({})
  const [liveScore, setLiveScore] = useState(0)
  const [copiedSection, setCopiedSection] = useState(null)

  // Initialize skill confidence map
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
      // Initialize skill confidence from saved state or default to "practice"
      const savedConfidence = result.skillConfidenceMap || {}
      const initialConfidence = {}
      
      Object.values(result.extractedSkills).forEach(category => {
        category.skills.forEach(skill => {
          initialConfidence[skill] = savedConfidence[skill] || 'practice'
        })
      })
      
      setSkillConfidence(initialConfidence)
      setLiveScore(result.readinessScore)
    } else {
      setError('No analysis found. Please analyze a job description first.')
    }
    setLoading(false)
  }, [searchParams])

  // Calculate live score based on skill confidence
  useEffect(() => {
    if (!analysis) return
    
    let adjustedScore = analysis.readinessScore
    
    Object.entries(skillConfidence).forEach(([skill, confidence]) => {
      if (confidence === 'know') {
        adjustedScore += 2
      } else {
        adjustedScore -= 2
      }
    })
    
    // Bounds: 0-100
    setLiveScore(Math.max(0, Math.min(100, adjustedScore)))
  }, [skillConfidence, analysis])

  // Toggle skill confidence
  const toggleSkillConfidence = useCallback((skill) => {
    setSkillConfidence(prev => {
      const newConfidence = {
        ...prev,
        [skill]: prev[skill] === 'know' ? 'practice' : 'know'
      }
      
      // Persist to localStorage
      if (analysis) {
        updateAnalysis(analysis.id, { skillConfidenceMap: newConfidence })
      }
      
      return newConfidence
    })
  }, [analysis])

  // Get weak skills (practice-marked)
  const getWeakSkills = useCallback(() => {
    return Object.entries(skillConfidence)
      .filter(([_, confidence]) => confidence === 'practice')
      .map(([skill]) => skill)
      .slice(0, 3)
  }, [skillConfidence])

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

  // Export functions
  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSection(section)
      setTimeout(() => setCopiedSection(null), 2000)
    })
  }

  const formatPlanForExport = () => {
    return analysis.plan.map(day => 
      `${day.day}: ${day.focus}\n${day.tasks.map(t => `  - ${t}`).join('\n')}`
    ).join('\n\n')
  }

  const formatChecklistForExport = () => {
    return Object.values(analysis.checklist).map(round => 
      `${round.title}\n${round.items.map(item => `  - ${item}`).join('\n')}`
    ).join('\n\n')
  }

  const formatQuestionsForExport = () => {
    return analysis.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')
  }

  const downloadAsTXT = () => {
    const content = `PLACEMENT READINESS ANALYSIS
=============================

Company: ${analysis.company || 'N/A'}
Role: ${analysis.role || 'N/A'}
Date: ${formatDate(analysis.createdAt)}
Readiness Score: ${liveScore}/100

EXTRACTED SKILLS
================
${Object.entries(analysis.extractedSkills).map(([_, cat]) => 
  `${cat.label}:\n${cat.skills.map(s => `  - ${s} (${skillConfidence[s] === 'know' ? '✓ Known' : '⚠ Practice'})`).join('\n')}`
).join('\n\n')}

7-DAY PREPARATION PLAN
======================
${formatPlanForExport()}

ROUND-WISE CHECKLIST
====================
${formatChecklistForExport()}

LIKELY INTERVIEW QUESTIONS
==========================
${formatQuestionsForExport()}

WEAK AREAS TO FOCUS ON
======================
${getWeakSkills().join(', ') || 'None - Great job!'}

Generated by Placement Readiness Platform
`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `placement-analysis-${analysis.company || 'unknown'}-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

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
          
          {/* Export Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => copyToClipboard(formatPlanForExport(), 'plan')}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              {copiedSection === 'plan' ? 'Copied!' : 'Copy Plan'}
            </button>
            <button
              onClick={() => copyToClipboard(formatChecklistForExport(), 'checklist')}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              {copiedSection === 'checklist' ? 'Copied!' : 'Copy Checklist'}
            </button>
            <button
              onClick={() => copyToClipboard(formatQuestionsForExport(), 'questions')}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              {copiedSection === 'questions' ? 'Copied!' : 'Copy Questions'}
            </button>
            <button
              onClick={downloadAsTXT}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-white hover:bg-primary-600 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download TXT
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Readiness Score - Live */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Overall Readiness</span>
                <span className="text-sm font-normal text-gray-500">Live</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OverallReadiness score={liveScore} maxScore={100} />
              <p className="text-xs text-center text-gray-500 mt-2">
                Base: {analysis.readinessScore} | Adjusted: {liveScore}
              </p>
            </CardContent>
          </Card>

          {/* Company Intel */}
          {analysis.companyIntel && (
            <Card>
              <CompanyIntel intel={analysis.companyIntel} />
            </Card>
          )}

          {/* Extracted Skills - Interactive */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Key Skills Extracted
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Toggle skills you already know
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analysis.extractedSkills).map(([categoryKey, category]) => (
                  <div key={categoryKey}>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{category.label}</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, idx) => {
                        const confidence = skillConfidence[skill] || 'practice'
                        return (
                          <button
                            key={idx}
                            onClick={() => toggleSkillConfidence(skill)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                              confidence === 'know'
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                            title={confidence === 'know' ? 'Click to mark as needs practice' : 'Click to mark as known'}
                          >
                            {confidence === 'know' ? (
                              <CheckCircle className="w-3.5 h-3.5" />
                            ) : (
                              <AlertTriangle className="w-3.5 h-3.5" />
                            )}
                            {skill}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-green-100 border border-green-200"></span>
                    I know this (+2 pts)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-50 border border-amber-200"></span>
                    Need practice (-2 pts)
                  </span>
                </div>
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
          {/* Round Mapping */}
          {analysis.companyIntel?.roundMapping && (
            <Card>
              <RoundMapping rounds={analysis.companyIntel.roundMapping} />
            </Card>
          )}

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

          {/* Action Next Box */}
          <Card className="bg-gradient-to-br from-primary-50 to-white border-primary-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Action Next</h3>
                  
                  {getWeakSkills().length > 0 ? (
                    <>
                      <p className="text-sm text-gray-600 mb-3">
                        Focus on these top weak areas:
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {getWeakSkills().map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-green-700 mb-4">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Great job! You've marked all skills as known.
                    </p>
                  )}
                  
                  <div className="flex items-center gap-3 pt-3 border-t border-primary-100">
                    <button
                      onClick={() => navigate('/dashboard/practice')}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Start Day 1 Plan Now
                    </button>
                    <span className="text-sm text-gray-500">
                      {liveScore >= 80 ? 'You are well prepared!' : 'Keep practicing to improve your score'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Results
