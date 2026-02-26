// Analysis Entry Schema - Standardized data model for all analysis entries

import { v4 as uuidv4 } from 'uuid'

// Default empty skills structure
export const DEFAULT_SKILLS = {
  coreCS: [],
  languages: [],
  web: [],
  data: [],
  cloud: [],
  testing: [],
  other: []
}

// Fallback skills when no skills detected
export const FALLBACK_SKILLS = {
  coreCS: [],
  languages: [],
  web: [],
  data: [],
  cloud: [],
  testing: [],
  other: ['Communication', 'Problem solving', 'Basic coding', 'Projects']
}

// Default round mapping structure
export const DEFAULT_ROUND_MAPPING = []

// Default checklist structure
export const DEFAULT_CHECKLIST = []

// Default 7-day plan structure
export const DEFAULT_PLAN_7_DAYS = []

// Default questions array
export const DEFAULT_QUESTIONS = []

// Create a new standardized analysis entry
export function createAnalysisEntry(data = {}) {
  const now = new Date().toISOString()
  
  return {
    // Core identifiers
    id: data.id || generateId(),
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    
    // Input fields
    company: sanitizeString(data.company) || '',
    role: sanitizeString(data.role) || '',
    jdText: sanitizeString(data.jdText) || '',
    
    // Skills extraction
    extractedSkills: normalizeSkills(data.extractedSkills),
    
    // Round mapping
    roundMapping: normalizeRoundMapping(data.roundMapping),
    
    // Checklist
    checklist: normalizeChecklist(data.checklist),
    
    // 7-day plan
    plan7Days: normalizePlan7Days(data.plan7Days || data.plan),
    
    // Interview questions
    questions: normalizeQuestions(data.questions),
    
    // Scoring
    baseScore: normalizeNumber(data.baseScore, 0, 100, 50),
    skillConfidenceMap: normalizeSkillConfidenceMap(data.skillConfidenceMap),
    finalScore: normalizeNumber(data.finalScore, 0, 100, data.baseScore || 50),
    
    // Legacy compatibility
    categories: data.categories || [],
    categoryCount: data.categoryCount || 0,
    companyIntel: data.companyIntel || null
  }
}

// Validate and normalize an existing entry
export function validateAndNormalizeEntry(entry) {
  if (!entry || typeof entry !== 'object') {
    return null
  }
  
  try {
    // Ensure required fields exist
    const normalized = {
      id: entry.id || generateId(),
      createdAt: entry.createdAt || new Date().toISOString(),
      updatedAt: entry.updatedAt || new Date().toISOString(),
      company: sanitizeString(entry.company) || '',
      role: sanitizeString(entry.role) || '',
      jdText: sanitizeString(entry.jdText) || '',
      extractedSkills: normalizeSkills(entry.extractedSkills),
      roundMapping: normalizeRoundMapping(entry.roundMapping),
      checklist: normalizeChecklist(entry.checklist),
      plan7Days: normalizePlan7Days(entry.plan7Days || entry.plan),
      questions: normalizeQuestions(entry.questions),
      baseScore: normalizeNumber(entry.baseScore, 0, 100, 50),
      skillConfidenceMap: normalizeSkillConfidenceMap(entry.skillConfidenceMap),
      finalScore: normalizeNumber(entry.finalScore, 0, 100, entry.baseScore || 50),
      categories: entry.categories || [],
      categoryCount: entry.categoryCount || 0,
      companyIntel: entry.companyIntel || null
    }
    
    return normalized
  } catch (error) {
    console.error('Entry validation failed:', error)
    return null
  }
}

// Check if entry is valid (not corrupted)
export function isValidEntry(entry) {
  if (!entry || typeof entry !== 'object') return false
  if (!entry.id || typeof entry.id !== 'string') return false
  if (!entry.createdAt || typeof entry.createdAt !== 'string') return false
  if (typeof entry.jdText !== 'string') return false
  if (typeof entry.baseScore !== 'number') return false
  return true
}

// Calculate final score based on base score and confidence map
export function calculateFinalScore(baseScore, skillConfidenceMap) {
  let adjustedScore = baseScore
  
  Object.entries(skillConfidenceMap || {}).forEach(([skill, confidence]) => {
    if (confidence === 'know') {
      adjustedScore += 2
    } else if (confidence === 'practice') {
      adjustedScore -= 2
    }
  })
  
  return Math.max(0, Math.min(100, adjustedScore))
}

// Update skill confidence and recalculate final score
export function updateSkillConfidence(entry, skill, confidence) {
  if (!entry || !skill) return null
  
  const newConfidenceMap = {
    ...entry.skillConfidenceMap,
    [skill]: confidence
  }
  
  const newFinalScore = calculateFinalScore(entry.baseScore, newConfidenceMap)
  
  return {
    ...entry,
    skillConfidenceMap: newConfidenceMap,
    finalScore: newFinalScore,
    updatedAt: new Date().toISOString()
  }
}

// Helper: Generate unique ID
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Helper: Sanitize string input
function sanitizeString(value) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

// Helper: Normalize number within bounds
function normalizeNumber(value, min, max, defaultValue) {
  const num = Number(value)
  if (isNaN(num)) return defaultValue
  return Math.max(min, Math.min(max, num))
}

// Helper: Normalize skills object
function normalizeSkills(skills) {
  if (!skills || typeof skills !== 'object') {
    return { ...DEFAULT_SKILLS }
  }
  
  return {
    coreCS: normalizeStringArray(skills.coreCS),
    languages: normalizeStringArray(skills.languages),
    web: normalizeStringArray(skills.web),
    data: normalizeStringArray(skills.data),
    cloud: normalizeStringArray(skills.cloud),
    testing: normalizeStringArray(skills.testing),
    other: normalizeStringArray(skills.other)
  }
}

// Helper: Normalize round mapping array
function normalizeRoundMapping(rounds) {
  if (!Array.isArray(rounds)) return []
  
  return rounds.map((round, index) => ({
    round: round.round || index + 1,
    title: sanitizeString(round.title) || `Round ${index + 1}`,
    description: sanitizeString(round.description) || '',
    whyItMatters: sanitizeString(round.whyItMatters) || '',
    focus: normalizeStringArray(round.focus),
    duration: sanitizeString(round.duration) || '45-60 mins'
  }))
}

// Helper: Normalize checklist array
function normalizeChecklist(checklist) {
  if (!Array.isArray(checklist)) return []
  
  return checklist.map((item, index) => ({
    roundTitle: sanitizeString(item.roundTitle) || `Round ${index + 1}`,
    items: normalizeStringArray(item.items)
  }))
}

// Helper: Normalize 7-day plan array
function normalizePlan7Days(plan) {
  if (!Array.isArray(plan)) return []
  
  return plan.map((day, index) => ({
    day: day.day || `Day ${index + 1}`,
    focus: sanitizeString(day.focus) || '',
    tasks: normalizeStringArray(day.tasks)
  }))
}

// Helper: Normalize questions array
function normalizeQuestions(questions) {
  return normalizeStringArray(questions)
}

// Helper: Normalize skill confidence map
function normalizeSkillConfidenceMap(map) {
  if (!map || typeof map !== 'object') return {}
  
  const normalized = {}
  Object.entries(map).forEach(([skill, confidence]) => {
    const sanitizedSkill = sanitizeString(skill)
    if (sanitizedSkill && (confidence === 'know' || confidence === 'practice')) {
      normalized[sanitizedSkill] = confidence
    }
  })
  return normalized
}

// Helper: Normalize string array
function normalizeStringArray(arr) {
  if (!Array.isArray(arr)) return []
  return arr
    .map(item => sanitizeString(item))
    .filter(item => item.length > 0)
}

// Check if JD is too short for meaningful analysis
export function isJDTooShort(jdText) {
  if (!jdText || typeof jdText !== 'string') return true
  return jdText.trim().length < 200
}

// Get validation warning message
export function getJDValidationWarning(jdText) {
  if (!jdText || jdText.trim().length === 0) {
    return 'Please enter a job description'
  }
  if (jdText.trim().length < 200) {
    return 'This JD is too short to analyze deeply. Paste full JD for better output.'
  }
  return null
}
