// Test Checklist management for PRP shipping gate

const TEST_CHECKLIST_KEY = 'prp_test_checklist'

// Default test items
export const DEFAULT_TEST_ITEMS = [
  {
    id: 'jd-required',
    label: 'JD required validation works',
    hint: 'Go to Analysis page, try submitting empty JD. Should show error.',
    checked: false
  },
  {
    id: 'short-jd-warning',
    label: 'Short JD warning shows for <200 chars',
    hint: 'Enter JD with less than 200 characters. Amber warning should appear.',
    checked: false
  },
  {
    id: 'skills-extraction',
    label: 'Skills extraction groups correctly',
    hint: 'Paste a JD with React, Node.js, Python. Verify skills appear in correct categories.',
    checked: false
  },
  {
    id: 'round-mapping',
    label: 'Round mapping changes based on company + skills',
    hint: 'Test with "Amazon" (Enterprise) vs "StartupX" (Startup). Round count and types should differ.',
    checked: false
  },
  {
    id: 'score-deterministic',
    label: 'Score calculation is deterministic',
    hint: 'Analyze same JD twice. Base score should be identical.',
    checked: false
  },
  {
    id: 'skill-toggles',
    label: 'Skill toggles update score live',
    hint: 'On Results page, toggle skills. Final score should update immediately (+2/-2 per skill).',
    checked: false
  },
  {
    id: 'persist-refresh',
    label: 'Changes persist after refresh',
    hint: 'Toggle skills, refresh page. Skill states and final score should persist.',
    checked: false
  },
  {
    id: 'history-save-load',
    label: 'History saves and loads correctly',
    hint: 'Create analysis, go to History. Entry should appear with correct data.',
    checked: false
  },
  {
    id: 'export-buttons',
    label: 'Export buttons copy the correct content',
    hint: 'Click copy buttons on Results page. Clipboard should have expected content.',
    checked: false
  },
  {
    id: 'no-console-errors',
    label: 'No console errors on core pages',
    hint: 'Open browser console, navigate through Dashboard, Analysis, Results, History. No red errors.',
    checked: false
  }
]

// Get test checklist from localStorage
export function getTestChecklist() {
  try {
    const stored = localStorage.getItem(TEST_CHECKLIST_KEY)
    if (!stored) {
      return [...DEFAULT_TEST_ITEMS]
    }
    
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) {
      return [...DEFAULT_TEST_ITEMS]
    }
    
    // Merge with defaults to ensure all items exist
    const merged = DEFAULT_TEST_ITEMS.map(defaultItem => {
      const savedItem = parsed.find(p => p.id === defaultItem.id)
      return savedItem ? { ...defaultItem, checked: savedItem.checked } : defaultItem
    })
    
    return merged
  } catch (error) {
    console.error('Error reading test checklist:', error)
    return [...DEFAULT_TEST_ITEMS]
  }
}

// Save test checklist to localStorage
export function saveTestChecklist(checklist) {
  try {
    localStorage.setItem(TEST_CHECKLIST_KEY, JSON.stringify(checklist))
    return true
  } catch (error) {
    console.error('Error saving test checklist:', error)
    return false
  }
}

// Toggle a test item
export function toggleTestItem(id) {
  const checklist = getTestChecklist()
  const updated = checklist.map(item => 
    item.id === id ? { ...item, checked: !item.checked } : item
  )
  saveTestChecklist(updated)
  return updated
}

// Reset checklist to default (all unchecked)
export function resetTestChecklist() {
  const reset = DEFAULT_TEST_ITEMS.map(item => ({ ...item, checked: false }))
  saveTestChecklist(reset)
  return reset
}

// Get count of passed tests
export function getPassedCount() {
  const checklist = getTestChecklist()
  return checklist.filter(item => item.checked).length
}

// Get total test count
export function getTotalCount() {
  return DEFAULT_TEST_ITEMS.length
}

// Check if all tests are passed
export function isChecklistComplete() {
  const checklist = getTestChecklist()
  return checklist.every(item => item.checked)
}

// Get completion percentage
export function getCompletionPercentage() {
  const passed = getPassedCount()
  const total = getTotalCount()
  return total > 0 ? Math.round((passed / total) * 100) : 0
}
