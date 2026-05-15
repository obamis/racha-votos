<template>
  <div class="player-row" :class="{ voted: isVoted }">
    <div class="pr-head">
      <PlayerAvatar :player="player" :size="44" />
      <div>
        <div class="pr-name">{{ player.name }}</div>
        <div class="pr-pos">{{ player.position }}</div>
      </div>
      <span v-if="isVoted" style="margin-left:auto;color:var(--success);font-size:.85rem;">✓ avaliado</span>
    </div>

    <AttributeSlider
      v-for="attr in attrs"
      :key="attr.key"
      :label="attr.label"
      :model-value="myVotes?.[attr.key] ?? 5"
      @update:model-value="(v) => emit('update-vote', attr.key, v)"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import PlayerAvatar from "./PlayerAvatar.vue";
import AttributeSlider from "@/components/vote/AttributeSlider.vue";

const props = defineProps({
  player: { type: Object, required: true },
  myVotes: { type: Object, default: null },
});
const emit = defineEmits(["update-vote"]);

const attrs = computed(() => {
  if (props.player.position === "GOL") {
    return [
      { key: "fisico",   label: "⚡ Físico" },
      { key: "passe",    label: "🦶 Jogo com os Pés" },
      { key: "drible",   label: "🧤 Reflexo" },
      { key: "dominio",  label: "👁 Visão de Jogo" },
      { key: "chute",    label: "🔥 Motivação" },
      { key: "marcacao", label: "🙏 Fé" },
    ];
  }
  return [
    { key: "fisico",   label: "⚡ Físico" },
    { key: "passe",    label: "🎯 Passe" },
    { key: "drible",   label: "💫 Drible" },
    { key: "dominio",  label: "👟 Domínio" },
    { key: "chute",    label: "🔫 Chute" },
    { key: "marcacao", label: "🛡 Marcação" },
  ];
});

const ATTR_KEYS = ["fisico", "passe", "drible", "dominio", "chute", "marcacao"];

const isVoted = computed(
  () => props.myVotes && ATTR_KEYS.every((k) => props.myVotes[k] != null),
);
</script>
