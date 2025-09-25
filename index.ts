import Field from './vue/components/Field.vue';
import { useUid } from './vue/composables/useUid';

export default {
  composables: {
    useUid,
  },
  components: {
    Field,
  },
};

export { Field };
