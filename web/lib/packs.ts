// Single source of truth for prices. Never trust prices sent from the browser.
export const PACKS = [
  { id: "basic", name: "Basic", desc: "Best for personal use.", priceCents: 1000, credits: 100, cta: "Get started" },
  { id: "advanced", name: "Advanced", desc: "Best for business use.", priceCents: 5000, credits: 500, cta: "Get started" },
  { id: "business", name: "Business", desc: "Best for enterprise use.", priceCents: 25000, credits: 5000, cta: "Purchase" },
] as const;

export type Pack = (typeof PACKS)[number];

export function getPack(id: unknown): Pack | undefined {
  return PACKS.find((p) => p.id === id);
}

