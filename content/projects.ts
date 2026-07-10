import type { Project } from "@/content/types";

/**
 * Every project. Adding one is a single object here — no component changes.
 * Because this array is checked with `satisfies Project[]`, omitting a required
 * field fails the build.
 *
 * `angles` reframes the same project per entry point: the AI page shows a
 * project's `angles.ai` framing, the security page its `angles.security`, and
 * so on. `primaryAngle` is where the project leads.
 *
 * Dates and a few specifics are marked `// TODO: verify` — audit before launch.
 */
export const projects: Project[] = [
  {
    slug: "hermes",
    name: "Hermes",
    period: { en: "2024 — present", fr: "2024 — présent" }, // TODO: verify
    role: {
      en: "Solo — architecture & implementation",
      fr: "Solo — architecture & implémentation",
    },
    tagline: {
      en: "A local-first AI assistant orchestrator.",
      fr: "Un orchestrateur d'assistant IA local-first.",
    },
    summary: {
      en: "Qwen 2.5 14B running locally on an RX 7900 XTX via ROCm (~63 tok/s), with Claude Haiku as a cloud fallback. A FastAPI backend exposes REST and WebSocket; a modular tool registry keeps capabilities composable; a hands-free voice pipeline runs as systemd user services.",
      fr: "Qwen 2.5 14B en local sur une RX 7900 XTX via ROCm (~63 tok/s), avec Claude Haiku en repli cloud. Un backend FastAPI expose REST et WebSocket ; un registre d'outils modulaire garde les capacités composables ; un pipeline vocal mains-libres tourne en services systemd.",
    },
    stack: [
      "Qwen 2.5 14B",
      "ROCm",
      "Claude Haiku",
      "FastAPI",
      "WebSocket",
      "faster-whisper",
      "Piper TTS",
      "openWakeWord",
      "systemd",
    ],
    facts: [
      {
        label: { en: "~63 tok/s local", fr: "~63 tok/s en local" }, // TODO: verify
        detail: {
          en: "Qwen 2.5 14B on an RX 7900 XTX via ROCm — Claude Haiku only as fallback.",
          fr: "Qwen 2.5 14B sur RX 7900 XTX via ROCm — Claude Haiku seulement en repli.",
        },
      },
      {
        label: { en: "Hands-free voice", fr: "Voix mains-libres" },
        detail: {
          en: "openWakeWord → faster-whisper (FR) → LLM → Piper TTS, as systemd services.",
          fr: "openWakeWord → faster-whisper (FR) → LLM → Piper TTS, en services systemd.",
        },
      },
      {
        label: { en: "NFC automation", fr: "Automatisation NFC" },
        detail: {
          en: "A /trigger endpoint with an intent table separating direct from contextual intents.",
          fr: "Un endpoint /trigger et une table d'intentions séparant direct et contextuel.",
        },
      },
      {
        label: { en: "The 95% rule", fr: "La règle des 95 %" },
        detail: {
          en: "Three or four workflows at 95% reliability before any fifth exists.",
          fr: "Trois ou quatre workflows à 95 % de fiabilité avant d'en ajouter un cinquième.",
        },
      },
    ],
    primaryAngle: "ai",
    angles: {
      ai: {
        headline: {
          en: "Local-first LLM orchestration with a cloud fallback",
          fr: "Orchestration LLM local-first avec repli cloud",
        },
        summary: {
          en: "Qwen 2.5 14B on consumer ROCm hardware at ~63 tok/s, Claude Haiku as fallback, a modular tool registry, and an intent routing table that separates direct from contextual intents.",
          fr: "Qwen 2.5 14B sur matériel ROCm grand public à ~63 tok/s, Claude Haiku en repli, un registre d'outils modulaire et une table de routage d'intentions qui sépare intentions directes et contextuelles.",
        },
        stack: ["Qwen 2.5 14B", "ROCm", "Claude Haiku", "tool registry"],
      },
      engineering: {
        headline: {
          en: "A reliable voice pipeline, running as systemd services",
          fr: "Un pipeline vocal fiable, en services systemd",
        },
        summary: {
          en: "openWakeWord → faster-whisper → LLM → Piper TTS, hands-free as systemd user services, with NFC-triggered automation via a /trigger endpoint. Design principle: 95% reliability on three or four workflows before adding a fifth.",
          fr: "openWakeWord → faster-whisper → LLM → Piper TTS, mains-libres en services systemd, avec automatisation déclenchée par NFC via un endpoint /trigger. Principe : 95 % de fiabilité sur trois ou quatre workflows avant d'en ajouter un cinquième.",
        },
        stack: ["FastAPI", "WebSocket", "systemd", "Piper TTS"],
      },
    },
    links: [],
    isPrivate: true,
    hasWriteup: true,
  },
  {
    slug: "vybe",
    name: "Vybe",
    period: { en: "2026 — present", fr: "2026 — présent" }, // TODO: verify
    role: { en: "Lead developer", fr: "Lead developer" },
    tagline: {
      en: "A creator-economy platform for the French market.",
      fr: "Une plateforme creator-economy pour le marché français.",
    },
    summary: {
      en: "A Next.js 14 App Router front end, a Fastify + WebSocket backend, PostgreSQL via Supabase with Prisma, Stripe Connect Express for payouts, and Cloudflare R2 for media — built by a three-person team, treated as in-development.",
      fr: "Un front Next.js 14 App Router, un backend Fastify + WebSocket, PostgreSQL via Supabase avec Prisma, Stripe Connect Express pour les paiements et Cloudflare R2 pour les médias — construit par une équipe de trois, en cours de développement.",
    },
    stack: [
      "Next.js 14",
      "TypeScript",
      "Fastify",
      "WebSocket",
      "PostgreSQL",
      "Supabase",
      "Prisma",
      "Stripe Connect",
      "Cloudflare R2",
    ],
    facts: [
      {
        label: { en: "Real money moves", fr: "De l'argent réel circule" },
        detail: {
          en: "Stripe Connect Express handles creator payouts — payments-grade from day one.",
          fr: "Stripe Connect Express gère les paiements créateurs — niveau paiement dès le départ.",
        },
      },
      {
        label: { en: "Realtime backbone", fr: "Colonne temps réel" },
        detail: {
          en: "Fastify + WebSockets over Supabase Postgres with Prisma.",
          fr: "Fastify + WebSockets sur Postgres Supabase avec Prisma.",
        },
      },
      {
        label: { en: "Three people", fr: "Trois personnes" },
        detail: {
          en: "Whole platform built by a three-person team — architecture chosen to stay maintainable.",
          fr: "Toute la plateforme construite à trois — architecture pensée pour rester maintenable.",
        },
      },
      {
        label: { en: "Security before launch", fr: "Sécurité avant lancement" },
        detail: {
          en: "Threat modelling on the payment and media paths before any public user exists.",
          fr: "Modélisation des menaces sur paiement et médias avant le premier utilisateur public.",
        },
      },
    ],
    primaryAngle: "engineering",
    angles: {
      engineering: {
        headline: {
          en: "A payments-grade platform built by three people",
          fr: "Une plateforme prête pour les paiements, à trois",
        },
        summary: {
          en: "Stripe Connect Express for creator payouts, Cloudflare R2 for media, Prisma over Supabase Postgres, and a Fastify + WebSocket backend — architected to stay small-team maintainable.",
          fr: "Stripe Connect Express pour les paiements aux créateurs, Cloudflare R2 pour les médias, Prisma sur Postgres Supabase et un backend Fastify + WebSocket — pensé pour rester maintenable en petite équipe.",
        },
        stack: ["Fastify", "Stripe Connect", "Prisma", "Cloudflare R2"],
      },
      ai: {
        headline: {
          en: "An in-product AI assistant and content ranking",
          fr: "Un assistant IA intégré et un classement de contenu",
        },
        summary: {
          en: "Designing the in-product AI assistant and the content-ranking logic that shapes what creators and audiences see.",
          fr: "Conception de l'assistant IA intégré et de la logique de classement de contenu qui façonne ce que voient créateurs et audiences.",
        },
        stack: ["LLM orchestration", "content ranking"],
      },
      security: {
        headline: {
          en: "Security posture, set before launch",
          fr: "Posture de sécurité, définie avant lancement",
        },
        summary: {
          en: "Leading the pre-launch security posture for a platform that will move money and host user media — threat modelling the payment and storage paths first.",
          fr: "Pilotage de la posture de sécurité avant lancement pour une plateforme qui déplacera de l'argent et hébergera des médias — modélisation des menaces sur les flux de paiement et de stockage en priorité.",
        },
        stack: ["threat modelling", "Stripe Connect", "Cloudflare R2"],
      },
    },
    links: [],
    isPrivate: true,
    hasWriteup: true,
  },
  {
    slug: "notion-mcp-pipeline",
    name: "Notion / MCP pipeline",
    period: { en: "2025 — present", fr: "2025 — présent" }, // TODO: verify
    role: { en: "Solo", fr: "Solo" },
    tagline: {
      en: "An agent engineering pipeline running across six projects.",
      fr: "Un pipeline d'ingénierie agentique déployé sur six projets.",
    },
    summary: {
      en: "Claude Code integrated with Notion and the GitHub MCP server, with a custom command suite for task intake, implementation, ripple-effect verification, and status sync. The interesting part is a queue-table pattern — a deliberate schema constraint that eliminated a class of agent failures in property filtering.",
      fr: "Claude Code intégré à Notion et au serveur MCP GitHub, avec une suite de commandes sur mesure pour la prise en charge des tâches, l'implémentation, la vérification des effets de bord et la synchronisation des statuts. Le point intéressant : un motif de table-file — une contrainte de schéma délibérée qui a éliminé une classe d'échecs d'agent sur le filtrage de propriétés.",
    },
    stack: ["Claude Code", "Notion API", "GitHub MCP", "MCP"],
    facts: [
      {
        label: { en: "6 active projects", fr: "6 projets actifs" },
        detail: {
          en: "One pipeline runs task intake, implementation and status sync across all of them.",
          fr: "Un seul pipeline gère prise en charge, implémentation et synchro de statut partout.",
        },
      },
      {
        label: { en: "Queue-table pattern", fr: "Motif table-file" },
        detail: {
          en: "A deliberate schema constraint that eliminated a class of agent filtering failures.",
          fr: "Une contrainte de schéma délibérée qui a éliminé une classe d'échecs de filtrage.",
        },
      },
      {
        label: { en: "Ripple-effect checks", fr: "Vérification d'effets de bord" },
        detail: {
          en: "Every change is checked for knock-on effects before the status ever flips.",
          fr: "Chaque changement est vérifié pour ses effets en cascade avant tout changement de statut.",
        },
      },
      {
        label: { en: "Custom command suite", fr: "Suite de commandes sur mesure" },
        detail: {
          en: "Claude Code wired to Notion and the GitHub MCP server, end to end.",
          fr: "Claude Code branché à Notion et au serveur MCP GitHub, de bout en bout.",
        },
      },
    ],
    primaryAngle: "ai",
    angles: {
      ai: {
        headline: {
          en: "Agent workflows that hold up across six projects",
          fr: "Des workflows agentiques qui tiennent sur six projets",
        },
        summary: {
          en: "A queue-table pattern — a deliberate schema constraint — removed a whole class of agent failures in property filtering, making the pipeline reliable enough to run daily across six active projects.",
          fr: "Un motif de table-file — une contrainte de schéma délibérée — a supprimé toute une classe d'échecs d'agent sur le filtrage de propriétés, rendant le pipeline assez fiable pour tourner chaque jour sur six projets actifs.",
        },
        stack: ["MCP", "Claude Code", "queue-table pattern"],
      },
      engineering: {
        headline: {
          en: "A command suite from intake to merge",
          fr: "Une suite de commandes, de la prise en charge au merge",
        },
        summary: {
          en: "Task intake, implementation, ripple-effect verification, and status sync as composable commands wired into Notion and GitHub.",
          fr: "Prise en charge des tâches, implémentation, vérification des effets de bord et synchronisation des statuts, en commandes composables branchées sur Notion et GitHub.",
        },
        stack: ["Notion API", "GitHub MCP"],
      },
    },
    links: [],
    isPrivate: true,
    hasWriteup: true,
  },
  {
    slug: "hybrid-network",
    name: "Hybrid network infrastructure",
    period: { en: "2025", fr: "2025" }, // TODO: verify
    role: {
      en: "Academic project — security track",
      fr: "Projet académique — filière sécurité",
    },
    tagline: {
      en: "A segmented two-site network architecture.",
      fr: "Une architecture réseau segmentée sur deux sites.",
    },
    summary: {
      en: "A two-site design with Proxmox, pfSense, a site-to-site VPN, DMZ segmentation, a bastion host, NetBox for documentation, and Elasticsearch for logging — prototyped under nested KVM.",
      fr: "Une conception deux sites avec Proxmox, pfSense, un VPN site-à-site, une segmentation DMZ, un hôte bastion, NetBox pour la documentation et Elasticsearch pour les logs — prototypée sous KVM imbriqué.",
    },
    stack: [
      "Proxmox",
      "pfSense",
      "site-to-site VPN",
      "DMZ",
      "bastion host",
      "NetBox",
      "Elasticsearch",
      "KVM",
    ],
    facts: [
      {
        label: { en: "Two sites, one VPN", fr: "Deux sites, un VPN" },
        detail: {
          en: "Site-to-site VPN between two pfSense edges carries all inter-site traffic.",
          fr: "Un VPN site-à-site entre deux pfSense transporte tout le trafic inter-sites.",
        },
      },
      {
        label: { en: "DMZ + bastion", fr: "DMZ + bastion" },
        detail: {
          en: "Segmentation and a bastion host enforce a hard trust boundary.",
          fr: "Segmentation et hôte bastion imposent une frontière de confiance stricte.",
        },
      },
      {
        label: { en: "Nested KVM lab", fr: "Lab KVM imbriqué" },
        detail: {
          en: "The whole topology prototyped virtually — no physical second site needed.",
          fr: "Toute la topologie prototypée en virtuel — aucun second site physique requis.",
        },
      },
      {
        label: { en: "Documented & observable", fr: "Documenté & observable" },
        detail: {
          en: "NetBox as source of truth, Elasticsearch for the logs.",
          fr: "NetBox comme source de vérité, Elasticsearch pour les logs.",
        },
      },
    ],
    primaryAngle: "security",
    angles: {
      security: {
        headline: {
          en: "Segmentation, a DMZ, and a bastion",
          fr: "Segmentation, une DMZ et un bastion",
        },
        summary: {
          en: "DMZ segmentation and a bastion host enforce a clear trust boundary between sites, with pfSense at the edge and a site-to-site VPN carrying inter-site traffic.",
          fr: "La segmentation DMZ et un hôte bastion imposent une frontière de confiance nette entre les sites, avec pfSense en bordure et un VPN site-à-site pour le trafic inter-sites.",
        },
        stack: ["pfSense", "DMZ", "bastion host", "site-to-site VPN"],
      },
      engineering: {
        headline: {
          en: "A full two-site lab under nested virtualisation",
          fr: "Un lab deux sites complet sous virtualisation imbriquée",
        },
        summary: {
          en: "The whole topology prototyped under nested KVM on Proxmox, documented in NetBox and observable through Elasticsearch — reproducible without any physical second site.",
          fr: "Toute la topologie prototypée sous KVM imbriqué sur Proxmox, documentée dans NetBox et observable via Elasticsearch — reproductible sans aucun second site physique.",
        },
        stack: ["Proxmox", "KVM", "NetBox", "Elasticsearch"],
      },
    },
    links: [],
    isPrivate: false,
    hasWriteup: true,
  },
  {
    slug: "ski-theatre-scheduling",
    name: "Ski & theatre scheduling platform",
    period: { en: "2025 — present", fr: "2025 — présent" }, // TODO: verify
    role: {
      en: "Principal engineer — apprenticeship, 2C2L",
      fr: "Ingénieur principal — alternance, 2C2L",
    },
    tagline: {
      en: "A live migration of a scheduling platform for ~30 schools.",
      fr: "La migration en production d'une plateforme de planification pour ~30 écoles.",
    },
    summary: {
      en: "Migrating a legacy Django scheduling platform to Vue 3 / Quasar while designing the backing API — for around thirty ski and theatre schools. The constraint that shapes everything: the legacy system stays live throughout.",
      fr: "Migration d'une plateforme de planification Django legacy vers Vue 3 / Quasar tout en concevant l'API sous-jacente — pour une trentaine d'écoles de ski et de théâtre. La contrainte qui façonne tout : le système legacy reste en production pendant toute la migration.",
    },
    stack: ["Vue 3", "Quasar", "Django", "REST API", "PostgreSQL"],
    facts: [
      {
        label: { en: "~30 schools live", fr: "~30 écoles en production" }, // TODO: verify
        detail: {
          en: "Ski and theatre schools keep planning daily while the migration happens under them.",
          fr: "Les écoles de ski et de théâtre planifient chaque jour pendant la migration.",
        },
      },
      {
        label: { en: "Zero downtime", fr: "Zéro interruption" },
        detail: {
          en: "The legacy Django system stays live throughout — the constraint that shapes everything.",
          fr: "Le legacy Django reste en production tout du long — la contrainte qui façonne tout.",
        },
      },
      {
        label: { en: "Strangler-fig migration", fr: "Migration strangler-fig" },
        detail: {
          en: "Vue 3 / Quasar replaces the legacy screen by screen, cutover by cutover.",
          fr: "Vue 3 / Quasar remplace le legacy écran par écran, bascule par bascule.",
        },
      },
      {
        label: { en: "New API design", fr: "Nouvelle API" },
        detail: {
          en: "The backing API is redesigned alongside, not ported as-is.",
          fr: "L'API sous-jacente est repensée en parallèle, pas portée telle quelle.",
        },
      },
    ],
    primaryAngle: "engineering",
    angles: {
      engineering: {
        headline: {
          en: "Migrating without downtime, 30 schools live",
          fr: "Migrer sans interruption, 30 écoles en production",
        },
        summary: {
          en: "A strangler-fig migration off legacy Django to a Vue 3 / Quasar front end and a freshly designed API, cutting over incrementally while ~30 schools keep running in production.",
          fr: "Une migration en strangler-fig depuis Django legacy vers un front Vue 3 / Quasar et une API repensée, avec bascule incrémentale pendant qu'une trentaine d'écoles restent en production.",
        },
        stack: ["Vue 3", "Quasar", "Django", "REST API"],
      },
    },
    links: [],
    isPrivate: false,
    hasWriteup: true,
  },
];

/** Slugs in display order — the manifest that drives /work/[slug] routing. */
export const PROJECT_SLUGS = projects.map((project) => project.slug);

/** Projects that support a given angle, in display order. */
export function projectsForAngle(angle: Project["primaryAngle"]) {
  return projects.filter((project) => angle in project.angles);
}
