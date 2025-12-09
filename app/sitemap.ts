import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://paygate-optimizer.com'

  // Get all active providers
  let providerPages: MetadataRoute.Sitemap = []
  try {
    const providers = await prisma.provider.findMany({
      where: { isActive: true },
      select: { 
        slug: true, 
        updatedAt: true,
        isFeatured: true 
      },
      orderBy: [
        { isFeatured: 'desc' },
        { displayOrder: 'asc' },
        { nameEn: 'asc' }
      ]
    })

    providerPages = providers.map((provider) => ({
      url: `${baseUrl}/providers/${provider.slug}`,
      lastModified: provider.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: provider.isFeatured ? 0.85 : 0.8,
    }))
  } catch (error) {
    console.error('Error fetching providers for sitemap:', error)
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/wizard`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/providers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    ...providerPages,
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/sign-up`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}

