import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/supabase";
import { useCyclesStore } from "./cycles";

const ATTRS = ["fisico", "passe", "drible", "dominio", "chute", "marcacao"];

export const useVotesStore = defineStore("votes", () => {
  const liveResults = ref([]);
  const myVotes = ref({});
  const votersList = ref([]);
  let realtimeSub = null;

  const totalVoters = computed(() =>
    liveResults.value.reduce((max, r) => Math.max(max, r.total_votes || 0), 0)
  );

  function avgToScore(avg) { return avg != null ? Math.round(avg * 10) / 10 : null; }
  function toStars(avg) { return avg != null ? Math.round((avg / 10) * 5) : 0; }
  function cardType(avg) { return avg >= 7 ? "ouro" : avg >= 5 ? "prata" : "bronze"; }

  const rankedResults = computed(() =>
    [...liveResults.value].sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0))
  );

  async function fetchLiveResults() {
    const { data, error } = await supabase.rpc("get_active_cycle_results");
    if (error) throw error;
    liveResults.value = data || [];
  }

  function startRealtime() {
    stopRealtime();
    realtimeSub = supabase.channel("votes-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "votes" }, () => fetchLiveResults())
      .subscribe();
  }

  function stopRealtime() {
    if (realtimeSub) { supabase.removeChannel(realtimeSub); realtimeSub = null; }
  }

  function setMyVote(playerId, attr, value) {
    if (!myVotes.value[playerId]) myVotes.value[playerId] = {};
    myVotes.value[playerId][attr] = Number(value);
  }

  function isFullyVoted(players) {
    return players.every((p) => { const v = myVotes.value[p.id]; return v && ATTRS.every((a) => v[a] != null); });
  }

  async function submitVotes(voterName, players) {
    const cyclesStore = useCyclesStore();
    if (!cyclesStore.activeCycle) throw new Error("Nenhum ciclo ativo");
    const rows = players.filter((p) => myVotes.value[p.id]).map((p) => ({
      cycle_id: cyclesStore.activeCycle.id, player_id: p.id, voter_name: voterName, ...myVotes.value[p.id],
    }));
    const { error } = await supabase.from("votes").upsert(rows, { onConflict: "cycle_id,player_id,voter_name" });
    if (error) throw error;
    await fetchLiveResults();
  }

  async function checkIfVoted(voterName) {
    const { data } = await supabase.rpc("has_voted", { p_voter_name: voterName });
    return data;
  }

  async function fetchVotersList(players) {
    const cyclesStore = useCyclesStore();
    if (!cyclesStore.activeCycle) { votersList.value = []; return; }
    const { data } = await supabase.from("votes").select("voter_name, player_id").eq("cycle_id", cyclesStore.activeCycle.id);
    const map = {};
    (data || []).forEach((v) => { if (!map[v.voter_name]) map[v.voter_name] = new Set(); map[v.voter_name].add(v.player_id); });
    votersList.value = Object.entries(map).map(([name, pids]) => ({ name, count: pids.size, total: players.length })).sort((a, b) => b.count - a.count);
  }

  async function resetVotes() {
    const cyclesStore = useCyclesStore();
    if (!cyclesStore.activeCycle) return;
    const { error } = await supabase.from("votes").delete().eq("cycle_id", cyclesStore.activeCycle.id);
    if (error) throw error;
    liveResults.value = []; votersList.value = [];
  }

  async function applyBoost(player) {
    const cyclesStore = useCyclesStore();
    if (!cyclesStore.activeCycle) throw new Error("Nenhum ciclo ativo");
    const row = { cycle_id: cyclesStore.activeCycle.id, player_id: player.id, voter_name: "admin_boost", fisico: 10, passe: 10, drible: 10, dominio: 10, chute: 10, marcacao: 10 };
    const { error } = await supabase.from("votes").upsert(row, { onConflict: "cycle_id,player_id,voter_name" });
    if (error) throw error;
    await fetchLiveResults();
  }

  async function removeBoost(player) {
    const cyclesStore = useCyclesStore();
    if (!cyclesStore.activeCycle) return;
    await supabase.from("votes").delete().eq("cycle_id", cyclesStore.activeCycle.id).eq("player_id", player.id).eq("voter_name", "admin_boost");
    await fetchLiveResults();
  }

  async function getPlayerEvolution(playerId) {
    const { data, error } = await supabase.rpc("get_player_evolution", { p_player_id: playerId });
    if (error) throw error;
    return data || [];
  }

  async function getAllTimeRanking() {
    const { data, error } = await supabase.rpc("get_all_time_ranking");
    if (error) throw error;
    return data || [];
  }

  return { liveResults, myVotes, votersList, rankedResults, totalVoters, avgToScore, toStars, cardType, fetchLiveResults, startRealtime, stopRealtime, setMyVote, isFullyVoted, submitVotes, checkIfVoted, fetchVotersList, resetVotes, applyBoost, removeBoost, getPlayerEvolution, getAllTimeRanking };
});
