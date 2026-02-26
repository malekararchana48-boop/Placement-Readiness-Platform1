import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import OverallReadiness from '../components/OverallReadiness'
import SkillBreakdown from '../components/SkillBreakdown'
import ContinuePractice from '../components/ContinuePractice'
import WeeklyGoals from '../components/WeeklyGoals'
import UpcomingAssessments from '../components/UpcomingAssessments'

function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      
      {/* 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Overall Readiness */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Readiness</CardTitle>
            </CardHeader>
            <CardContent>
              <OverallReadiness score={72} maxScore={100} />
            </CardContent>
          </Card>

          {/* Skill Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillBreakdown />
            </CardContent>
          </Card>

          {/* Continue Practice */}
          <Card>
            <ContinuePractice />
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Weekly Goals */}
          <Card>
            <WeeklyGoals />
          </Card>

          {/* Upcoming Assessments */}
          <Card>
            <UpcomingAssessments />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
