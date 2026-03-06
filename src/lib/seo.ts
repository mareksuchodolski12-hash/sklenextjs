import type { Metadata } from 'next';

import { siteConfig } from '@/config/site';

const siteUrl = new URL(siteConfig.url);

export function getSiteUrl() {
  return siteUrl;
}

export function toAbsoluteUrl(pathname: string) {
  return new URL(pathname, siteUrl).toString();
}

export function buildPageMetadata({
  title,
  description,
  pathname,
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  pathname: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const canonicalUrl = toAbsoluteUrl(pathname);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.branding.name,
      locale: 'en_US',
      type: 'website',
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}
