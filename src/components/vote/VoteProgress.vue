<template>
  <div class="vote-progress">
    <div class="vp-bar-wrap"><div class="vp-bar-fill" :style="{ width: pct + '%' }"></div></div>
    <span class="vp-text">{{ done }}/{{ total }} avaliados</span>
  </div>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({ done: { type: Number, default: 0 }, total: { type: Number, default: 0 } });
const pct = computed(() => (props.total > 0 ? (props.done / props.total) * 100 : 0));
</script>
