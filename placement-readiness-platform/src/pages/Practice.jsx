import { Search, Filter, BookOpen } from 'lucide-react'

function Practice() {
  const problems = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'Array', status: 'Solved' },
    { id: 2, title: 'Reverse Linked List', difficulty: 'Easy', category: 'Linked List', status: 'Attempted' },
    { id: 3, title: 'Binary Tree Level Order', difficulty: 'Medium', category: 'Tree', status: 'Unsolved' },
    { id: 4, title: 'Merge Intervals', difficulty: 'Medium', category: 'Array', status: 'Unsolved' },
    { id: 5, title: 'LRU Cache', difficulty: 'Hard', category: 'Design', status: 'Unsolved' },
  ]

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50'
      case 'Medium': return 'text-yellow-600 bg-yellow-50'
      case 'Hard': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Solved': return 'text-green-600'
      case 'Attempted': return 'text-yellow-600'
      default: return 'text-gray-400'
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Practice Problems</h2>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search problems..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Problems Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Title</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Difficulty</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {problems.map((problem) => (
              <tr key={problem.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${getStatusColor(problem.status)}`}>
                    {problem.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{problem.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{problem.category}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Practice
