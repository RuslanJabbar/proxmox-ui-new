<!-- src/views/Dashboard.vue -->
<template>
  <div>
    <!-- Zone Selector -->
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <select 
          v-model="selectedNode" 
          @change="fetchNodeData"
          class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Nodes</option>
          <option v-for="node in nodes" :key="node.node" :value="node.node">
            {{ node.node }} ({{ node.status }})
          </option>
        </select>
      </div>
      
      <button 
        @click="refreshData" 
        class="p-2 hover:bg-gray-100 rounded-md"
        :class="{ 'animate-spin': isRefreshing }"
      >
        <ArrowPathIcon class="w-5 h-5 text-gray-600" />
      </button>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        v-for="metric in metrics"
        :key="metric.id"
        :title="metric.title"
        :value="metric.value"
        :total="metric.total"
        :percentage="metric.percentage"
        :color="metric.color"
      />
    </div>

    <!-- Resource Details -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- VMs and Containers -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold mb-4">Virtual Machines & Containers</h3>
        <div v-if="vms.length === 0 && containers.length === 0" class="text-gray-500 text-center py-8">
          No VMs or containers found
        </div>
        <div v-else class="space-y-2">
          <div v-for="vm in [...vms, ...containers]" :key="vm.vmid" 
               class="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
            <div class="flex items-center space-x-3">
              <div :class="[
                'w-2 h-2 rounded-full',
                vm.status === 'running' ? 'bg-green-500' : 'bg-gray-400'
              ]"></div>
              <div>
                <p class="font-medium text-sm">{{ vm.name || `VM ${vm.vmid}` }}</p>
                <p class="text-xs text-gray-500">
                  {{ vm.type === 'qemu' ? 'Virtual Machine' : 'Container' }} • 
                  {{ vm.node }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">
                CPU: {{ (vm.cpu * 100).toFixed(1) }}%
              </p>
              <p class="text-xs text-gray-500">
                RAM: {{ formatBytes(vm.mem) }} / {{ formatBytes(vm.maxmem) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Tasks -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold mb-4">Recent Tasks</h3>
        <div v-if="tasks.length === 0" class="text-gray-500 text-center py-8">
          No recent tasks
        </div>
        <div v-else class="space-y-3">
          <div v-for="task in tasks.slice(0, 5)" :key="task.upid" class="border-b border-gray-100 pb-3 last:border-0">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium">{{ task.type }}</p>
                <p class="text-xs text-gray-500">{{ task.node }} • {{ formatDate(task.starttime) }}</p>
              </div>
              <span :class="[
                'text-xs font-medium px-2 py-1 rounded',
                task.status === 'OK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]">
                {{ task.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import MetricCard from '@/components/MetricCard.vue';
import proxmoxApi from '@/services/proxmoxApi';

export default {
  name: 'Dashboard',
  components: {
    ArrowPathIcon,
    MetricCard
  },
  data() {
    return {
      selectedNode: '',
      isRefreshing: false,
      error: null,
      nodes: [],
      vms: [],
      containers: [],
      tasks: [],
      metrics: [
        {
          id: 'memory',
          title: 'MEMORY',
          value: '0 GB',
          total: '0 GB',
          percentage: 0,
          color: 'blue'
        },
        {
          id: 'cpu',
          title: 'CPU',
          value: '0',
          total: '0',
          percentage: 0,
          color: 'blue'
        },
        {
          id: 'storage',
          title: 'STORAGE',
          value: '0 GB',
          total: '0 GB',
          percentage: 0,
          color: 'blue'
        },
        {
          id: 'vms',
          title: 'VMs & CONTAINERS',
          value: '0',
          total: '0',
          percentage: 0,
          color: 'blue'
        }
      ]
    };
  },
  methods: {
    async refreshData() {
      this.isRefreshing = true;
      this.error = null;
      
      try {
        // Fetch nodes
        const nodesResponse = await proxmoxApi.getNodes();
        this.nodes = nodesResponse.data || [];
        
        // Fetch cluster resources
        const resourcesResponse = await proxmoxApi.getClusterResources();
        const resources = resourcesResponse.data || [];
        
        // Filter VMs and containers
        this.vms = resources.filter(r => r.type === 'qemu' && r.template !== 1);
        this.containers = resources.filter(r => r.type === 'lxc');
        
        // Calculate metrics
        this.calculateMetrics(resources);
        
        // Fetch recent tasks
        const tasksResponse = await proxmoxApi.getTasks(10);
        this.tasks = tasksResponse.data || [];
        
      } catch (error) {
        console.error('Failed to refresh data:', error);
        this.error = `Failed to fetch data: ${error.response?.data?.errors || error.message}`;
      } finally {
        this.isRefreshing = false;
      }
    },
    
    async fetchNodeData() {
      if (this.selectedNode) {
        // Fetch specific node data
        await this.refreshData();
      } else {
        // Fetch all nodes data
        await this.refreshData();
      }
    },
    
    calculateMetrics(resources) {
      // Calculate totals from nodes
      const nodes = resources.filter(r => r.type === 'node' && r.status === 'online');
      
      let totalMem = 0, usedMem = 0;
      let totalCpu = 0, usedCpu = 0;
      let totalDisk = 0, usedDisk = 0;
      
      nodes.forEach(node => {
        totalMem += node.maxmem || 0;
        usedMem += node.mem || 0;
        totalCpu += node.maxcpu || 0;
        usedCpu += (node.cpu || 0) * (node.maxcpu || 0);
        totalDisk += node.maxdisk || 0;
        usedDisk += node.disk || 0;
      });
      
      // Update memory metric
      this.metrics[0].value = this.formatBytes(usedMem);
      this.metrics[0].total = this.formatBytes(totalMem);
      this.metrics[0].percentage = totalMem > 0 ? (usedMem / totalMem * 100) : 0;
      
      // Update CPU metric
      this.metrics[1].value = usedCpu.toFixed(1);
      this.metrics[1].total = totalCpu.toString();
      this.metrics[1].percentage = totalCpu > 0 ? (usedCpu / totalCpu * 100) : 0;
      
      // Update storage metric
      this.metrics[2].value = this.formatBytes(usedDisk);
      this.metrics[2].total = this.formatBytes(totalDisk);
      this.metrics[2].percentage = totalDisk > 0 ? (usedDisk / totalDisk * 100) : 0;
      
      // Update VMs count
      const vmCount = this.vms.length + this.containers.length;
      const runningCount = [...this.vms, ...this.containers].filter(v => v.status === 'running').length;
      this.metrics[3].value = runningCount.toString();
      this.metrics[3].total = vmCount.toString();
      this.metrics[3].percentage = vmCount > 0 ? (runningCount / vmCount * 100) : 0;
    },
    
    formatBytes(bytes) {
      if (!bytes) return '0 B';
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    },
    
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp * 1000);
      return date.toLocaleString();
    }
  },
  mounted() {
    this.refreshData();
    
    // Auto-refresh every 30 seconds
    this.refreshInterval = setInterval(() => {
      this.refreshData();
    }, 30000);
  },
  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
};
</script>