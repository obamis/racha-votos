<template>
  <div class="card">
    <div class="section-lbl">Votantes ({{ votersList.length }})</div>
    <div v-if="!votersList.length" class="empty" style="padding:1rem 0;">Nenhum voto ainda.</div>
    <div v-for="v in votersList" :key="v.name" class="voter-row">
      <span class="voter-name">{{ v.name }}</span>
      <span class="voter-count">{{ v.count }}/{{ v.total }}</span>
      <div class="voter-bar-wrap"><div class="voter-bar-fill" :style="{ width: pct(v) + '%' }"></div></div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, watch } from "vue";
import { useVotesStore } from "@/stores/votes";
const props = defineProps({ players: { type: Array, default: () => [] } });
const votesStore = useVotesStore();
const { votersList } = votesStore;
onMounted(() => votesStore.fetchVotersList(props.players));
watch(() => props.players, (pl) => votesStore.fetchVotersList(pl));
function pct(v) { return v.total > 0 ? Math.round((v.count / v.total) * 100) : 0; }
</script>
