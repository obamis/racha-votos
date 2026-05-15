import { defineStore } from "pinia";
import { ref } from "vue";

export const useSessionStore = defineStore("session", () => {
  const voterName = ref(localStorage.getItem("voterName") || "");
  const isAdmin = ref(false);

  function setVoterName(name) {
    voterName.value = name;
    localStorage.setItem("voterName", name);
  }

  function setAdmin(val) {
    isAdmin.value = val;
  }

  function logout() {
    voterName.value = "";
    isAdmin.value = false;
    localStorage.removeItem("voterName");
  }

  return { voterName, isAdmin, setVoterName, setAdmin, logout };
});
