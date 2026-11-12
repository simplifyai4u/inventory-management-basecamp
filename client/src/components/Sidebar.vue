<template>
  <aside class="sidebar" :class="{ collapsed }">
    <div class="sidebar-brand">
      <div class="brand-mark">CC</div>
      <div v-if="!collapsed" class="brand-text">
        <h1>{{ t('nav.companyName') }}</h1>
        <span class="subtitle">{{ t('nav.subtitle') }}</span>
      </div>
      <button
        class="collapse-toggle"
        :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        @click="toggleCollapsed"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" :class="{ flipped: collapsed }">
          <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <nav class="sidebar-nav">
      <router-link
        to="/"
        class="sidebar-link"
        :class="{ active: $route.path === '/' }"
        :title="t('nav.overview')"
        :aria-label="t('nav.overview')"
      >
        <svg class="sidebar-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
          <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
          <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
          <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <span class="sidebar-label">{{ t('nav.overview') }}</span>
      </router-link>

      <router-link
        to="/inventory"
        class="sidebar-link"
        :class="{ active: $route.path === '/inventory' }"
        :title="t('nav.inventory')"
        :aria-label="t('nav.inventory')"
      >
        <svg class="sidebar-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 6L10 2.5L17 6L10 9.5L3 6Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M3 6V14L10 17.5M17 6V14L10 17.5M10 9.5V17.5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
        <span class="sidebar-label">{{ t('nav.inventory') }}</span>
      </router-link>

      <router-link
        to="/orders"
        class="sidebar-link"
        :class="{ active: $route.path === '/orders' }"
        :title="t('nav.orders')"
        :aria-label="t('nav.orders')"
      >
        <svg class="sidebar-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 5H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M3 10H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M3 15H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span class="sidebar-label">{{ t('nav.orders') }}</span>
      </router-link>

      <router-link
        to="/spending"
        class="sidebar-link"
        :class="{ active: $route.path === '/spending' }"
        :title="t('nav.finance')"
        :aria-label="t('nav.finance')"
      >
        <svg class="sidebar-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 16V11M9 16V6M14 16V9M18 16H2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="sidebar-label">{{ t('nav.finance') }}</span>
      </router-link>

      <router-link
        to="/demand"
        class="sidebar-link"
        :class="{ active: $route.path === '/demand' }"
        :title="t('nav.demandForecast')"
        :aria-label="t('nav.demandForecast')"
      >
        <svg class="sidebar-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 13L7.5 8L11 11.5L17 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12.5 5H17V9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="sidebar-label">{{ t('nav.demandForecast') }}</span>
      </router-link>

      <router-link
        to="/restocking"
        class="sidebar-link"
        :class="{ active: $route.path === '/restocking' }"
        :title="t('nav.restocking')"
        :aria-label="t('nav.restocking')"
      >
        <svg class="sidebar-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M17 10A7 7 0 1 1 14.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M17 3V7H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="sidebar-label">{{ t('nav.restocking') }}</span>
      </router-link>

      <router-link
        to="/reports"
        class="sidebar-link"
        :class="{ active: $route.path === '/reports' }"
        :title="t('nav.reports')"
        :aria-label="t('nav.reports')"
      >
        <svg class="sidebar-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M6 2.5H12L15 5.5V17.5H5V2.5H6Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M7.5 9H12.5M7.5 12H12.5M7.5 15H10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span class="sidebar-label">{{ t('nav.reports') }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <LanguageSwitcher />
      <ProfileMenu
        @show-profile-details="$emit('show-profile-details')"
        @show-tasks="$emit('show-tasks')"
      />
    </div>
  </aside>
</template>

<script>
import { useI18n } from '../composables/useI18n'
import { useSidebar } from '../composables/useSidebar'
import LanguageSwitcher from './LanguageSwitcher.vue'
import ProfileMenu from './ProfileMenu.vue'

export default {
  name: 'Sidebar',
  components: {
    LanguageSwitcher,
    ProfileMenu
  },
  emits: ['show-profile-details', 'show-tasks'],
  setup() {
    const { t } = useI18n()
    const { collapsed, toggleCollapsed } = useSidebar()

    return {
      t,
      collapsed,
      toggleCollapsed
    }
  }
}
</script>

<style scoped>
.sidebar {
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.2s ease;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4);
  border-bottom: 1px solid #e2e8f0;
  min-height: 70px;
}

.brand-mark {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 0.025em;
}

.brand-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.brand-text h1 {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.025em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.brand-text .subtitle {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.collapse-toggle {
  margin-left: auto;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
}

.collapse-toggle:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.collapse-toggle svg {
  transition: transform 0.2s ease;
}

.collapse-toggle svg.flipped {
  transform: rotate(180deg);
}

.sidebar.collapsed .sidebar-brand {
  justify-content: center;
}

.sidebar.collapsed .collapse-toggle {
  margin-left: 0;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-3) var(--space-2);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.sidebar-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 0.625rem var(--space-3);
  border-radius: 8px;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
  transition: background 0.15s ease, color 0.15s ease;
  white-space: nowrap;
}

.sidebar-link:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.sidebar-link.active {
  background: #eff6ff;
  color: #2563eb;
}

.sidebar-link.active::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #2563eb;
  border-radius: 0 3px 3px 0;
}

.sidebar.collapsed .sidebar-link.active::before {
  left: -4px;
}

.sidebar-icon {
  flex-shrink: 0;
}

.sidebar-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar.collapsed .sidebar-link {
  justify-content: center;
  padding: 0.625rem;
}

.sidebar.collapsed .sidebar-label {
  display: none;
}

.sidebar-footer {
  border-top: 1px solid #e2e8f0;
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.sidebar.collapsed .sidebar-footer {
  align-items: center;
}

.sidebar.collapsed .sidebar-footer :deep(.language-label),
.sidebar.collapsed .sidebar-footer :deep(.chevron),
.sidebar.collapsed .sidebar-footer :deep(.profile-name) {
  display: none;
}

.sidebar.collapsed .sidebar-footer :deep(.language-button),
.sidebar.collapsed .sidebar-footer :deep(.profile-button) {
  width: 44px;
  justify-content: center;
  padding: 0.5rem;
}

.sidebar.collapsed .sidebar-footer :deep(.dropdown-menu) {
  left: 100%;
  right: auto;
  top: 0;
  margin-left: var(--space-2);
}
</style>
