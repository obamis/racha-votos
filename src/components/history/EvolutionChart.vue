<template>
  <div class="evo-chart card">
    <div class="section-lbl">Evolução — Overall</div>
    <svg :viewBox="`0 0 ${W} ${H}`" width="100%" :height="H">
      <line v-for="y in gridYs" :key="y" x1="0" :y1="yScale(y)" :x2="W" :y2="yScale(y)" stroke="rgba(255,255,255,.07)" stroke-width="1" />
      <path :d="areaPath" fill="url(#grad)" opacity=".35" />
      <path :d="linePath" fill="none" stroke="#7986cb" stroke-width="2.5" stroke-linejoin="round" />
      <circle v-for="(pt, i) in points" :key="i" :cx="pt.x" :cy="pt.y" r="5" fill="#7986cb" stroke="#0f1117" stroke-width="2" />
      <text v-for="(pt, i) in points" :key="'lbl'+i" :x="pt.x" :y="pt.y - 10" text-anchor="middle" font-size="11" fill="#aaa">{{ pt.score }}</text>
      <text v-for="(pt, i) in points" :key="'xl'+i" :x="pt.x" :y="H - 4" text-anchor="middle" font-size="9" fill="#666">{{ pt.month }}</text>
      <defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7986cb" /><stop offset="100%" stop-color="#7986cb" stop-opacity="0" /></linearGradient></defs>
    </svg>
  </div>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({ data: { type: Array, default: () => [] } });
const W = 380, H = 160, PAD = { l: 16, r: 16, t: 20, b: 24 };
const gridYs = [0, 2.5, 5, 7.5, 10];
function yScale(v) { return PAD.t + (1 - v / 10) * (H - PAD.t - PAD.b); }
const points = computed(() => {
  const n = props.data.length;
  if (!n) return [];
  return props.data.map((d, i) => ({ x: PAD.l + (i / Math.max(n - 1, 1)) * (W - PAD.l - PAD.r), y: yScale(d.overall_score || 0), score: Number(d.overall_score || 0).toFixed(1), month: (d.month_label || "").slice(0, 3) }));
});
const linePath = computed(() => { if (!points.value.length) return ""; return points.value.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" "); });
const areaPath = computed(() => {
  if (!points.value.length) return "";
  const pts = points.value, bottom = H - PAD.b;
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + ` L${pts[pts.length-1].x},${bottom} L${pts[0].x},${bottom} Z`;
});
</script>
