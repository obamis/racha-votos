<template>
  <div class="detail-card" :class="cardClass">
    <div class="dc-top">
      <div class="dc-avatar">
        <img v-if="result.player_photo" :src="result.player_photo" :alt="result.player_name" />
        <span v-else class="initials">{{ initials }}</span>
      </div>
      <div class="dc-meta">
        <div class="dc-name">{{ result.player_name }}</div>
        <div class="dc-pos">{{ result.player_position }}</div>
        <div class="dc-score">{{ score }}</div>
        <div class="dc-score-lbl">MÉDIA GERAL</div>
        <div class="dc-votes">{{ result.total_votes || 0 }} voto(s)</div>
      </div>
    </div>
    <div class="dc-attrs">
      <div v-for="attr in attrs" :key="attr.key" class="dc-attr">
        <div class="dc-attr-val">{{ fmt(result[attr.key]) }}</div>
        <div class="dc-attr-lbl">{{ attr.label }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({ result: { type: Object, required: true }, votesStore: { type: Object, required: true } });
const attrs = [
  { key: "avg_fisico", label: "Físico" }, { key: "avg_passe", label: "Passe" },
  { key: "avg_drible", label: "Drible" }, { key: "avg_dominio", label: "Domínio" },
  { key: "avg_chute", label: "Chute" }, { key: "avg_marcacao", label: "Marcação" },
];
const cardClass = computed(() => props.result.card_type || "bronze");
const score = computed(() => props.votesStore.avgToScore(props.result.overall_score) ?? "—");
const initials = computed(() => { const parts = (props.result.player_name || "??").trim().split(" "); return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2); });
function fmt(v) { return v != null ? Number(v).toFixed(1) : "—"; }
</script>
