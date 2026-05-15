<template>
  <div class="screen">
    <div class="hdr"><h1>Histórico</h1><p>Evolução dos jogadores mês a mês</p></div>
    <div class="player-select">
      <select v-model="selectedId" class="inp">
        <option value="">Selecione um jogador</option>
        <option v-for="p in players" :key="p.id" :value="p.id">{{ p.name }} ({{ p.position }})</option>
      </select>
    </div>
    <div v-if="loading" class="empty">Carregando histórico…</div>
    <div v-else-if="history.length">
      <EvolutionChart :data="history" />
      <div class="history-list">
        <div v-for="month in history" :key="month.month_ref" class="history-row">
          <MonthBadge :card-type="month.card_type" :label="month.month_label" />
          <div class="history-score">{{ month.overall_score?.toFixed(1) }}</div>
          <div class="history-rank">#{{ month.rank_position }}</div>
        </div>
      </div>
    </div>
    <div v-else-if="selectedId" class="empty">Sem histórico ainda.</div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { usePlayersStore } from "@/stores/players";
import { useVotesStore } from "@/stores/votes";
import EvolutionChart from "@/components/history/EvolutionChart.vue";
import MonthBadge from "@/components/history/MonthBadge.vue";

const playersStore = usePlayersStore();
const votesStore = useVotesStore();
const selectedId = ref("");
const history = ref([]);
const loading = ref(false);
const players = ref([]);

onMounted(async () => { if (!playersStore.players.length) await playersStore.fetchPlayers(); players.value = playersStore.players; });
watch(selectedId, async (id) => {
  if (!id) { history.value = []; return; }
  loading.value = true;
  history.value = await votesStore.getPlayerEvolution(id);
  loading.value = false;
});
</script>
