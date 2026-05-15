import { createRouter, createWebHistory } from "vue-router";
import { useSessionStore } from "@/stores/session";

const routes = [
  { path: "/", name: "setup", component: () => import("@/views/SetupView.vue") },
  { path: "/vote", name: "vote", component: () => import("@/views/VoteView.vue"), meta: { requiresName: true } },
  { path: "/results", name: "results", component: () => import("@/views/ResultsView.vue"), meta: { requiresName: true } },
  { path: "/history", name: "history", component: () => import("@/views/HistoryView.vue"), meta: { requiresName: true } },
  { path: "/admin", name: "admin", component: () => import("@/views/AdminView.vue"), meta: { requiresAdmin: true } },
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to, from, next) => {
  const session = useSessionStore();
  if (to.meta.requiresName && !session.voterName) return next("/");
  if (to.meta.requiresAdmin && !session.isAdmin) return next("/");
  next();
});

export default router;
