import { Mail, MapPin, Calendar, Edit } from 'lucide-react'

function Profile() {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    location: 'San Francisco, CA',
    joined: 'January 2024',
    role: 'Software Engineer',
    bio: 'Passionate about building scalable applications and solving complex problems. Currently preparing for interviews at top tech companies.'
  }

  const skills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'System Design'
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-primary">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h3>
            <p className="text-sm text-primary font-medium mb-4">{user.role}</p>
            
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Joined {user.joined}</span>
              </div>
            </div>
            
            <button className="mt-6 w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
            <p className="text-gray-600 leading-relaxed">{user.bio}</p>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-50 text-primary text-sm font-medium rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
              <p className="text-3xl font-bold text-primary mb-1">124</p>
              <p className="text-sm text-gray-600">Problems Solved</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
              <p className="text-3xl font-bold text-primary mb-1">8</p>
              <p className="text-sm text-gray-600">Mock Interviews</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
              <p className="text-3xl font-bold text-primary mb-1">15</p>
              <p className="text-sm text-gray-600">Assessments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
