import { TrendingUp, Target, Award, Clock } from 'lucide-react'

function Dashboard() {
  const stats = [
    { label: 'Problems Solved', value: '124', icon: Target, change: '+12 this week' },
    { label: 'Current Streak', value: '7 days', icon: TrendingUp, change: 'Keep it up!' },
    { label: 'Mock Interviews', value: '8', icon: Award, change: '2 this month' },
    { label: 'Study Hours', value: '48h', icon: Clock, change: '+5h from last week' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-primary mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Completed "Two Sum" problem</p>
              <p className="text-xs text-gray-500">Array • Easy • 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Finished Mock Interview Session</p>
              <p className="text-xs text-gray-500">Technical • 5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Started "Binary Search" topic</p>
              <p className="text-xs text-gray-500">Algorithms • 1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
