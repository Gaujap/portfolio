import type { Metadata } from "next";
import { AnglePage } from "@/components/angle-page";
import { pageMetadata } from "@/lib/seo";
import { t, type Locale } from "@/lib/i18n";
import { angles } from "@/content/angles";
import { angleSeoTitle } from "@/content/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/engineering",
    title: t(angleSeoTitle.engineering, locale),
    description: t(angles.engineering.teaser, locale),
  });
}

export default async function EngineeringPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <AnglePage angle="engineering" locale={locale} />;
}
