<!-- src/views/Network.vue -->
<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-gray-900">Network</h2>
      <p class="mt-1 text-sm text-gray-600">Configure network bridges, bonds, and VLANs</p>
    </div>

    <div class="bg-white shadow-sm rounded-lg border border-gray-200">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Network Interfaces</h3>
      </div>
      <div class="border-t border-gray-200">
        <ul class="divide-y divide-gray-200">
          <li v-for="iface in networkInterfaces" :key="iface.name" class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <WifiIcon class="h-6 w-6 text-gray-400" />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ iface.name }}</div>
                  <div class="text-sm text-gray-500">{{ iface.type }} · {{ iface.ip }}</div>
                </div>
              </div>
              <div class="flex items-center">
                <span :class="[
                  iface.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800',
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
                ]">
                  {{ iface.active ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="mt-6 bg-white shadow-sm rounded-lg border border-gray-200">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">VLANs</h3>
      </div>
      <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
        <p class="text-sm text-gray-500">No VLANs configured</p>
      </div>
    </div>
  </div>
</template>

<script>
import { WifiIcon } from '@heroicons/vue/24/outline';

export default {
  name: 'Network',
  components: {
    WifiIcon
  },
  data() {
    return {
      networkInterfaces: [
        {
          name: 'vmbr0',
          type: 'Linux Bridge',
          ip: '172.20.7.100/24',
          active: true
        },
        {
          name: 'eth0',
          type: 'Network Device',
          ip: '172.20.7.100',
          active: true
        },
        {
          name: 'vmbr1',
          type: 'Linux Bridge',
          ip: 'No IP',
          active: false
        }
      ]
    };
  }
};
</script>