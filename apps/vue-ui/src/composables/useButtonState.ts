import { Ref, ref } from 'vue';

export interface ButtonState {
  isLoading: Ref<boolean>;
  isError: Ref<boolean>;
  onClick: (
    action: () => Promise<any>,
    callback?: () => void,
    onError?: ((err: unknown) => void) | undefined
  ) => Promise<void>;
}

export function useButtonState(): ButtonState {
  const isLoading = ref(false);
  const isError = ref(false);

  async function onClick(
    action: () => Promise<any>,
    callback?: () => void,
    onError?: (err: unknown) => void
  ) {
    try {
      isLoading.value = true;
      isError.value = false;

      await action();

      if (callback) callback();
    } catch (err) {
      isError.value = true;
      if (onError) onError(err);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    isError,
    onClick,
  } as ButtonState;
}
