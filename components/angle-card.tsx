import Link from "next/link";
import { Heading } from "@/components/ui";
import { t, type Locale } from "@/lib/i18n";
import { angles } from "@/content/angles";
import type { Angle } from "@/content/types";

/** Home-page entry point to an angle page. */
export function AngleCard({
  angle,
  locale,
  index,
}: {
  angle: Angle;
  locale: Locale;
  /** 1-based position, shown as an editorial index. */
  index: number;
}) {
  const data = angles[angle];

  return (
    <Link
      href={`/${locale}/${angle}`}
      className="group block border-t border-line pt-6 transition-colors hover:border-accent"
    >
      <span className="font-mono text-xs text-muted">
        {String(index).padStart(2, "0")}
      </span>
      <Heading level={3} className="mt-3 transition-colors group-hover:text-accent">
        {t(data.label, locale)}
      </Heading>
      <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-muted">
        {t(data.teaser, locale)}
      </p>
      <span
        aria-hidden="true"
        className="mt-4 inline-block text-accent transition-transform group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
