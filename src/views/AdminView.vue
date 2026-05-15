<template>
  <div class="screen">
    <div class="hdr"><div class="hdr-badge">🔒 Admin</div><h1>Gerenciar</h1></div>
    <CycleManager />
    <PlayerForm @added="playersStore.fetchPlayers()" />
    <div class="card">
      <div class="section-lbl">Jogadores cadastrados</div>
      <div v-for="p in players" :key="p.id" class="adm-row">
        <PlayerAvatar :player="p" size="40" />
        <div class="adm-info"><div class="adm-name">{{ p.name }}</div><div class="adm-pos">{{ p.position }}</div></div>
        <PhotoEditor :player="p" @updated="playersStore.fetchPlayers()" />
        <button class="adm-del" @click="remove(p)">✕</button>
      </div>
    </div>
    <VotersList :players="players" />
    <DangerZone :players="players" />
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { usePlayersStore } from "@/stores/players";
import { useCyclesStore } from "@/stores/cycles";
import CycleManager from "@/components/admin/CycleManager.vue";
import PlayerForm from "@/components/admin/PlayerForm.vue";
import PhotoEditor from "@/components/admin/PhotoEditor.vue";
import VotersList from "@/components/admin/VotersList.vue";
import DangerZone from "@/components/admin/DangerZone.vue";
import PlayerAvatar from "@/components/players/PlayerAvatar.vue";

const playersStore = usePlayersStore();
const cyclesStore = useCyclesStore();
const players = computed(() => playersStore.players);

onMounted(async () => { await Promise.all([playersStore.fetchPlayers(), cyclesStore.fetchActiveCycle(), cyclesStore.fetchAllCycles()]); });
async function remove(player) { if (!confirm(`Remover ${player.name}?`)) return; await playersStore.removePlayer(player.id); }
</script>
