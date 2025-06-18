<!-- src/components/MainLayout.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-md">
      <div class="p-4 border-b">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
            <span class="text-white font-bold text-sm">P</span>
          </div>
          <span class="font-semibold text-gray-800">Proxmox UI</span>
        </div>
      </div>
      
      <nav class="p-4 space-y-1">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          :class="['sidebar-item', { 'active': $route.path === item.path }]"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.name }}
        </router-link>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b">
        <div class="px-6 py-4 flex items-center justify-between">
          <h1 class="text-xl font-semibold text-gray-800">{{ pageTitle }}</h1>
          
          <div class="flex items-center space-x-4">
            <button @click="toggleView" class="p-2 hover:bg-gray-100 rounded">
              <component :is="viewIcon" class="w-5 h-5 text-gray-600" />
            </button>
            
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-medium">{{ userInitial }}</span>
              </div>
              <span class="text-sm text-gray-700">{{ username }}</span>
              <button @click="logout" class="text-sm text-gray-500 hover:text-gray-700">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { 
  HomeIcon,
  ServerIcon,
  CubeIcon,
  WifiIcon,
  PhotoIcon,
  CalendarIcon,
  FolderIcon,
  UserGroupIcon,
  KeyIcon,
  CogIcon,
  LifebuoyIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/vue/24/outline';
import proxmoxApi from '@/services/proxmoxApi';

export default {
  name: 'MainLayout',
  data() {
    return {
      viewMode: 'grid',
      menuItems: [
        { name: 'Dashboard', path: '/', icon: HomeIcon },
        { name: 'Compute', path: '/compute', icon: ServerIcon },
        { name: 'Storage', path: '/storage', icon: CubeIcon },
        { name: 'Network', path: '/network', icon: WifiIcon },
        { name: 'Images', path: '/images', icon: PhotoIcon },
        { name: 'Events', path: '/events', icon: CalendarIcon },
        { name: 'Projects', path: '/projects', icon: FolderIcon },
        { name: 'Accounts', path: '/accounts', icon: UserGroupIcon },
        { name: 'Domains', path: '/domains', icon: KeyIcon },
        { name: 'Roles', path: '/roles', icon: KeyIcon },
        { name: 'Infrastructure', path: '/infrastructure', icon: ServerIcon },
        { name: 'Offerings', path: '/offerings', icon: LifebuoyIcon },
        { name: 'Configuration', path: '/configuration', icon: CogIcon }
      ]
    };
  },
  computed: {
    pageTitle() {
      const currentRoute = this.$route.path;
      const item = this.menuItems.find(item => item.path === currentRoute);
      return item ? item.name : 'Dashboard';
    },
    username() {
      return localStorage.getItem('username') || 'admin';
    },
    userInitial() {
      return this.username.charAt(0).toUpperCase();
    },
    viewIcon() {
      return this.viewMode === 'grid' ? ListBulletIcon : Squares2X2Icon;
    }
  },
  methods: {
    toggleView() {
      this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
      this.$emit('view-changed', this.viewMode);
    },
    logout() {
      proxmoxApi.logout();
      this.$router.push('/login');
    }
  }
};
</script>