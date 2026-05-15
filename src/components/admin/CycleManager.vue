<template>
  <div class="card">
    <div class="section-lbl">Ciclo Mensal</div>
    <div class="cycle-status">
      <div class="cycle-dot" :class="cyclesStore.activeCycle ? 'active' : 'none'"></div>
      <div>
        <div class="cycle-label">{{ cyclesStore.activeCycle ? cyclesStore.activeCycle.label : 'Nenhum ciclo ativo' }}</div>
        <div v-if="cyclesStore.activeCycle" class="cycle-sub">Aberto em {{ formatDate(cyclesStore.activeCycle.opened_at) }}</div>
      </div>
    </div>
    <div style="display:flex;gap:.5rem;margin-top:.75rem;">
      <button v-if="!cyclesStore.activeCycle" class="btn-primary" :disabled="loading" @click="open">{{ loading ? 'Abrindo…' : '▶ Abrir novo ciclo' }}</button>
      <button v-else class="btn-danger" :disabled="loading" @click="close">{{ loading ? 'Fechando…' : '⏹ Fechar ciclo' }}</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useCyclesStore } from "@/stores/cycles";
import { useToast } from "@/composables/useToast";
const cyclesStore = useCyclesStore();
const { toast } = useToast();
const loading = ref(false);
async function open() { loading.value = true; try { await cyclesStore.openNewCycle(); toast("✔ Ciclo aberto!"); } catch (e) { toast("Erro: " + e.message); } finally { loading.value = false; } }
async function close() {
  if (!confirm("Fechar o ciclo? Os votos serão consolidados no histórico.")) return;
  loading.value = true; try { await cyclesStore.closeCycle(); toast("✔ Ciclo fechado e consolidado!"); } catch (e) { toast("Erro: " + e.message); } finally { loading.value = false; }
}
function formatDate(dt) { if (!dt) return ""; return new Date(dt).toLocaleDateString("pt-BR"); }
</script>
