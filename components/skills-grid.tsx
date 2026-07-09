import { Tag } from "@/components/ui";
import { t, type Locale } from "@/lib/i18n";
import type { SkillGroup } from "@/content/types";

/** Capabilities grouped by category. */
export function SkillsGrid({
  groups,
  locale,
}: {
  groups: SkillGroup[];
  locale: Locale;
}) {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {groups.map((group) => (
        <div key={group.category.en}>
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted">
            {t(group.category, locale)}
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {group.items.map((skill) => (
              <li key={skill.name}>
                <Tag>{skill.name}</Tag>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
