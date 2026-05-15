import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "@/supabase";

export const usePlayersStore = defineStore("players", () => {
  const players = ref([]);
  const loading = ref(false);

  async function fetchPlayers() {
    loading.value = true;
    const { data, error } = await supabase
      .from("players")
      .select("id, name, position, photo")
      .eq("is_active", true)
      .order("name");
    if (error) throw error;
    players.value = data || [];
    loading.value = false;
  }

  async function addPlayer(name, position, photo = null) {
    const { data, error } = await supabase
      .from("players")
      .insert({ name, position, photo, is_active: true })
      .select()
      .single();
    if (error) throw error;
    players.value.push(data);
    return data;
  }

  async function updatePhoto(playerId, photoBase64) {
    const { error } = await supabase
      .from("players")
      .update({ photo: photoBase64, updated_at: new Date().toISOString() })
      .eq("id", playerId);
    if (error) throw error;
    const p = players.value.find((p) => p.id === playerId);
    if (p) p.photo = photoBase64;
  }

  async function removePlayer(playerId) {
    const { error } = await supabase
      .from("players")
      .update({ is_active: false })
      .eq("id", playerId);
    if (error) throw error;
    players.value = players.value.filter((p) => p.id !== playerId);
  }

  return { players, loading, fetchPlayers, addPlayer, updatePhoto, removePlayer };
});
