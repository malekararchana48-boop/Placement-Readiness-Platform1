import { Calendar, Clock, ChevronRight } from 'lucide-react'

function UpcomingAssessments() {
  const assessments = [
    {
      id: 1,
      title: 'DSA Mock Test',
      date: 'Tomorrow',
      time: '10:00 AM',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 2,
      title: 'System Design Review',
      date: 'Wed',
      time: '2:00 PM',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      id: 3,
      title: 'HR Interview Prep',
      date: 'Friday',
      time: '11:00 AM',
      color: 'bg-green-50 text-green-600',
    },
  ]

  return (
    <div className="p-6">
      <h4 className="font-semibold text-gray-900 mb-4">Upcoming Assessments</h4>
      
      <div className="space-y-3">
        {assessments.map((assessment) => (
          <div
            key={assessment.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            {/* Color indicator */}
            <div className={`w-1 h-10 rounded-full ${assessment.color.split(' ')[0].replace('bg-', 'bg-opacity-100 ')} ${assessment.color.split(' ')[0]}`} />
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{assessment.title}</p>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {assessment.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {assessment.time}
                </span>
              </div>
            </div>
            
            {/* Arrow */}
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingAssessments
