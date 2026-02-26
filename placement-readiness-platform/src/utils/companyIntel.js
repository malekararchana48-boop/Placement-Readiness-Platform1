// Company Intel and Round Mapping - Heuristic-based generation

// Known enterprise companies
const ENTERPRISE_COMPANIES = [
  'amazon', 'microsoft', 'google', 'apple', 'meta', 'facebook', 'netflix',
  'infosys', 'tcs', 'tata consultancy', 'wipro', 'accenture', 'cognizant',
  'ibm', 'oracle', 'sap', 'salesforce', 'adobe', 'intel', 'cisco',
  'dell', 'hp', 'hewlett packard', 'hcl', 'tech mahindra', 'capgemini',
  'deloitte', 'ey', 'ernst young', 'kpmg', 'pwc', 'pricewaterhouse',
  'jpmorgan', 'goldman sachs', 'morgan stanley', 'bank of america',
  'wells fargo', 'citibank', 'hsbc', 'barclays', 'deutsche bank',
  'samsung', 'lg', 'sony', 'toyota', 'honda', 'bmw', 'mercedes',
  'siemens', 'bosch', 'philips', 'nokia', 'ericsson', 'qualcomm',
  'nvidia', 'amd', 'broadcom', 'texas instruments', 'micron'
]

// Industry keywords for inference
const INDUSTRY_KEYWORDS = {
  'Finance': ['bank', 'finance', 'fintech', 'payment', 'trading', 'investment', 'insurance', 'wealth'],
  'Healthcare': ['health', 'medical', 'pharma', 'biotech', 'hospital', 'clinic', 'diagnostic'],
  'E-commerce': ['ecommerce', 'e-commerce', 'retail', 'shopping', 'marketplace', 'delivery'],
  'EdTech': ['education', 'learning', 'training', 'academy', 'university', 'school', 'course'],
  'SaaS': ['saas', 'software', 'platform', 'cloud', 'enterprise software'],
  'Gaming': ['game', 'gaming', 'esports', 'entertainment'],
  'AI/ML': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'data science', 'nlp'],
  'Cybersecurity': ['security', 'cyber', 'threat', 'protection', 'firewall', 'encryption']
}

// Determine company size category
export function getCompanySize(companyName) {
  if (!companyName) return 'Startup'
  
  const normalizedName = companyName.toLowerCase().trim()
  
  // Check against known enterprise list
  const isEnterprise = ENTERPRISE_COMPANIES.some(enterprise => 
    normalizedName.includes(enterprise) || enterprise.includes(normalizedName)
  )
  
  if (isEnterprise) return 'Enterprise'
  
  // Heuristic: longer names often indicate smaller/newer companies
  // Well-known abbreviations often indicate larger companies
  const shortNames = ['uber', 'lyft', 'airbnb', 'stripe', 'square', 'shopify', 'spotify', 'zoom', 'slack', 'notion']
  const isMidSize = shortNames.some(name => normalizedName.includes(name))
  
  if (isMidSize) return 'Mid-size'
  
  // Default to Startup for unknown companies
  return 'Startup'
}

// Get company size number range
export function getCompanySizeRange(size) {
  switch (size) {
    case 'Startup': return '<200 employees'
    case 'Mid-size': return '200–2,000 employees'
    case 'Enterprise': return '2,000+ employees'
    default: return 'Unknown'
  }
}

// Infer industry from company name and JD
export function inferIndustry(companyName, jdText) {
  const textToAnalyze = `${companyName || ''} ${jdText || ''}`.toLowerCase()
  
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some(keyword => textToAnalyze.includes(keyword))) {
      return industry
    }
  }
  
  return 'Technology Services'
}

// Get hiring focus based on company size
export function getHiringFocus(companySize) {
  switch (companySize) {
    case 'Enterprise':
      return {
        title: 'Structured Fundamentals',
        points: [
          'Strong emphasis on DSA and computer science fundamentals',
          'Standardized interview processes with multiple rounds',
          'Focus on problem-solving methodology over syntax',
          'System design at scale is often evaluated',
          'Behavioral questions aligned with company values'
        ]
      }
    case 'Mid-size':
      return {
        title: 'Balanced Evaluation',
        points: [
          'Mix of DSA and practical coding problems',
          'Evaluation of domain-specific knowledge',
          'Focus on past project experience',
          'Collaboration and communication skills',
          'Growth mindset and adaptability'
        ]
      }
    case 'Startup':
      return {
        title: 'Practical Problem Solving',
        points: [
          'Hands-on coding and real-world scenarios',
          'Depth in specific tech stack over breadth',
          'Ability to work independently and wear multiple hats',
          'Product thinking and user empathy',
          'Fast learning and iteration capabilities'
        ]
      }
    default:
      return {
        title: 'General Assessment',
        points: [
          'Fundamental programming concepts',
          'Problem-solving approach',
          'Communication and teamwork',
          'Willingness to learn'
        ]
      }
  }
}

// Generate round mapping based on company size and detected skills
export function generateRoundMapping(companySize, detectedSkills, categories) {
  const hasDSA = categories.includes('coreCS')
  const hasWeb = categories.includes('web')
  const hasSystemDesign = categories.includes('coreCS') || categories.includes('cloudDevOps')
  
  const rounds = []
  
  if (companySize === 'Enterprise') {
    // Enterprise typically has 4 rounds
    rounds.push({
      round: 1,
      title: 'Online Assessment',
      description: 'DSA + Aptitude + Basic Coding',
      whyItMatters: 'Filters candidates based on fundamental problem-solving abilities. High volume screening tool.',
      focus: hasDSA ? ['DSA problems', 'Aptitude', 'Basic coding'] : ['Logical reasoning', 'Basic programming', 'Aptitude'],
      duration: '60-90 mins'
    })
    
    rounds.push({
      round: 2,
      title: 'Technical Interview I',
      description: 'DSA Deep Dive + Core CS',
      whyItMatters: 'Evaluates depth of algorithmic thinking and CS fundamentals. Core hiring criteria.',
      focus: hasDSA ? ['Data structures', 'Algorithms', 'Complexity analysis', 'OOP concepts'] : ['Programming basics', 'Problem solving', 'Code quality'],
      duration: '45-60 mins'
    })
    
    rounds.push({
      round: 3,
      title: 'Technical Interview II',
      description: 'Projects + System Design + Tech Stack',
      whyItMatters: 'Assesses practical experience and ability to design scalable systems.',
      focus: hasSystemDesign ? ['System design', 'Project discussion', 'Tech stack depth'] : ['Project deep dive', 'Technology choices', 'Architecture understanding'],
      duration: '60 mins'
    })
    
    rounds.push({
      round: 4,
      title: 'Managerial / HR Round',
      description: 'Behavioral + Culture Fit + Compensation',
      whyItMatters: 'Determines cultural alignment, communication skills, and final offer negotiation.',
      focus: ['Behavioral questions', 'Leadership principles', 'Career goals', 'Company knowledge'],
      duration: '30-45 mins'
    })
    
  } else if (companySize === 'Mid-size') {
    // Mid-size typically has 3-4 rounds
    rounds.push({
      round: 1,
      title: 'Technical Screening',
      description: 'Coding + Problem Solving',
      whyItMatters: 'Quick assessment of coding ability and thought process.',
      focus: hasDSA ? ['Coding problems', 'DSA basics'] : ['Practical coding', 'Problem solving'],
      duration: '45-60 mins'
    })
    
    rounds.push({
      round: 2,
      title: 'Technical Deep Dive',
      description: 'Projects + System Design',
      whyItMatters: 'Evaluates depth of experience and system thinking.',
      focus: hasWeb ? ['Full-stack understanding', 'API design', 'Database choices'] : ['Technical depth', 'Architecture', 'Best practices'],
      duration: '60 mins'
    })
    
    rounds.push({
      round: 3,
      title: 'Culture & Values Fit',
      description: 'Behavioral + Team Fit',
      whyItMatters: 'Ensures alignment with company culture and team dynamics.',
      focus: ['Past experiences', 'Team collaboration', 'Growth mindset', 'Company values'],
      duration: '45 mins'
    })
    
  } else {
    // Startup typically has 2-3 rounds
    rounds.push({
      round: 1,
      title: 'Practical Coding',
      description: 'Real-world Problem Solving',
      whyItMatters: 'Tests ability to solve practical problems similar to day-to-day work.',
      focus: hasWeb ? ['Build a small feature', 'Debug code', 'API integration'] : ['Coding challenge', 'Problem solving', 'Code review'],
      duration: '60-90 mins'
    })
    
    rounds.push({
      round: 2,
      title: 'System & Architecture Discussion',
      description: 'Design + Tech Choices',
      whyItMatters: 'Evaluates ability to make technical decisions and understand trade-offs.',
      focus: hasSystemDesign ? ['System design', 'Tech stack rationale', 'Scalability'] : ['Architecture basics', 'Technology choices', 'Trade-offs'],
      duration: '45-60 mins'
    })
    
    rounds.push({
      round: 3,
      title: 'Founder/Team Fit',
      description: 'Culture + Mission Alignment',
      whyItMatters: 'Critical for startups - ensures passion for the mission and cultural fit.',
      focus: ['Why this startup', 'Entrepreneurial mindset', 'Adaptability', 'Ownership'],
      duration: '30-45 mins'
    })
  }
  
  return rounds
}

// Generate complete company intel
export function generateCompanyIntel(companyName, jdText, categories) {
  const size = getCompanySize(companyName)
  const sizeRange = getCompanySizeRange(size)
  const industry = inferIndustry(companyName, jdText)
  const hiringFocus = getHiringFocus(size)
  const roundMapping = generateRoundMapping(size, {}, categories)
  
  return {
    companyName: companyName || 'Unknown Company',
    size,
    sizeRange,
    industry,
    hiringFocus,
    roundMapping,
    isDemo: true
  }
}
