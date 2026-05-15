<template>
  <div class="player-avatar" :style="{ width: size + 'px', height: size + 'px' }">
    <img v-if="player.photo" :src="player.photo" :alt="player.name" />
    <span v-else class="initials">{{ initials }}</span>
  </div>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({ player: { type: Object, required: true }, size: { type: [Number, String], default: 48 } });
const initials = computed(() => {
  const parts = props.player.name.trim().split(" ");
  return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2);
});
</script>
<style scoped>
.player-avatar { border-radius:50%; overflow:hidden; background:var(--surface2); border:2px solid var(--border); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.player-avatar img { width:100%; height:100%; object-fit:cover; }
.initials { font-family:'Bebas Neue',sans-serif; font-size:calc(v-bind(size)*0.4px); color:var(--text-muted); }
</style>
