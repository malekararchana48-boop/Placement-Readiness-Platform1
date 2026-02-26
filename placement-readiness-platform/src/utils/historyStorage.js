// localStorage history management for analysis results

const STORAGE_KEY = 'placement_readiness_history'

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Get all history entries
export function getHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch (error) {
    console.error('Error reading history:', error)
    return []
  }
}

// Save a new analysis entry
export function saveAnalysis(analysisData) {
  try {
    const history = getHistory()
    
    const newEntry = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...analysisData
    }
    
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

// Update an existing entry
export function updateAnalysis(id, updates) {
  try {
    const history = getHistory()
    const index = history.findIndex(entry => entry.id === id)
    
    if (index === -1) {
      throw new Error('Analysis not found')
    }
    
    // Merge updates with existing entry
    history[index] = {
      ...history[index],
      ...updates,
      id: history[index].id, // Preserve ID
      createdAt: history[index].createdAt // Preserve creation date
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    return history[index]
  } catch (error) {
    console.error('Error updating analysis:', error)
    throw new Error('Failed to update analysis')
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
