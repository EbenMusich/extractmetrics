import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://extractmetrics.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard',
        '/dashboard/',
        '/account',
        '/account/',
        '/app',
        '/app/',
        '/settings',
        '/settings/',
        '/auth',
        '/auth/',
        '/check-email',
        '/forgot-password',
        '/reset-password',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
