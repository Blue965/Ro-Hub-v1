import Head from 'next/head';

export default function SEO({ title, description, image, url }) {
  const siteTitle = title ? `${title} | Ro Hub` : 'Ro Hub — Marketplace Roblox';
  const metaDescription = description || 'Achetez et vendez des scripts, models, UI et systèmes Roblox en toute sécurité.';
  const metaImage = image || '/og-default.png';

  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content={metaDescription} />
      
      {/* Open Graph / Facebook / Discord */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      {url && <meta property="og:url" content={url} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Head>
  );
}