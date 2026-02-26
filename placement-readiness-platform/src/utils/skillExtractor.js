// Skill extraction utility - Heuristic-based keyword detection
import { FALLBACK_SKILLS, DEFAULT_SKILLS } from './analysisSchema'

const SKILL_CATEGORIES = {
  coreCS: {
    label: 'Core CS',
    keywords: ['DSA', 'OOP', 'DBMS', 'OS', 'Networks', 'Operating System', 'Database', 'Computer Networks']
  },
  languages: {
    label: 'Languages',
    keywords: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go', 'Golang', 'Rust', 'Swift', 'Kotlin', 'PHP', 'Ruby']
  },
  web: {
    label: 'Web Development',
    keywords: ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL', 'Angular', 'Vue', 'Svelte', 'HTML', 'CSS', 'Bootstrap', 'Tailwind', 'jQuery', 'Spring Boot', 'Django', 'Flask']
  },
  data: {
    label: 'Data & Databases',
    keywords: ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'Cassandra', 'DynamoDB', 'Firebase', 'Supabase', 'Prisma', 'Hibernate', 'JDBC']
  },
  cloudDevOps: {
    label: 'Cloud & DevOps',
    keywords: ['AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'K8s', 'CI/CD', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'Terraform', 'Ansible', 'Linux', 'Ubuntu', 'CentOS', 'Nginx', 'Apache']
  },
  testing: {
    label: 'Testing',
    keywords: ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest', 'Jest', 'Mocha', 'Chai', 'Cucumber', 'Postman', 'JMeter', 'Load Testing', 'Unit Testing', 'Integration Testing']
  }
}

// Normalize text for matching
function normalizeText(text) {
  return text.toLowerCase().replace(/[^a-z0-9+#/\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

// Extract skills from JD text
export function extractSkills(jdText) {
  const normalizedJD = normalizeText(jdText)
  const extractedSkills = {}
  const detectedCategories = new Set()

  // Check each category
  Object.entries(SKILL_CATEGORIES).forEach(([categoryKey, category]) => {
    const foundSkills = []
    
    category.keywords.forEach(keyword => {
      const normalizedKeyword = keyword.toLowerCase()
      // Check for exact word match or common variations
      const patterns = [
        `\\b${normalizedKeyword}\\b`,
        normalizedKeyword.replace(/\+/g, '\\+'),
        normalizedKeyword.replace(/\//g, '\\/')
      ]
      
      const isMatch = patterns.some(pattern => {
        const regex = new RegExp(pattern, 'i')
        return regex.test(normalizedJD)
      })
      
      if (isMatch && !foundSkills.includes(keyword)) {
        foundSkills.push(keyword)
      }
    })
    
    if (foundSkills.length > 0) {
      extractedSkills[categoryKey] = {
        label: category.label,
        skills: foundSkills
      }
      detectedCategories.add(categoryKey)
    }
  })

  // If no skills detected, use fallback skills
  const hasAnySkills = Object.keys(extractedSkills).length > 0
  
  if (!hasAnySkills) {
    // Use fallback skills in the "other" category
    extractedSkills.other = {
      label: 'General Skills',
      skills: FALLBACK_SKILLS.other
    }
    detectedCategories.add('other')
  }

  return {
    skills: extractedSkills,
    categories: Array.from(detectedCategories),
    categoryCount: detectedCategories.size,
    hasDetectedSkills: hasAnySkills
  }
}

// Calculate readiness score
export function calculateReadinessScore(jdText, company, role, extractedCategories) {
  let score = 35 // Base score

  // +5 per detected category (max 30)
  const categoryBonus = Math.min(extractedCategories.length * 5, 30)
  score += categoryBonus

  // +10 if company name provided
  if (company && company.trim().length > 0) {
    score += 10
  }

  // +10 if role provided
  if (role && role.trim().length > 0) {
    score += 10
  }

  // +10 if JD length > 800 chars
  if (jdText && jdText.length > 800) {
    score += 10
  }

  // Cap at 100
  return Math.min(score, 100)
}

// Generate round-wise checklist based on detected skills
export function generateChecklist(extractedSkills, categories) {
  const hasSkill = (category) => categories.includes(category)
  const hasWeb = hasSkill('web') || hasSkill('languages')
  const hasData = hasSkill('data')
  const hasCloud = hasSkill('cloudDevOps')
  const hasTesting = hasSkill('testing')

  return {
    round1: {
      title: 'Round 1: Aptitude & Basics',
      items: [
        'Practice quantitative aptitude (percentages, ratios, time-speed-distance)',
        'Solve 10-15 logical reasoning puzzles',
        'Review verbal ability (grammar, comprehension)',
        'Complete 1 full-length mock aptitude test',
        hasSkill('coreCS') ? 'Brush up on basic CS fundamentals' : 'Learn basic computer science concepts',
        'Practice time management for online tests'
      ]
    },
    round2: {
      title: 'Round 2: DSA & Core CS',
      items: [
        'Solve 5 easy array/string problems',
        'Solve 5 medium problems on your weak topics',
        'Practice 2-3 tree/graph traversal problems',
        hasSkill('coreCS') ? 'Review OOP principles with examples' : 'Learn basic OOP concepts',
        hasSkill('coreCS') ? 'Study DBMS normalization and joins' : 'Understand database basics',
        hasSkill('coreCS') ? 'Review OS concepts: processes, threads, memory' : 'Learn OS fundamentals',
        'Practice writing clean, optimized code',
        'Time yourself: solve 2 problems in 45 minutes'
      ]
    },
    round3: {
      title: 'Round 3: Technical Interview',
      items: [
        hasWeb ? 'Prepare to explain your projects in detail' : 'Prepare basic project explanations',
        hasWeb ? 'Review React/Node.js lifecycle and hooks' : 'Learn about your target tech stack',
        hasData ? 'Practice SQL queries: joins, subqueries, optimization' : 'Understand basic database queries',
        hasCloud ? 'Explain Docker containers vs VMs' : 'Learn about deployment basics',
        hasTesting ? 'Discuss testing strategies you have used' : 'Understand importance of testing',
        'Prepare answers for "Why this company?"',
        'Review your resume thoroughly - every point',
        'Practice explaining system design of your projects'
      ]
    },
    round4: {
      title: 'Round 4: Managerial & HR',
      items: [
        'Prepare STAR format answers for behavioral questions',
        'Research company culture, values, and recent news',
        'Prepare questions to ask the interviewer',
        'Practice salary negotiation talking points',
        'Review your career goals and 5-year plan',
        'Prepare for "Tell me about yourself" (2-minute version)',
        'Practice confidence and communication skills',
        'Plan your interview day logistics'
      ]
    }
  }
}

// Generate 7-day preparation plan
export function generatePlan(extractedSkills, categories) {
  const hasSkill = (category) => categories.includes(category)
  const hasWeb = hasSkill('web')
  const hasData = hasSkill('data')
  const hasDSA = hasSkill('coreCS')

  return [
    {
      day: 'Day 1',
      focus: 'Basics + Core CS',
      tasks: [
        hasDSA ? 'Review OOP concepts with code examples' : 'Learn basic programming concepts',
        hasDSA ? 'Study DBMS: ER diagrams, normalization' : 'Understand database basics',
        'Solve 3 easy aptitude problems',
        'Read company-specific interview experiences'
      ]
    },
    {
      day: 'Day 2',
      focus: 'Core CS Continued',
      tasks: [
        hasDSA ? 'Review OS: process scheduling, deadlocks' : 'Learn how computers work basics',
        hasDSA ? 'Study Networks: OSI model, TCP/IP' : 'Understand internet basics',
        'Practice 2 array-based problems',
        'Update resume with relevant keywords'
      ]
    },
    {
      day: 'Day 3',
      focus: 'DSA + Coding Practice',
      tasks: [
        'Solve 5 medium DSA problems',
        hasDSA ? 'Focus on your weak data structures' : 'Practice basic data structures',
        'Review time/space complexity analysis',
        'Practice writing code on paper/whiteboard'
      ]
    },
    {
      day: 'Day 4',
      focus: 'Advanced DSA',
      tasks: [
        'Solve 3 hard problems or learn new patterns',
        'Practice tree/graph problems if applicable',
        'Review dynamic programming basics',
        'Do 1 timed mock coding test'
      ]
    },
    {
      day: 'Day 5',
      focus: 'Project + Resume Alignment',
      tasks: [
        'Review all projects - prepare detailed explanations',
        hasWeb ? 'Practice React/frontend concepts' : 'Review your tech stack',
        hasData ? 'Practice SQL queries with joins' : 'Learn basic query writing',
        'Align resume with JD keywords',
        'Prepare portfolio/GitHub showcase'
      ]
    },
    {
      day: 'Day 6',
      focus: 'Mock Interview Questions',
      tasks: [
        'Practice 10 technical questions aloud',
        'Do 1 mock interview with a friend or mirror',
        hasWeb ? 'Review system design basics' : 'Understand scalability concepts',
        'Prepare answers for common HR questions',
        'Research interviewer (if known)'
      ]
    },
    {
      day: 'Day 7',
      focus: 'Revision + Weak Areas',
      tasks: [
        'Review all mistakes from past 6 days',
        'Focus on identified weak areas',
        'Light coding practice (2-3 easy problems)',
        'Prepare interview day checklist',
        'Rest well - mental preparation is key'
      ]
    }
  ]
}

// Generate interview questions based on detected skills
export function generateQuestions(extractedSkills, categories) {
  const questions = []
  const skills = extractedSkills

  // DSA questions
  if (categories.includes('coreCS')) {
    questions.push(
      'Explain the difference between Array and Linked List. When would you use each?',
      'How would you optimize search in sorted data? Compare binary vs linear search.',
      'What is time complexity? Explain Big O notation with examples.',
      'Describe how a hash table works and handle collisions.',
      'Explain recursion vs iteration. When is recursion preferred?'
    )
  }

  // Language-specific questions
  if (categories.includes('languages')) {
    const langSkills = skills.languages?.skills || []
    if (langSkills.some(s => s.toLowerCase().includes('java'))) {
      questions.push(
        'Explain Java garbage collection and memory management.',
        'What is the difference between abstract class and interface in Java?'
      )
    }
    if (langSkills.some(s => s.toLowerCase().includes('python'))) {
      questions.push(
        'Explain Python decorators with a practical example.',
        'What are Python generators and when would you use them?'
      )
    }
    if (langSkills.some(s => s.toLowerCase().includes('javascript') || s.toLowerCase().includes('typescript'))) {
      questions.push(
        'Explain JavaScript closures and provide a use case.',
        'What is the event loop in JavaScript?'
      )
    }
  }

  // Web development questions
  if (categories.includes('web')) {
    const webSkills = skills.web?.skills || []
    if (webSkills.some(s => s.toLowerCase().includes('react'))) {
      questions.push(
        'Explain React state management options: useState, useReducer, Context API, Redux.',
        'What are React hooks? Explain useEffect and its dependency array.',
        'How does React Virtual DOM work and why is it beneficial?'
      )
    }
    if (webSkills.some(s => s.toLowerCase().includes('node'))) {
      questions.push(
        'Explain the Node.js event-driven architecture.',
        'How does Node.js handle asynchronous operations?'
      )
    }
    questions.push(
      'What is REST API design? Explain best practices.',
      'Compare GraphQL vs REST. When would you choose one over the other?'
    )
  }

  // Database questions
  if (categories.includes('data')) {
    questions.push(
      'Explain indexing in databases and when it helps performance.',
      'What is database normalization? Explain 1NF, 2NF, 3NF.',
      'Compare SQL vs NoSQL databases. When to use each?',
      'How would you optimize a slow-running SQL query?'
    )
  }

  // Cloud/DevOps questions
  if (categories.includes('cloudDevOps')) {
    questions.push(
      'Explain Docker containers and how they differ from virtual machines.',
      'What is CI/CD? Describe a pipeline you would set up.',
      'How do you ensure high availability in cloud applications?'
    )
  }

  // Testing questions
  if (categories.includes('testing')) {
    questions.push(
      'What is the difference between unit, integration, and end-to-end testing?',
      'Explain TDD (Test Driven Development) and its benefits.'
    )
  }

  // General questions if few specific ones
  if (questions.length < 10) {
    const generalQuestions = [
      'Describe a challenging project you worked on and how you overcame obstacles.',
      'How do you stay updated with the latest technology trends?',
      'Explain your approach to debugging a complex issue.',
      'How do you handle conflicts in a team environment?',
      'Describe a time when you had to learn a new technology quickly.',
      'What is your approach to code reviews?',
      'How do you prioritize tasks when working on multiple projects?'
    ]
    questions.push(...generalQuestions.slice(0, 10 - questions.length))
  }

  return questions.slice(0, 10)
}
