<template>
  <div class="field__outer">
    <div class="field__wrapper">
      <label class="field__label" :for="uid">{{ label }}</label>
      <div class="field__inner">
        <input
          type="text"
          :name="name"
          class="field__input"
          :id="uid"
          :placeholder="placeholder"
          :required="required"
          :disabled="disabled"
          :aria-describedby="`${uid}-help ${uid}-message`"
          :value="modelValue"
        />
      </div>
      <p v-if="help" class="field__help" :id="`${uid}-help`">{{ help }}</p>
    </div>
    <div class="field__messages">
      <div
        v-for="error in errors"
        :key="error"
        class="field__message field__message--error"
        :id="`${uid}-message`"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUid } from '../composables';

const modelValue = defineModel();

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  help?: string;
  errors?: string[];
  required?: boolean;
  disabled?: boolean;
}

const {
  name,
  label,
  placeholder = '',
  help = '',
  errors = [],
  required = false,
  disabled = false,
} = defineProps<Props>();

const uid = useUid('field');
</script>

<style></style>
