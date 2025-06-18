<!-- src/components/VMStatusItem.vue -->
<template>
  <div class="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-0">
    <div class="flex-shrink-0">
      <div 
        class="w-2 h-2 rounded-full mt-2"
        :class="statusColor"
      ></div>
    </div>
    
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between">
        <p class="text-sm font-medium text-gray-900">
          {{ vm.status.toUpperCase() }}
        </p>
        <p class="text-xs text-gray-500">
          {{ vm.name }}
        </p>
      </div>
      
      <p class="text-sm text-gray-600 mt-1">
        {{ vm.type }}
      </p>
      
      <p v-if="vm.ip" class="text-xs text-gray-500 mt-1">
        {{ vm.ip }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VMStatusItem',
  props: {
    vm: {
      type: Object,
      required: true
    }
  },
  computed: {
    statusColor() {
      const status = this.vm.status.toLowerCase();
      if (status.includes('start') || status.includes('login')) {
        return 'bg-green-500';
      } else if (status.includes('stop')) {
        return 'bg-red-500';
      } else {
        return 'bg-yellow-500';
      }
    }
  }
};
</script>