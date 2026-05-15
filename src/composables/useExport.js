import { useVotesStore } from "@/stores/votes";

export function useExport() {
  async function exportReport(rankedResults, totalVoters) {
    const votesStore = useVotesStore();
    const canvas = document.createElement("canvas");
    const W = 600, ROW_H = 60, HEADER_H = 100;
    canvas.width = W;
    canvas.height = HEADER_H + rankedResults.length * ROW_H + 40;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0f1117"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f5c518"; ctx.font = "bold 32px 'Barlow Condensed', sans-serif"; ctx.textAlign = "center";
    ctx.fillText("⚽ RESULTADO DO RACHA", W / 2, 45);
    ctx.fillStyle = "#aaa"; ctx.font = "18px Barlow, sans-serif";
    ctx.fillText(`${totalVoters} votante(s)`, W / 2, 75);
    ctx.strokeStyle = "#f5c518"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(20, 90); ctx.lineTo(W - 20, 90); ctx.stroke();
    for (let i = 0; i < rankedResults.length; i++) {
      const r = rankedResults[i];
      const y = HEADER_H + i * ROW_H;
      const cardColor = r.card_type === "ouro" ? "#f5c518" : r.card_type === "prata" ? "#c0c0c0" : "#cd7f32";
      ctx.fillStyle = i % 2 === 0 ? "#1a1d2e" : "#151722"; ctx.fillRect(0, y, W, ROW_H);
      ctx.fillStyle = cardColor; ctx.font = "bold 22px 'Barlow Condensed', sans-serif"; ctx.textAlign = "left";
      ctx.fillText(`#${i + 1}`, 16, y + 38);
      ctx.fillStyle = "#fff"; ctx.font = "bold 20px 'Barlow Condensed', sans-serif";
      ctx.fillText(r.player_name || "—", 60, y + 38);
      ctx.fillStyle = "#888"; ctx.font = "14px Barlow, sans-serif";
      ctx.fillText(r.player_position || "", 60, y + 54);
      const score = votesStore.avgToScore(r.overall_score);
      ctx.fillStyle = cardColor; ctx.font = "bold 26px 'Bebas Neue', sans-serif"; ctx.textAlign = "right";
      ctx.fillText(score != null ? score : "—", W - 16, y + 42);
    }
    const link = document.createElement("a");
    link.download = `racha-resultado-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL("image/png"); link.click();
  }
  return { exportReport };
}
