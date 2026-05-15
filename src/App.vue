<template>
  <div id="app">
    <RouterView />
    <NavBar v-if="showNav" />
    <AppToast />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import NavBar from "@/components/layout/NavBar.vue";
import AppToast from "@/components/layout/AppToast.vue";

const route = useRoute();
const showNav = computed(() =>
  ["vote", "results", "history"].includes(route.name),
);
</script>
