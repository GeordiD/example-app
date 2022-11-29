<script setup lang="ts">
import { computed, Ref } from 'vue';

export interface ButtonStateProps {
  isLoading: boolean;
  isError: boolean;
}

const props = defineProps<{
  buttonState?: ButtonStateProps;
  icon?: string;
  loading?: boolean;
  type: string;
}>();

const nonErrorTypeClass = computed(() => {
  switch (props.type) {
    case 'primary':
      return 'btn-primary';
    case 'secondary':
      return 'btn-secondary';
    case 'warning':
      return 'btn-warning';
    case 'error':
      return 'btn-error';
    default:
      return '';
  }
});

const typeClass = computed(() =>
  props.buttonState?.isError ? 'btn-error' : nonErrorTypeClass.value
);
</script>

<template>
  <button
    class="btn"
    :class="[
      typeClass,
      { loading: props.loading || props.buttonState?.isLoading },
    ]"
  >
    <img v-if="props.icon" :src="props.icon" :alt="props.icon" />
    <slot></slot>
  </button>
</template>
