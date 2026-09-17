import { GoogleGenAI, Type } from "@google/genai";
import { GATES, FACILITIES, STADIUM } from "../utils/stadiumConfig.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = "gemini-3.1-flash-lite";

// Shared context injected into every prompt so the model reasons about
// THIS stadium's layout rather than hallucinating a generic one.
function stadiumContext() {
  return `
Stadium: ${STADIUM.name} (capacity ${STADIUM.capacity}).
Gates: ${GATES.map((g) => `${g.name} [id:${g.id}]${g.accessible ? " (wheelchair accessible)" : ""}`).join("; ")}.
Facilities: ${FACILITIES.map((f) => `${f.name} [${f.type}, near ${f.nearGate}]`).join("; ")}.
`.trim();
}

/**
 * Fan-facing assistant: navigation, accessibility, general Q&A.
 * Auto-detects and responds in the fan's language.
 */
export async function getWayfindingAnswer({ question, crowdSnapshot }) {
  const crowdLine = crowdSnapshot
    ? `Current live gate congestion (0-100 scale): ${crowdSnapshot
        .map((c) => `${c.gateId}=${c.level}`)
        .join(", ")}.`
    : "";

  const prompt = `
You are FanPulse, a friendly stadium assistant for a FIFA World Cup 2026 host venue.
${stadiumContext()}
${crowdLine}

Rules:
- Reply in the SAME language the fan used to ask.
- Keep answers short (2-4 sentences), practical, and specific to a named gate/facility.
- If the fan seems to need accessibility support, proactively mention the nearest accessible option.
- If a gate is congested (level > 70), gently suggest a less busy alternative gate for the same side of the stadium.
- Never invent gates or facilities that weren't listed above.

Fan's question: "${question}"
`.trim();

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  return response.text;
}

/**
 * Ops intelligence: turns raw crowd numbers into structured, actionable alerts
 * for the volunteer/organizer dashboard.
 */
export async function analyzeCrowdSnapshot(crowdSnapshot) {
  const prompt = `
You are an operations intelligence engine for ${STADIUM.name} during a FIFA World Cup 2026 match.
${stadiumContext()}

Live gate congestion snapshot (0-100 scale, >70 = risk of bottleneck):
${crowdSnapshot.map((c) => `${c.gateId}: ${c.level}`).join("\n")}

Analyze this snapshot and produce operational alerts. For each gate at risk, suggest a concrete action
(e.g. reroute fans to a named nearby gate, deploy additional staff, open an overflow lane).
Only flag gates that genuinely need attention (level > 65). If nothing needs attention, return an empty alerts array.
`.trim();

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          alerts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                gateId: { type: Type.STRING },
                severity: { type: Type.STRING, enum: ["watch", "warning", "critical"] },
                message: { type: Type.STRING },
                suggestedAction: { type: Type.STRING },
              },
              required: ["gateId", "severity", "message", "suggestedAction"],
            },
          },
          overallStatus: {
            type: Type.STRING,
            enum: ["normal", "elevated", "critical"],
          },
        },
        required: ["alerts", "overallStatus"],
      },
    },
  });

  return JSON.parse(response.text);
}

/**
 * Natural-language ops summary for a shift-change briefing or a volunteer
 * asking "what's the status right now?" in the dashboard chat.
 */
export async function generateOpsSummary({ crowdSnapshot, recentIncidents }) {
  const prompt = `
You are briefing an incoming shift of stadium volunteers at ${STADIUM.name}.
Current gate congestion: ${crowdSnapshot.map((c) => `${c.gateId}=${c.level}`).join(", ")}.
Recent incidents: ${recentIncidents?.length ? recentIncidents.map((i) => i.description).join("; ") : "none reported"}.

Write a concise 3-4 sentence briefing a volunteer coordinator could read aloud at a shift handover.
Prioritize anything urgent first.
`.trim();

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  return response.text;
}
