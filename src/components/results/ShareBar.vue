<template>
  <div class="share-bar">
    <button class="btn-wa" @click="shareWA">📲 WhatsApp</button>
    <button class="btn-export" @click="exportPNG">📥 Exportar PNG</button>
  </div>
</template>
<script setup>
import { useWhatsApp } from "@/composables/useWhatsApp";
import { useExport } from "@/composables/useExport";
const props = defineProps({ ranked: { type: Array, default: () => [] }, totalVoters: { type: Number, default: 0 } });
const { share } = useWhatsApp();
const { exportReport } = useExport();
function shareWA() { share(props.ranked, props.totalVoters); }
function exportPNG() { exportReport(props.ranked, props.totalVoters); }
</script>
