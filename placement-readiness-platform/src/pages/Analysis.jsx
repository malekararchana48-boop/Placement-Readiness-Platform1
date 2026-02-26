import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { FileText, Building2, Briefcase, Sparkles, Loader2 } from 'lucide-react'
import { extractSkills, calculateReadinessScore, generateChecklist, generatePlan, generateQuestions } from '../utils/skillExtractor'
import { saveAnalysis } from '../utils/historyStorage'

function Analysis() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    jdText: ''
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleAnalyze = async (e) => {
    e.preventDefault()
    
    if (!formData.jdText.trim()) {
      setError('Please enter a job description')
      return
    }

    setIsAnalyzing(true)
    
    // Simulate analysis delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800))
    
    try {
      // Extract skills
      const skillData = extractSkills(formData.jdText)
      
      // Calculate readiness score
      const readinessScore = calculateReadinessScore(
        formData.jdText,
        formData.company,
        formData.role,
        skillData.categories
      )
      
      // Generate outputs
      const checklist = generateChecklist(skillData.skills, skillData.categories)
      const plan = generatePlan(skillData.skills, skillData.categories)
      const questions = generateQuestions(skillData.skills, skillData.categories)
      
      // Prepare analysis result
      const analysisResult = {
        company: formData.company || 'Unknown Company',
        role: formData.role || 'Unknown Role',
        jdText: formData.jdText,
        extractedSkills: skillData.skills,
        categories: skillData.categories,
        categoryCount: skillData.categoryCount,
        readinessScore,
        checklist,
        plan,
        questions
      }
      
      // Save to history
      const savedEntry = saveAnalysis(analysisResult)
      
      // Navigate to results with the saved entry ID
      navigate(`/dashboard/results?id=${savedEntry.id}`)
    } catch (err) {
      setError('Analysis failed. Please try again.')
      setIsAnalyzing(false)
    }
  }

  const sampleJD = `We are looking for a Software Engineer with strong skills in:
- React and Next.js for frontend development
- Node.js and Express for backend APIs
- PostgreSQL and MongoDB for database management
- AWS and Docker for cloud deployment
- Experience with CI/CD pipelines and GitHub Actions
- Knowledge of DSA and System Design
- Testing with Jest and Cypress

Requirements:
- 2+ years of experience with JavaScript/TypeScript
- Strong understanding of REST and GraphQL APIs
- Experience with Linux and shell scripting
- Familiarity with Redis for caching
- Good communication skills and team collaboration`

  const loadSample = () => {
    setFormData({
      company: 'TechCorp Inc.',
      role: 'Full Stack Developer',
      jdText: sampleJD
    })
    setError('')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">JD Analysis</h2>
        <p className="text-gray-600 mt-1">
          Paste a job description to extract skills, generate a preparation plan, and calculate your readiness score.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Analyze Job Description</CardTitle>
              <CardDescription>
                We'll extract key skills and create a personalized preparation plan.
              </CardDescription>
            </div>
            <button
              type="button"
              onClick={loadSample}
              className="text-sm text-primary hover:text-primary-600 font-medium"
            >
              Load Sample JD
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="space-y-6">
            {/* Company and Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    Company Name
                  </div>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g., Google, Microsoft"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    Job Role
                  </div>
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="e.g., Software Engineer"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* JD Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  Job Description
                </div>
              </label>
              <textarea
                name="jdText"
                value={formData.jdText}
                onChange={handleInputChange}
                placeholder="Paste the full job description here..."
                rows={12}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {formData.jdText.length} characters
                </span>
                <span className="text-xs text-gray-500">
                  Tip: Longer JDs (&gt;800 chars) improve analysis accuracy
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-primary hover:bg-primary-600 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Job Description
                </>
              )}
            </button>
          </form>
        </CardContent>
      </Card>

      {/* How it works */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-primary-50 rounded-lg">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
            <span className="text-primary font-bold">1</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Extract Skills</h4>
          <p className="text-sm text-gray-600">
            We detect keywords across 6 categories: Core CS, Languages, Web, Data, Cloud, and Testing.
          </p>
        </div>
        <div className="p-4 bg-primary-50 rounded-lg">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
            <span className="text-primary font-bold">2</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Generate Plan</h4>
          <p className="text-sm text-gray-600">
            Get a 7-day preparation plan, round-wise checklist, and 10 likely interview questions.
          </p>
        </div>
        <div className="p-4 bg-primary-50 rounded-lg">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
            <span className="text-primary font-bold">3</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Track Progress</h4>
          <p className="text-sm text-gray-600">
            Your analysis is saved to history. Revisit anytime to track your preparation.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Analysis
