import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://capitalmatchfunding.com'
  return [
    { url: base,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/apply`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/faq`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]
}
