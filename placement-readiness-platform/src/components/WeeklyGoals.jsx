import { Target } from 'lucide-react'

function WeeklyGoals() {
  const problemsSolved = 12
  const problemsGoal = 20
  const progressPercent = (problemsSolved / problemsGoal) * 100
  
  const days = [
    { day: 'Mon', active: true },
    { day: 'Tue', active: true },
    { day: 'Wed', active: true },
    { day: 'Thu', active: false },
    { day: 'Fri', active: true },
    { day: 'Sat', active: false },
    { day: 'Sun', active: false },
  ]

  return (
    <div className="p-6">
      {/* Header with icon */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
          <Target className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">Weekly Goals</h4>
          <p className="text-sm text-gray-500">Problems Solved</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">
            <span className="font-semibold text-gray-900">{problemsSolved}</span>
            <span className="text-gray-400"> / {problemsGoal} this week</span>
          </span>
          <span className="text-primary font-medium">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Day circles */}
      <div className="flex justify-between items-center">
        {days.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                item.active
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {item.day[0]}
            </div>
            <span className="text-xs text-gray-500">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeeklyGoals
