<template>
  <div class="screen">
    <div class="hdr">
      <div class="hdr-badge">⚽ Avalie os jogadores</div>
      <h1>Votação</h1>
      <p>Arraste os sliders de 0 a 10 em cada atributo</p>
    </div>
    <VoteProgress :done="doneCount" :total="players.length" />
    <div v-if="!cyclesStore.activeCycle" class="empty">Nenhuma avaliação ativa no momento.</div>
    <div v-else>
      <PlayerRow v-for="player in players" :key="player.id" :player="player" :my-votes="votesStore.myVotes[player.id]" @update-vote="(attr, val) => votesStore.setMyVote(player.id, attr, val)" />
      <button class="btn-primary" :disabled="!canSubmit || submitting" @click="submit">
        {{ submitting ? 'Enviando…' : 'Enviar avaliações' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { usePlayersStore } from "@/stores/players";
import { useCyclesStore } from "@/stores/cycles";
import { useVotesStore } from "@/stores/votes";
import { useSessionStore } from "@/stores/session";
import { useToast } from "@/composables/useToast";
import PlayerRow from "@/components/players/PlayerRow.vue";
import VoteProgress from "@/components/vote/VoteProgress.vue";

const router = useRouter();
const playersStore = usePlayersStore();
const cyclesStore = useCyclesStore();
const votesStore = useVotesStore();
const session = useSessionStore();
const { toast } = useToast();
const submitting = ref(false);
const players = computed(() => playersStore.players);
const canSubmit = computed(() => votesStore.isFullyVoted(players.value));
const doneCount = computed(() => players.value.filter((p) => { const v = votesStore.myVotes[p.id]; return v && ["fisico","passe","drible","dominio","chute","marcacao"].every((a) => v[a] != null); }).length);

onMounted(async () => {
  if (!players.value.length) await playersStore.fetchPlayers();
  if (!cyclesStore.activeCycle) await cyclesStore.fetchActiveCycle();
});

async function submit() {
  submitting.value = true;
  try { await votesStore.submitVotes(session.voterName, players.value); toast("✔ Avaliações enviadas!"); router.push("/results"); }
  catch (e) { toast("Erro: " + e.message); }
  finally { submitting.value = false; }
}
</script>
