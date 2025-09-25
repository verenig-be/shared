<template>
  <div class="field__outer">
    <div class="field__wrapper">
      <label class="field__label" :for="uid">{{ label }}</label>
      <div class="field__inner">
        <input 
          :type="type" 
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
      <div v-if="error" class="field__message field__message--error" :id="`${uid}-message`">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUid } from '../composables/useUid';

interface Props {
  modelValue?: string
  label?: string
  type?: string
  placeholder?: string
  help?: string
  error?: string
  required?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false
})

const uid = useUid('field');
</script>

<style></style>
