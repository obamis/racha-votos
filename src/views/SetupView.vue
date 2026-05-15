<template>
  <div class="screen">
    <div class="hdr">
      <div class="hdr-badge">⚽ Racha da Galera</div>
      <h1>Votação do Horário</h1>
      <p>Avalie os jogadores do grupo</p>
    </div>
    <div class="card">
      <div class="section-lbl">Seu nome</div>
      <input v-model="name" class="inp" type="text" placeholder="Ex: João Silva" maxlength="30" @keydown.enter="enter" />
      <button class="btn-primary" :disabled="!name.trim()" @click="enter">ENTRAR E VOTAR</button>
      <button class="btn-ghost" @click="goResults">📊 Ver resultados</button>
    </div>
    <div style="text-align:center;margin-top:1.5rem;">
      <button class="btn-link" @click="openAdmin">🔒 Área do Admin</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSessionStore } from "@/stores/session";
import { usePlayersStore } from "@/stores/players";
import { useCyclesStore } from "@/stores/cycles";
import { useVotesStore } from "@/stores/votes";

const router = useRouter();
const session = useSessionStore();
const playersStore = usePlayersStore();
const cyclesStore = useCyclesStore();
const votesStore = useVotesStore();
const name = ref(session.voterName || "");

onMounted(async () => {
  await Promise.all([playersStore.fetchPlayers(), cyclesStore.fetchActiveCycle()]);
  votesStore.startRealtime();
  await votesStore.fetchLiveResults();
});

async function enter() {
  if (!name.value.trim()) return;
  session.setVoterName(name.value.trim());
  router.push("/vote");
}
function goResults() { router.push("/results"); }
function openAdmin() {
  const pass = prompt("Senha do admin:");
  if (pass === import.meta.env.VITE_ADMIN_PASS) {
    session.setAdmin(true); router.push("/admin");
  } else if (pass !== null) { alert("Senha incorreta."); }
}
</script>
