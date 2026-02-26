import { BookOpen, ChevronRight } from 'lucide-react'

function ContinuePractice() {
  const topic = 'Dynamic Programming'
  const completed = 3
  const total = 10
  const progressPercent = (completed / total) * 100

  return (
    <div className="p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 mb-1">Continue where you left off</p>
          <h4 className="text-lg font-semibold text-gray-900 mb-3 truncate">{topic}</h4>
          
          {/* Progress bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="text-gray-900 font-medium">{completed}/{total}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary hover:bg-primary-600 text-white font-medium rounded-lg transition-colors">
        Continue
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

export default ContinuePractice
