import { useState } from 'react'
import { ChevronDown, ChevronUp, Clock, Target, CheckCircle2 } from 'lucide-react'

function RoundMapping({ rounds }) {
  const [expandedRound, setExpandedRound] = useState(null)

  const toggleRound = (roundNum) => {
    setExpandedRound(expandedRound === roundNum ? null : roundNum)
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Round Mapping</h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {/* Rounds */}
        <div className="space-y-4">
          {rounds.map((round, idx) => (
            <div key={round.round} className="relative">
              {/* Timeline dot */}
              <div className="absolute left-3 w-5 h-5 bg-primary rounded-full border-4 border-white flex items-center justify-center z-10">
                <span className="text-xs font-bold text-white">{round.round}</span>
              </div>
              
              {/* Round Card */}
              <div className="ml-12">
                <button
                  onClick={() => toggleRound(round.round)}
                  className="w-full text-left bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{round.title}</h4>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {round.duration}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{round.description}</p>
                    </div>
                    {expandedRound === round.round ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Expanded Content */}
                  {expandedRound === round.round && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {/* Why it matters */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-primary" />
                          <h5 className="text-sm font-semibold text-gray-900">Why This Round Matters</h5>
                        </div>
                        <p className="text-sm text-gray-600 pl-6">{round.whyItMatters}</p>
                      </div>
                      
                      {/* Focus areas */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <h5 className="text-sm font-semibold text-gray-900">Key Focus Areas</h5>
                        </div>
                        <div className="flex flex-wrap gap-2 pl-6">
                          {round.focus.map((item, itemIdx) => (
                            <span
                              key={itemIdx}
                              className="px-2 py-1 bg-white text-gray-700 text-xs rounded-full border border-gray-200"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RoundMapping
