import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { trpc } from '../trpc-client';

export const useAuthStore = defineStore('auth', () => {
  const token = ref('');
  watch(token, () => {
    localStorage.setItem('token', token.value);
  });

  const refreshToken = ref(window.localStorage.getItem('refresh-token') ?? '');
  watch(refreshToken, () => {
    localStorage.setItem('refresh-token', refreshToken.value);
  });

  const isAuthenticated = computed(() => !!token.value);
  const hasRefreshToken = computed(() => !!refreshToken.value);

  async function login(email: string, password: string) {
    const response = await trpc.users.login.query({ email, password });

    token.value = response.token;
    refreshToken.value = response.token;
    // todo set user
  }

  async function refresh() {
    const response = await trpc.users.refresh.query(refreshToken.value);

    token.value = response.token;
    // todo set user
  }

  return {
    isAuthenticated,
    hasRefreshToken,
    login,
    refresh,
    token,
  };
});
