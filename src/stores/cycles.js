import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "@/supabase";

export const useCyclesStore = defineStore("cycles", () => {
  const activeCycle = ref(null);
  const allCycles = ref([]);

  async function fetchActiveCycle() {
    const { data } = await supabase
      .from("evaluation_cycles")
      .select("id, label, month_ref, opened_at")
      .eq("status", "active")
      .maybeSingle();
    activeCycle.value = data;
    return data;
  }

  async function fetchAllCycles() {
    const { data } = await supabase
      .from("evaluation_cycles")
      .select("id, label, month_ref, status, opened_at, closed_at")
      .order("opened_at", { ascending: false });
    allCycles.value = data || [];
  }

  async function openNewCycle() {
    const { data, error } = await supabase.rpc("open_evaluation_cycle");
    if (error) throw error;
    await fetchActiveCycle();
    await fetchAllCycles();
    return data;
  }

  async function closeCycle() {
    if (!activeCycle.value) throw new Error("Nenhum ciclo ativo");
    const { data, error } = await supabase.rpc("close_evaluation_cycle", {
      p_cycle_id: activeCycle.value.id,
    });
    if (error) throw error;
    activeCycle.value = null;
    await fetchAllCycles();
    return data;
  }

  return { activeCycle, allCycles, fetchActiveCycle, fetchAllCycles, openNewCycle, closeCycle };
});
