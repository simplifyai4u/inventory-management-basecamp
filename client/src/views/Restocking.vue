<template>
  <div class="restocking">
    <div class="page-header">
      <h2>Restocking</h2>
      <p>Set a budget to get recommended restock orders by demand gap</p>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Budget</h3>
        <div class="budget-value">{{ formatCurrency(budget) }}</div>
      </div>
      <input
        type="range"
        min="0"
        max="50000"
        step="500"
        v-model.number="budget"
        class="budget-slider"
      />
      <div class="budget-range">
        <span>$0</span>
        <span>$50,000</span>
      </div>
    </div>

    <div v-if="successMessage" class="success-banner">
      {{ successMessage }}
    </div>

    <div v-if="loading" class="loading">Loading recommendations...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div v-if="budget <= 0" class="card">
        <div style="padding: 2rem; text-align: center; color: #64748b;">
          Move the slider to see restock recommendations.
        </div>
      </div>
      <div v-else-if="recommendations.length === 0" class="card">
        <div style="padding: 2rem; text-align: center; color: #64748b;">
          No restock recommendations fit this budget.
        </div>
      </div>
      <div v-else class="card">
        <div class="card-header">
          <h3 class="card-title">Recommendations ({{ recommendations.length }})</h3>
          <button
            class="place-order-btn"
            :disabled="!canPlaceOrder"
            @click="placeOrder"
          >
            {{ placingOrder ? 'Placing Order...' : 'Place Order' }}
          </button>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Warehouse</th>
                <th>Unit Cost</th>
                <th>Demand Gap</th>
                <th>Suggested Qty</th>
                <th>Estimated Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rec in recommendations" :key="rec.sku">
                <td><strong>{{ rec.sku }}</strong></td>
                <td>{{ rec.item_name }}</td>
                <td>{{ rec.category }}</td>
                <td>{{ rec.warehouse }}</td>
                <td>{{ formatCurrency(rec.unit_cost) }}</td>
                <td>{{ rec.demand_gap }}</td>
                <td>{{ rec.suggested_quantity }}</td>
                <td>{{ formatCurrency(rec.estimated_cost) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="7" style="text-align: right; font-weight: 600;">Total Estimated Cost</td>
                <td><strong>{{ formatCurrency(totalCost) }}</strong></td>
              </tr>
              <tr>
                <td colspan="7" style="text-align: right; font-weight: 600;">Remaining Budget</td>
                <td>
                  <strong :style="{ color: remainingBudget < 0 ? '#dc2626' : '#059669' }">
                    {{ formatCurrency(remainingBudget) }}
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { api } from '../api'

export default {
  name: 'Restocking',
  setup() {
    const budget = ref(0)
    const recommendations = ref([])
    const loading = ref(false)
    const error = ref(null)
    const placingOrder = ref(false)
    const successMessage = ref(null)

    let debounceTimer = null

    const totalCost = computed(() => {
      return recommendations.value.reduce((sum, rec) => sum + rec.estimated_cost, 0)
    })

    const remainingBudget = computed(() => budget.value - totalCost.value)

    const canPlaceOrder = computed(() => {
      return recommendations.value.length > 0 && !placingOrder.value
    })

    const formatCurrency = (value) => {
      return (value || 0).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      })
    }

    const loadRecommendations = async () => {
      if (budget.value <= 0) {
        recommendations.value = []
        return
      }

      try {
        loading.value = true
        error.value = null
        recommendations.value = await api.getRestockRecommendations(budget.value)
      } catch (err) {
        error.value = 'Failed to load recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    // Debounce so the API isn't hit on every slider tick while dragging
    watch(budget, () => {
      successMessage.value = null
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(loadRecommendations, 400)
    })

    const placeOrder = async () => {
      if (!canPlaceOrder.value) return

      try {
        placingOrder.value = true
        error.value = null
        const orderData = {
          budget: budget.value,
          items: recommendations.value.map(rec => ({
            sku: rec.sku,
            item_name: rec.item_name,
            quantity: rec.suggested_quantity,
            unit_cost: rec.unit_cost
          }))
        }
        const order = await api.createRestockOrder(orderData)
        successMessage.value = `Order ${order.order_number} submitted - expected delivery ${order.expected_delivery} (${order.lead_time_days} day lead time)`
        await loadRecommendations()
      } catch (err) {
        error.value = 'Failed to place order: ' + err.message
      } finally {
        placingOrder.value = false
      }
    }

    onMounted(loadRecommendations)
    onBeforeUnmount(() => {
      if (debounceTimer) clearTimeout(debounceTimer)
    })

    return {
      budget,
      recommendations,
      loading,
      error,
      placingOrder,
      successMessage,
      totalCost,
      remainingBudget,
      canPlaceOrder,
      formatCurrency,
      placeOrder
    }
  }
}
</script>

<style scoped>
.budget-slider {
  width: 100%;
  margin-top: 0.5rem;
  accent-color: #2563eb;
}

.budget-range {
  display: flex;
  justify-content: space-between;
  color: #64748b;
  font-size: 0.813rem;
  margin-top: 0.375rem;
}

.budget-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.success-banner {
  background: #d1fae5;
  border: 1px solid #a7f3d0;
  color: #065f46;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.25rem;
  font-size: 0.938rem;
  font-weight: 500;
}

.place-order-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.place-order-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.place-order-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

tfoot td {
  border-top: 2px solid #e2e8f0;
  padding: 0.625rem 0.75rem;
}
</style>
