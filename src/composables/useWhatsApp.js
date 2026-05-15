import { useVotesStore } from "@/stores/votes";

export function useWhatsApp() {
  function share(rankedResults, totalVoters) {
    const votesStore = useVotesStore();
    const medals = ["🥇", "🥈", "🥉"];
    const starsFn = (n) => "⭐".repeat(n) + "☆".repeat(5 - n);
    const lines = rankedResults.map(({ player_name, player_position, overall_score }, i) => {
      if (!overall_score) return `${i + 1}. ${player_name} (${player_position}) — sem votos`;
      const sc = votesStore.avgToScore(overall_score);
      const s = votesStore.toStars(overall_score);
      return `${medals[i] || `${i + 1}.`} *${player_name}* (${player_position}) — ${sc}pts ${starsFn(s)}`;
    }).join("\n");
    const msg = `⚽ *Resultado do Racha!*\n📊 ${totalVoters} votante(s)\n\n${lines}\n\n_Avalie: ${window.location.origin}_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  }
  return { share };
}
