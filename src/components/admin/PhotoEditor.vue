<template>
  <label style="cursor:pointer;" title="Trocar foto">
    <span style="font-size:.85rem;color:var(--text-muted);">📷</span>
    <input type="file" accept="image/*" style="display:none" @change="change" />
  </label>
</template>
<script setup>
import { usePlayersStore } from "@/stores/players";
import { useImageResize } from "@/composables/useImageResize";
import { useToast } from "@/composables/useToast";
const props = defineProps({ player: { type: Object, required: true } });
const emit = defineEmits(["updated"]);
const playersStore = usePlayersStore();
const { resizeImage } = useImageResize();
const { toast } = useToast();
async function change(e) {
  const file = e.target.files[0]; if (!file) return;
  try { const b64 = await resizeImage(file, 400); await playersStore.updatePhoto(props.player.id, b64); toast("✔ Foto atualizada!"); emit("updated"); }
  catch (err) { toast("Erro ao salvar foto: " + err.message); }
}
</script>
