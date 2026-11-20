export const TONES = { human: "Natural & human", funny: "Funny", inspiring: "Inspiring", threatening: "Threatening", dramatic: "Dramatic", sarcastic: "Sarcastic", empathetic: "Warm & empathetic", authoritative: "Authoritative" };
export const FREE_LIMIT = 5;
export async function rewrite(text, tone) {
  const style = tone === "human" ? "Keep the original tone, just make it sound naturally human." : `Rewrite it in a ${TONES[tone].toLowerCase()} tone.`;
  const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST",
    headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6", max_tokens: 4000,
      system: "You are an editor who turns AI-sounding scripts into writing that sounds like a real creator speaking. Vary sentence length, use contractions and spoken rhythm, cut filler and cliches ('delve', 'in today's world', 'game-changer'), avoid tidy triplets and em-dash overuse. Keep the facts, structure and approximate length. Output only the rewritten script.",
      messages: [{ role: "user", content: `${style}\n\nSCRIPT:\n${text}` }] }) });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error?.message || "AI request failed");
  return d.content.map(c => c.text || "").join("").trim();
}
