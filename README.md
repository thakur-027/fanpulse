# FanPulse

A GenAI-enabled stadium companion for the FIFA World Cup 2026 — one shared AI layer serving
both fans and stadium staff.

## Problem it addresses

Large stadium events create two simultaneous challenges: fans need fast, multilingual help
navigating an unfamiliar venue (gates, accessibility, facilities), while organizers and
volunteers need real-time situational awareness to prevent bottlenecks and respond to
incidents. Most solutions treat these as separate products. FanPulse treats them as two
views onto the *same* live data and the *same* Gemini reasoning layer.

## What it does

**For fans** (`/`)
- Multilingual chat assistant for wayfinding, accessibility, and facility questions —
  answers automatically in whatever language the fan asks in
- Live stadium map with gates color-coded and "pulsing" by real-time congestion
- Assistant proactively suggests accessible alternatives and less-congested gates

**For volunteers/organizers** (`/ops`, authenticated)
- Scoreboard-style live ticker of all gate congestion levels
- AI-generated operational alerts: which gates are at risk, and what action to take
  (reroute, add staff, open overflow lane)
- Incident logging (medical, security, lost person, etc.) with live updates across the team
- One-click AI shift-handover briefing summarizing current conditions

## Architecture

```
fanpulse/
  server/   Express 5 + Socket.io + MongoDB + Gemini API
  client/   React 19 + Vite + Tailwind + Socket.io client
```

A crowd simulator (`crowdSimulator.service.js`) generates realistic per-gate congestion
data on a random-walk basis, with scripted surge windows (pre-kickoff rush, halftime rush)
to demonstrate how the system behaves under real match-day conditions — this stands in for
turnstile/CCTV feeds a real venue would provide.

Every ~12 seconds, the current crowd snapshot is sent to Gemini
(`gemini.service.js :: analyzeCrowdSnapshot`) which returns structured JSON alerts with
severity and suggested actions — broadcast live to the ops dashboard via Socket.io.

The fan chat assistant and the ops alerts/briefing both call the *same* Gemini service
module, just with different prompts and context — one AI brain, two interfaces.

## Running locally

**Prerequisites:** Node 18+, a MongoDB instance (local or Atlas), a Gemini API key.

```bash
# Backend
cd server
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm install
npm run seed            # creates demo organizer/volunteer accounts
npm run dev

# Frontend (separate terminal)
cd client
cp .env.example .env
npm install
npm run dev
```

Demo ops login (after seeding): `organizer@fanpulse.demo` / `password123`

## Notes on the demo data

`stadiumConfig.js` models a fictional "Continental Arena" with 8 gates and a handful of
facilities. To adapt this to a real host stadium, replace that file's gate/facility list
with the actual venue layout — nothing else needs to change, since the Gemini prompts pull
their context from that config at runtime.

## Possible next steps

- Real crowd data ingestion (turnstile counts, CCTV-based estimation) instead of simulation
- Transportation pillar: AI-suggested transit/parking routes factoring in live gate congestion
- Sustainability nudges tied to crowd data (e.g. bin-fill alerts near high-traffic zones)
- Push notifications to fans' phones when their planned gate becomes congested
- Multi-venue support for all 16 host stadiums
