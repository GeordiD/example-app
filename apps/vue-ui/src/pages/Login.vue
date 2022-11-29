<script setup lang="ts">
import { useButtonState } from '@/composables/useButtonState';
import { useAuthStore } from '@/stores/auth.store';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/common/Button.vue';
import { RouteNames } from '@/router';

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  email: ref(''),
  password: ref(''),
});

const loginButton = ref(useButtonState());

const onClick = async () => {
  loginButton.value.onClick(
    async () => await authStore.login(form.email, form.password),
    () => router.push({ name: RouteNames.Home })
  );
};
</script>

<template>
  <div class="flex flex-grow items-center justify-center">
    <div class="border-2 border-black rounded p-4 flex flex-col gap-4 w-2/3">
      <h2 class="text-lg font-semibold">Login</h2>
      <div class="form-control">
        <label class="label">
          <span>Email</span>
        </label>
        <input
          v-model="form.email"
          type="text"
          placeholder="info@site.com"
          class="input input-bordered"
        />
      </div>
      <div class="form-control">
        <label class="label">
          <span>Password</span>
        </label>
        <input
          v-model="form.password"
          type="password"
          placeholder="********"
          class="input input-bordered"
        />
      </div>
      <Button :button-state="loginButton" type="primary" @click="onClick"
        >login</Button
      >
    </div>
  </div>
</template>
