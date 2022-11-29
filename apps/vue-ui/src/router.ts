import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from './pages/Home.vue';
import Login from './pages/Login.vue';
import { useAuthStore } from './stores/auth.store';

export const RouteNames = {
  Home: 'home',
  Login: 'login',
};

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: RouteNames.Home,
    component: Home,
  },
  {
    path: '/login',
    name: RouteNames.Login,
    component: Login,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated && to.name !== RouteNames.Login) {
    if (authStore.hasRefreshToken) {
      try {
        await authStore.refresh();
        return to;
      } catch (err) {
        // unable to refresh, go to login (fall-thru)
      }
    }

    return { name: RouteNames.Login };
  }
});
