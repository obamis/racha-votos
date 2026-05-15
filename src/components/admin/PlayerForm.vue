<template>
  <div class="card">
    <div class="section-lbl">Adicionar Jogador</div>
    <input v-model="name" class="inp" type="text" placeholder="Nome do jogador" maxlength="50" />
    <select v-model="position" class="inp">
      <option value="">Posição</option>
      <option v-for="p in positions" :key="p" :value="p">{{ p }}</option>
    </select>
    <div v-if="photoPreview" style="margin-bottom:.75rem;text-align:center;">
      <img :src="photoPreview" style="width:80px;height:80px;border-radius:50%;object-fit:cover;" />
    </div>
    <label class="btn-ghost" style="cursor:pointer;text-align:center;display:block;">
      📷 Selecionar foto
      <input type="file" accept="image/*" style="display:none" @change="pickPhoto" />
    </label>
    <button class="btn-primary" :disabled="!name.trim() || !position || loading" @click="add">{{ loading ? 'Salvando…' : '+ Adicionar' }}</button>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { usePlayersStore } from "@/stores/players";
import { useImageResize } from "@/composables/useImageResize";
import { useToast } from "@/composables/useToast";
const emit = defineEmits(["added"]);
const playersStore = usePlayersStore();
const { resizeImage } = useImageResize();
const { toast } = useToast();
const name = ref(""), position = ref(""), photoBase64 = ref(null), photoPreview = ref(null), loading = ref(false);
const positions = ["GOL", "ZAG", "LAT", "VOL", "MEI", "ATA", "PNT"];
async function pickPhoto(e) { const file = e.target.files[0]; if (!file) return; photoBase64.value = await resizeImage(file, 400); photoPreview.value = photoBase64.value; }
async function add() {
  loading.value = true;
  try { await playersStore.addPlayer(name.value.trim(), position.value, photoBase64.value); toast("✔ Jogador adicionado!"); name.value = ""; position.value = ""; photoBase64.value = null; photoPreview.value = null; emit("added"); }
  catch (e) { toast("Erro: " + e.message); } finally { loading.value = false; }
}
</script>
