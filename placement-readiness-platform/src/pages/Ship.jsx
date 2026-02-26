import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { isChecklistComplete, getPassedCount, getTotalCount } from '../utils/testChecklist'
import { 
  Lock, 
  Unlock, 
  Rocket, 
  CheckCircle2, 
  AlertTriangle,
  ArrowLeft,
  ExternalLink
} from 'lucide-react'

function Ship() {
  const navigate = useNavigate()
  const [isLocked, setIsLocked] = useState(true)
  const [passedCount, setPassedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(10)

  useEffect(() => {
    checkLockStatus()
  }, [])

  const checkLockStatus = () => {
    const complete = isChecklistComplete()
    setIsLocked(!complete)
    setPassedCount(getPassedCount())
    setTotalCount(getTotalCount())
  }

  const handleGoToTests = () => {
    navigate('/prp/07-test')
  }

  const handleGoBack = () => {
    navigate('/dashboard')
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Ship</h2>
        <p className="text-gray-600 mt-1">
          Ready to deploy the Placement Readiness Platform.
        </p>
      </div>

      {/* Lock Status Card */}
      <Card className={`mb-6 ${isLocked ? 'border-amber-200' : 'border-green-200'}`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {isLocked ? (
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Lock className="w-8 h-8 text-amber-600" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Unlock className="w-8 h-8 text-green-600" />
              </div>
            )}
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {isLocked ? 'Shipping Locked' : 'Ready to Ship'}
              </h3>
              
              {isLocked ? (
                <>
                  <p className="text-gray-600 mb-4">
                    Complete all test checklist items before shipping.
                  </p>
                  <div className="flex items-center gap-2 text-amber-700 bg-amber-50 p-3 rounded-lg">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">
                      {passedCount} of {totalCount} tests completed
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">
                    All tests passed! The platform is ready for deployment.
                  </p>
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">
                      All {totalCount} tests completed successfully
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ship Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            Deployment Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLocked ? (
            <div className="text-center py-8">
              <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Shipping is Locked
              </h4>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You must complete the test checklist before you can ship the platform.
              </p>
              <button
                onClick={handleGoToTests}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors mx-auto"
              >
                <ArrowLeft className="w-5 h-5" />
                Go to Test Checklist
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h4 className="font-semibold text-green-900">
                    Pre-deployment Checklist Complete
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-green-700 ml-9">
                  <li>All 10 tests passed</li>
                  <li>Features verified</li>
                  <li>No blocking issues</li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => window.open('https://github.com/malekararchana48-boop/Placement-Readiness-Platform1', '_blank')}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                >
                  <Rocket className="w-5 h-5" />
                  View Repository
                  <ExternalLink className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleGoBack}
                  className="flex items-center justify-center gap-2 w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Dashboard
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                The platform is ready for production use.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">About Shipping</h4>
        <p className="text-sm text-blue-700">
          This page ensures all critical functionality has been verified before the platform 
          is considered production-ready. The test checklist must be completed to unlock shipping.
        </p>
      </div>
    </div>
  )
}

export default Ship
