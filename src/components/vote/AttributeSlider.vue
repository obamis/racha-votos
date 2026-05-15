<template>
  <div class="attr-slider">
    <div class="as-head"><span class="as-label">{{ label }}</span><span class="as-value">{{ modelValue }}</span></div>
    <input type="range" min="0" max="10" step="0.5" :value="modelValue" @input="emit('update:modelValue', Number($event.target.value))" />
  </div>
</template>
<script setup>
defineProps({ label: { type: String, required: true }, modelValue: { type: Number, default: 5 } });
const emit = defineEmits(["update:modelValue"]);
</script>
