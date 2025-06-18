<!-- src/components/MetricCard.vue -->
<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 class="text-xs font-medium text-gray-600 uppercase tracking-wider mb-4">
      {{ title }}
    </h3>
    
    <div class="flex flex-col items-center">
      <!-- Circular Progress -->
      <div class="relative w-32 h-32 mb-4">
        <svg class="w-32 h-32 transform -rotate-90">
          <!-- Background circle -->
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke-width="12"
            fill="none"
            class="stroke-gray-200"
          />
          <!-- Progress circle -->
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke-width="12"
            fill="none"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
            class="stroke-blue-500 transition-all duration-500"
            stroke-linecap="round"
          />
        </svg>
        
        <!-- Percentage text -->
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-2xl font-semibold text-gray-800">
            {{ percentage.toFixed(2) }}%
          </span>
        </div>
      </div>
      
      <!-- Value text -->
      <div class="text-center">
        <p class="text-sm text-gray-600">
          {{ value }} / {{ total }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MetricCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    total: {
      type: String,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      default: 'blue'
    },
    showProgress: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    circumference() {
      return 2 * Math.PI * 56;
    },
    strokeDashoffset() {
      return this.circumference - (this.percentage / 100) * this.circumference;
    }
  }
};
</script>