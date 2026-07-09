import type { Angle, SkillGroup } from "@/content/types";

/**
 * Capabilities, grouped. Each skill is tagged with the angles it supports, so
 * angle pages can filter to what's relevant. Checked with
 * `satisfies SkillGroup[]` — a missing field fails the build.
 */
export const skillGroups = [
  {
    category: { en: "Front-end", fr: "Front-end" },
    angles: ["engineering", "ai"],
    items: [
      { name: "React", angles: ["engineering", "ai"] },
      { name: "Next.js", angles: ["engineering", "ai"] },
      { name: "Vue 3", angles: ["engineering"] },
      { name: "Quasar", angles: ["engineering"] },
      { name: "TypeScript", angles: ["engineering", "ai"] },
      { name: "Tailwind", angles: ["engineering"] },
      { name: "Flutter", angles: ["engineering"] },
    ],
  },
  {
    category: { en: "Back-end", fr: "Back-end" },
    angles: ["engineering", "ai"],
    items: [
      { name: "Node.js", angles: ["engineering"] },
      { name: "Fastify", angles: ["engineering"] },
      { name: "Python", angles: ["engineering", "ai"] },
      { name: "FastAPI", angles: ["engineering", "ai"] },
      { name: "Django", angles: ["engineering"] },
      { name: "PostgreSQL", angles: ["engineering"] },
      { name: "Prisma", angles: ["engineering"] },
      { name: "Supabase", angles: ["engineering"] },
    ],
  },
  {
    category: { en: "AI", fr: "IA" },
    angles: ["ai"],
    items: [
      { name: "LLM orchestration", angles: ["ai"] },
      { name: "Local inference (Ollama / ROCm)", angles: ["ai"] },
      { name: "Tool routing", angles: ["ai"] },
      { name: "RAG", angles: ["ai"] },
      { name: "MCP", angles: ["ai", "engineering"] },
      { name: "Anthropic API", angles: ["ai"] },
      { name: "Agent workflows", angles: ["ai"] },
    ],
  },
  {
    category: { en: "Security", fr: "Sécurité" },
    angles: ["security"],
    items: [
      { name: "Network segmentation", angles: ["security"] },
      { name: "pfSense", angles: ["security"] },
      { name: "VPN", angles: ["security"] },
      { name: "Threat modelling", angles: ["security"] },
      { name: "MITRE ATT&CK", angles: ["security"] },
      { name: "YARA / Sigma", angles: ["security"] },
    ],
  },
  {
    category: { en: "Infrastructure", fr: "Infrastructure" },
    angles: ["engineering", "security"],
    items: [
      { name: "Docker", angles: ["engineering", "security"] },
      { name: "Proxmox", angles: ["security", "engineering"] },
      { name: "KVM", angles: ["security"] },
      { name: "systemd", angles: ["engineering"] },
      { name: "Linux", angles: ["engineering", "security"] },
      { name: "Tailscale", angles: ["engineering", "security"] },
      { name: "Vercel", angles: ["engineering"] },
      { name: "Cloudflare R2", angles: ["engineering"] },
    ],
  },
] satisfies SkillGroup[];

/** Skill groups that contain at least one skill supporting the given angle. */
export function skillsForAngle(angle: Angle): SkillGroup[] {
  return skillGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((skill) => skill.angles.some((a) => a === angle)),
    }))
    .filter((group) => group.items.length > 0);
}
