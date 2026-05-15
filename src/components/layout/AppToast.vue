<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="visible" class="toast">{{ message }}</div>
    </Transition>
  </Teleport>
</template>
<script setup>
import { useToast } from "@/composables/useToast";
const { message, visible } = useToast();
</script>
