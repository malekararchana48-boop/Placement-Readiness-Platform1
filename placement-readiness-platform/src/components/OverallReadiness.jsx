import { useEffect, useState } from 'react'

function OverallReadiness({ score = 72, maxScore = 100 }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = 80
  const strokeWidth = 12
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (animatedScore / maxScore) * circumference

  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = score / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= score) {
        setAnimatedScore(score)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [score])

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="relative">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke="hsl(245, 58%, 51%)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{
              strokeDashoffset,
              transition: 'stroke-dashoffset 1.5s ease-out',
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gray-900">{animatedScore}</span>
          <span className="text-sm text-gray-500">/ {maxScore}</span>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-gray-600">Readiness Score</p>
    </div>
  )
}

export default OverallReadiness
