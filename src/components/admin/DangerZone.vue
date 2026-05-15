<template>
  <div class="card" style="border-color:rgba(239,83,80,.3);">
    <div class="section-lbl" style="color:var(--danger);">⚠ Zona de Perigo</div>
    <div style="margin-bottom:1rem;">
      <div style="font-size:.9rem;margin-bottom:.5rem;">Apagar todos os votos do ciclo ativo</div>
      <button class="btn-danger btn-sm" :disabled="resetting" @click="reset">{{ resetting ? 'Apagando…' : '🗑 Reset votos' }}</button>
    </div>
    <div>
      <div style="font-size:.9rem;margin-bottom:.5rem;">Modo Boost JCDEZ — nota 10 em tudo</div>
      <select v-model="boostPlayerId" class="inp" style="margin-bottom:.5rem;">
        <option value="">Selecionar jogador</option>
        <option v-for="p in players" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>
      <div style="display:flex;gap:.5rem;">
        <button class="btn-primary btn-sm" style="width:auto;flex:1;" :disabled="!boostPlayerId || boosting" @click="applyBoost">🚀 Boost</button>
        <button class="btn-ghost btn-sm" style="flex:1;" :disabled="!boostPlayerId || boosting" @click="undoBoost">↩ Desfazer</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { useVotesStore } from "@/stores/votes";
import { useToast } from "@/composables/useToast";
const props = defineProps({ players: { type: Array, default: () => [] } });
const votesStore = useVotesStore();
const { toast } = useToast();
const resetting = ref(false), boosting = ref(false), boostPlayerId = ref("");
const boostPlayer = computed(() => props.players.find((p) => p.id === boostPlayerId.value));
async function reset() { if (!confirm("Apagar TODOS os votos do ciclo ativo?")) return; resetting.value = true; try { await votesStore.resetVotes(); toast("✔ Votos apagados!"); } catch (e) { toast("Erro: " + e.message); } finally { resetting.value = false; } }
async function applyBoost() { if (!boostPlayer.value) return; boosting.value = true; try { await votesStore.applyBoost(boostPlayer.value); toast(`🚀 Boost aplicado para ${boostPlayer.value.name}!`); } catch (e) { toast("Erro: " + e.message); } finally { boosting.value = false; } }
async function undoBoost() { if (!boostPlayer.value) return; boosting.value = true; try { await votesStore.removeBoost(boostPlayer.value); toast(`↩ Boost removido de ${boostPlayer.value.name}`); } catch (e) { toast("Erro: " + e.message); } finally { boosting.value = false; } }
</script>
