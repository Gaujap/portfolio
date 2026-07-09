import { Container, Section, Reveal, Eyebrow, Heading } from "@/components/ui";
import { t, type Locale } from "@/lib/i18n";
import { site } from "@/content/site";

/*
 * Placeholder home. It now renders inside the layout's <main>, header, and
 * footer, and exercises the primitives so the chrome can be verified. The real
 * editorial home replaces this in the pages step.
 */
export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <Container>
      <Section>
        <Eyebrow accent>{locale.toUpperCase()} · placeholder</Eyebrow>
        <Heading level={1} className="mt-8">
          {t(site.thesis, locale)}
        </Heading>
      </Section>
      <Reveal>
        <Section className="border-t border-line">
          <p className="max-w-[62ch] leading-relaxed text-muted">
            {t(site.now, locale)}
          </p>
        </Section>
      </Reveal>
    </Container>
  );
}
