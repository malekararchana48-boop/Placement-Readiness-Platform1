import { FileText, Video, ExternalLink } from 'lucide-react'

function Resources() {
  const resources = [
    {
      id: 1,
      title: 'Resume Writing Guide',
      type: 'document',
      description: 'Tips and templates for creating an ATS-friendly resume',
      link: '#'
    },
    {
      id: 2,
      title: 'Behavioral Interview Prep',
      type: 'video',
      description: 'STAR method explained with real examples',
      link: '#'
    },
    {
      id: 3,
      title: 'Company Research Template',
      type: 'document',
      description: 'Structured approach to researching potential employers',
      link: '#'
    },
    {
      id: 4,
      title: 'Salary Negotiation Strategies',
      type: 'video',
      description: 'How to negotiate your offer effectively',
      link: '#'
    },
    {
      id: 5,
      title: 'Technical Interview Checklist',
      type: 'document',
      description: 'Essential topics to review before your interview',
      link: '#'
    },
    {
      id: 6,
      title: 'Networking Best Practices',
      type: 'video',
      description: 'Building professional connections that matter',
      link: '#'
    },
  ]

  const getIcon = (type) => {
    switch (type) {
      case 'document':
        return <FileText className="w-5 h-5 text-blue-600" />
      case 'video':
        return <Video className="w-5 h-5 text-red-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'document':
        return 'text-blue-600 bg-blue-50'
      case 'video':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Resources</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <a
            key={resource.id}
            href={resource.link}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md hover:border-primary-300 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(resource.type)}`}>
                {getIcon(resource.type)}
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
              {resource.title}
            </h3>
            <p className="text-sm text-gray-600">{resource.description}</p>
            
            <div className="mt-4">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getTypeColor(resource.type)}`}>
                {resource.type}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default Resources
