<!-- src/views/Compute.vue -->
<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-gray-900">Compute Resources</h2>
      <p class="mt-1 text-sm text-gray-600">Manage your virtual machines and containers</p>
    </div>

    <div class="bg-white shadow-sm rounded-lg border border-gray-200">
      <div class="px-4 py-5 sm:p-6">
        <div class="text-center py-12">
          <ServerIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No VMs found</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new virtual machine.</p>
          <div class="mt-6">
            <button type="button" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <PlusIcon class="-ml-1 mr-2 h-5 w-5" />
              New VM
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ServerIcon, PlusIcon } from '@heroicons/vue/24/outline';

export default {
  name: 'Compute',
  components: {
    ServerIcon,
    PlusIcon
  }
};
</script>