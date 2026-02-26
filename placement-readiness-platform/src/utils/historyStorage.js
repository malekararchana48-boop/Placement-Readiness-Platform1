// localStorage history management for analysis results
import { 
  createAnalysisEntry, 
  validateAndNormalizeEntry, 
  isValidEntry,
  updateSkillConfidence as schemaUpdateSkillConfidence 
} from './analysisSchema'

const STORAGE_KEY = 'placement_readiness_history'
const CORRUPTED_KEY = 'placement_readiness_corrupted_count'

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Get all history entries with validation
export function getHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    
    // Filter and validate entries
    const validEntries = []
    let corruptedCount = 0
    
    parsed.forEach(entry => {
      if (isValidEntry(entry)) {
        // Normalize to ensure schema consistency
        const normalized = validateAndNormalizeEntry(entry)
        if (normalized) {
          validEntries.push(normalized)
        } else {
          corruptedCount++
        }
      } else {
        corruptedCount++
      }
    })
    
    // Track corrupted entries for UI notification
    if (corruptedCount > 0) {
      localStorage.setItem(CORRUPTED_KEY, corruptedCount.toString())
    }
    
    return validEntries
  } catch (error) {
    console.error('Error reading history:', error)
    return []
  }
}

// Check if there were corrupted entries
export function hasCorruptedEntries() {
  const count = localStorage.getItem(CORRUPTED_KEY)
  return count ? parseInt(count, 10) > 0 : false
}

// Clear corrupted entry flag
export function clearCorruptedFlag() {
  localStorage.removeItem(CORRUPTED_KEY)
}

// Save a new analysis entry
export function saveAnalysis(analysisData) {
  try {
    const history = getHistory()
    
    // Use schema to create standardized entry
    const newEntry = createAnalysisEntry({
      ...analysisData,
      id: generateId(),
      createdAt: new Date().toISOString()
    })
    
    // Add to beginning of array (most recent first)
    history.unshift(newEntry)
    
    // Keep only last 50 entries to prevent storage issues
    const trimmedHistory = history.slice(0, 50)
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory))
    
    return newEntry
  } catch (error) {
    console.error('Error saving analysis:', error)
    throw new Error('Failed to save analysis to history')
  }
}

// Get a specific entry by ID
export function getAnalysisById(id) {
  try {
    const history = getHistory()
    return history.find(entry => entry.id === id) || null
  } catch (error) {
    console.error('Error getting analysis:', error)
    return null
  }
}

// Get the most recent analysis
export function getLatestAnalysis() {
  try {
    const history = getHistory()
    return history[0] || null
  } catch (error) {
    console.error('Error getting latest analysis:', error)
    return null
  }
}

// Delete a specific entry
export function deleteAnalysis(id) {
  try {
    const history = getHistory()
    const filtered = history.filter(entry => entry.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Error deleting analysis:', error)
    return false
  }
}

// Update an existing entry with score stability
export function updateAnalysis(id, updates) {
  try {
    const history = getHistory()
    const index = history.findIndex(entry => entry.id === id)
    
    if (index === -1) {
      throw new Error('Analysis not found')
    }
    
    const existingEntry = history[index]
    
    // Handle skill confidence updates with score recalculation
    let updatedEntry = { ...existingEntry }
    
    if (updates.skillConfidenceMap) {
      // Calculate which skills changed
      const oldConfidence = existingEntry.skillConfidenceMap || {}
      const newConfidence = updates.skillConfidenceMap
      
      // Find changed skills
      Object.entries(newConfidence).forEach(([skill, confidence]) => {
        if (oldConfidence[skill] !== confidence) {
          updatedEntry = schemaUpdateSkillConfidence(updatedEntry, skill, confidence)
        }
      })
      
      // Keep other updates
      delete updates.skillConfidenceMap
    }
    
    // Merge remaining updates
    updatedEntry = {
      ...updatedEntry,
      ...updates,
      id: existingEntry.id, // Preserve ID
      createdAt: existingEntry.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString() // Update timestamp
    }
    
    // Validate before saving
    const normalized = validateAndNormalizeEntry(updatedEntry)
    if (!normalized) {
      throw new Error('Updated entry failed validation')
    }
    
    history[index] = normalized
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    return normalized
  } catch (error) {
    console.error('Error updating analysis:', error)
    throw new Error('Failed to update analysis')
  }
}

// Update skill confidence specifically (for toggle interactions)
export function updateSkillConfidence(id, skill, confidence) {
  try {
    const history = getHistory()
    const index = history.findIndex(entry => entry.id === id)
    
    if (index === -1) {
      throw new Error('Analysis not found')
    }
    
    const updatedEntry = schemaUpdateSkillConfidence(history[index], skill, confidence)
    
    if (!updatedEntry) {
      throw new Error('Failed to update skill confidence')
    }
    
    history[index] = updatedEntry
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    return updatedEntry
  } catch (error) {
    console.error('Error updating skill confidence:', error)
    throw new Error('Failed to update skill confidence')
  }
}

// Clear all history
export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Error clearing history:', error)
    return false
  }
}

// Format date for display
export function formatDate(isoString) {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get relative time (e.g., "2 hours ago")
export function getRelativeTime(isoString) {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
  if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`
  if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`
  return 'Just now'
}
