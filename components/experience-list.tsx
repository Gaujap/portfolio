import { TagList } from "@/components/ui";
import { t, type Locale } from "@/lib/i18n";
import type { Experience } from "@/content/types";

/** Vertical list of roles, most recent first. */
export function ExperienceList({
  items,
  locale,
}: {
  items: Experience[];
  locale: Locale;
}) {
  return (
    <ul className="space-y-10">
      {items.map((role) => (
        <li key={role.company} className="border-t border-line pt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-display text-xl tracking-tight">{role.company}</h3>
            <p className="font-mono text-xs text-muted">
              {t(role.period, locale)}
            </p>
          </div>
          <p className="mt-1 text-sm text-accent">{t(role.role, locale)}</p>
          <p className="mt-3 max-w-[62ch] leading-relaxed text-muted">
            {t(role.summary, locale)}
          </p>
          {role.highlights.length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-5 leading-relaxed text-muted marker:text-accent">
              {role.highlights.map((highlight) => (
                <li key={highlight.en}>{t(highlight, locale)}</li>
              ))}
            </ul>
          )}
          {role.stack.length > 0 && (
            <TagList items={role.stack} label="Stack" className="mt-4" />
          )}
        </li>
      ))}
    </ul>
  );
}
