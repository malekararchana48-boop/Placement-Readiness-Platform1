import { Clock, CheckCircle, Play } from 'lucide-react'

function Assessments() {
  const assessments = [
    {
      id: 1,
      title: 'Frontend Development Fundamentals',
      description: 'HTML, CSS, JavaScript, and React basics',
      duration: '45 min',
      questions: 30,
      status: 'available'
    },
    {
      id: 2,
      title: 'Data Structures & Algorithms',
      description: 'Arrays, trees, graphs, and dynamic programming',
      duration: '60 min',
      questions: 25,
      status: 'available'
    },
    {
      id: 3,
      title: 'System Design Basics',
      description: 'Scalability, database design, and architecture',
      duration: '90 min',
      questions: 15,
      status: 'completed'
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Assessments</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((assessment) => (
          <div key={assessment.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                assessment.status === 'completed' ? 'bg-green-50' : 'bg-primary-50'
              }`}>
                {assessment.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Play className="w-5 h-5 text-primary" />
                )}
              </div>
              {assessment.status === 'completed' && (
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  Completed
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{assessment.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{assessment.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{assessment.duration}</span>
              </div>
              <span>{assessment.questions} questions</span>
            </div>
            
            <button className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              assessment.status === 'completed'
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-primary text-white hover:bg-primary-600'
            }`}>
              {assessment.status === 'completed' ? 'View Results' : 'Start Assessment'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Assessments
