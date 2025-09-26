import { getCurrentInstance, ref } from 'vue';

export function useUid(prefix: string = '', postfix: string = '') {
  const instance = getCurrentInstance();
  if (!instance) {
    console.warn('Must be called from inside a setup function');

    const random = Math.random().toString(36).slice(2, 9);
    return ref(
      (prefix ? `${prefix}-` : '') + random + (postfix ? `-${postfix}` : ''),
    );
  }
  const uuid = ref(
    (prefix ? `${prefix}-` : '') +
      instance.uid +
      (postfix ? `-${postfix}` : ''),
  );

  return uuid;
}
