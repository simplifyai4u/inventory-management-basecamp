import { ref } from 'vue'

const MOBILE_QUERY = '(max-width: 1024px)'
const mediaQuery = typeof window !== 'undefined' ? window.matchMedia(MOBILE_QUERY) : null

const collapsed = ref(mediaQuery ? mediaQuery.matches : false)

// Tracks whether the user has manually toggled the sidebar this session so the
// resize listener's auto-collapse/auto-expand behavior doesn't override their choice.
let userOverride = false

const handleResize = (event) => {
  if (userOverride) return
  collapsed.value = event.matches
}

if (mediaQuery) {
  mediaQuery.addEventListener('change', handleResize)
}

const toggleCollapsed = () => {
  userOverride = true
  collapsed.value = !collapsed.value
}

export function useSidebar() {
  return {
    collapsed,
    toggleCollapsed
  }
}
