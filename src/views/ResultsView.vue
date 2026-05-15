<template>
  <div class="screen">
    <div class="results-hdr">
      <span class="results-title">Resultados</span>
      <span class="voters-badge">{{ maxVotes }} votante(s)</span>
    </div>
    <ShareBar v-if="maxVotes >= threshold" :total-voters="maxVotes" :ranked="votesStore.rankedResults" />
    <DetailCard v-if="detailPlayer" :result="detailPlayer" :votes-store="votesStore" />
    <SummaryList :ranked="votesStore.rankedResults" :selected-id="detailPlayerId" :votes-store="votesStore" @select="detailPlayerId = $event" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useVotesStore } from "@/stores/votes";
import DetailCard from "@/components/results/DetailCard.vue";
import SummaryList from "@/components/results/SummaryList.vue";
import ShareBar from "@/components/results/ShareBar.vue";

const votesStore = useVotesStore();
const detailPlayerId = ref(null);
const threshold = Number(import.meta.env.VITE_VOTE_THRESHOLD || 12);
const maxVotes = computed(() => Math.max(0, ...votesStore.rankedResults.map((r) => r.total_votes || 0)));
const detailPlayer = computed(() => votesStore.rankedResults.find((r) => r.player_id === detailPlayerId.value) || votesStore.rankedResults[0]);

onMounted(async () => {
  await votesStore.fetchLiveResults();
  votesStore.startRealtime();
  if (votesStore.rankedResults.length) detailPlayerId.value = votesStore.rankedResults[0].player_id;
});
onUnmounted(() => votesStore.stopRealtime());
</script>
