<template>
  <nav class="nav-bar">
    <RouterLink to="/vote" class="nav-item" :class="{ active: route.name === 'vote' }"><span class="nav-icon">🗳️</span><span>Votar</span></RouterLink>
    <RouterLink to="/results" class="nav-item" :class="{ active: route.name === 'results' }"><span class="nav-icon">📊</span><span>Resultado</span></RouterLink>
    <RouterLink to="/history" class="nav-item" :class="{ active: route.name === 'history' }"><span class="nav-icon">📈</span><span>Histórico</span></RouterLink>
  </nav>
</template>
<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
</script>
