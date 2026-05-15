<template>
  <div class="sum-list">
    <div v-for="(r, i) in ranked" :key="r.player_id" class="sum-row" :class="{ active: r.player_id === selectedId }" @click="emit('select', r.player_id)">
      <div class="sum-rank" :class="rankClass(r.card_type, i)">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}` }}</div>
      <div class="sum-info"><div class="sum-name">{{ r.player_name }}</div><div class="sum-pos">{{ r.player_position }}</div></div>
      <div class="sum-score" :class="r.card_type || 'bronze'">{{ votesStore.avgToScore(r.overall_score) ?? '—' }}</div>
    </div>
  </div>
</template>
<script setup>
defineProps({ ranked: { type: Array, default: () => [] }, selectedId: { type: String, default: null }, votesStore: { type: Object, required: true } });
const emit = defineEmits(["select"]);
function rankClass(cardType, i) { return i < 3 ? cardType || "bronze" : "other"; }
</script>
