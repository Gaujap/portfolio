import type { Localized } from "@/lib/i18n";

/**
 * About-page copy: trajectory, not autobiography. Kept short and editable.
 */
export const about: { intro: Localized[] } = {
  intro: [
    {
      en: "I'm a full-stack developer in Lyon, France, finishing an MSc in Computer Science with a cybersecurity / cloud specialisation at Epitech (2027). I care about systems that hold up in production — the reliability, not the demo.",
      fr: "Je suis développeur full-stack à Lyon, en train de finir un master d'informatique avec spécialisation cybersécurité / cloud à Epitech (2027). Ce qui m'intéresse, ce sont les systèmes qui tiennent en production — la fiabilité, pas la démo.",
    },
    {
      en: "Today I lead development at Winway on Vybe, a creator-economy platform, while running the migration of a live scheduling platform for around thirty schools as an apprentice at 2C2L. On the side, I run GDT — web work for local institutions and AI consulting for SMEs — and build Hermes, a local-first AI assistant.",
      fr: "Aujourd'hui je pilote le développement chez Winway sur Vybe, une plateforme creator-economy, tout en menant la migration d'une plateforme de planification en production pour une trentaine d'écoles en alternance chez 2C2L. À côté, je fais tourner GDT — du web pour des institutions locales et du conseil en IA pour des PME — et je construis Hermes, un assistant IA local-first.",
    },
  ],
};
