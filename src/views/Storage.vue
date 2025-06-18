<!-- src/views/Storage.vue -->
<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-gray-900">Storage</h2>
      <p class="mt-1 text-sm text-gray-600">Manage storage pools and volumes</p>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="storage in storageList" :key="storage.id" class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CircleStackIcon class="h-8 w-8 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">{{ storage.name }}</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ storage.used }} / {{ storage.total }}</div>
                </dd>
              </dl>
            </div>
          </div>
          <div class="mt-4">
            <div class="relative">
              <div class="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div :style="{ width: storage.percentage + '%' }" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
            </div>
            <div class="mt-2 flex items-center justify-between text-xs text-gray-600">
              <span>{{ storage.percentage }}% used</span>
              <span>{{ storage.available }} available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CircleStackIcon } from '@heroicons/vue/24/outline';

export default {
  name: 'Storage',
  components: {
    CircleStackIcon
  },
  data() {
    return {
      storageList: [
        {
          id: 1,
          name: 'local',
          used: '15.2 GB',
          total: '50 GB',
          available: '34.8 GB',
          percentage: 30.4
        },
        {
          id: 2,
          name: 'local-lvm',
          used: '89.5 GB',
          total: '200 GB',
          available: '110.5 GB',
          percentage: 44.75
        }
      ]
    };
  }
};
</script>