<template>
  <span class="month-badge" :class="cardType">{{ icon }} {{ label }}</span>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({ cardType: { type: String, default: "bronze" }, label: { type: String, default: "" } });
const icon = computed(() => props.cardType === "ouro" ? "🥇" : props.cardType === "prata" ? "🥈" : "🥉");
</script>
