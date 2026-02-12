// Template: Next.js Server Component
// Usage: Copy to app/ directory (default in App Router is Server Component)

import { Suspense } from 'react';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

/**
 * Server Component for [Entity] detail page
 *
 * Benefits:
 * - Direct database access (no API needed)
 * - Sensitive data safe (never sent to client)
 * - Better SEO (full content in HTML)
 * - Reduced bundle size
 */
async function get[Entity]Data(id: string) {
  try {
    const response = await fetch(`https://api.example.com/[entities]/${id}`, {
      next: { revalidate: 3600 }, // ISR: revalidate every hour
      headers: {
        'Authorization': `Bearer ${process.env.API_SECRET}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error('Failed to fetch [entity]');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching [entity]:', error);
    throw error;
  }
}

export default async function [Entity]Page({ params }: Props) {
  // This runs on the server at build/request time
  const [entity] = await get[Entity]Data(params.id);

  if (![entity]) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">{[entity].name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Details</h2>
          <p className="text-gray-600 mb-4">{[entity].description}</p>
          {/* Add more content */}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Related Content</h2>
          {/* Load related data with Suspense boundary */}
          <Suspense fallback={<div>Loading related items...</div>}>
            <Related[Entity]s [entityId]={[entity].id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// Async child component
async function Related[Entity]s({ [entityId] }: { [entityId]: string }) {
  const response = await fetch(
    `https://api.example.com/[entities]/${[entityId]}/related`,
    { next: { revalidate: 3600 } }
  );
  const related = await response.json();

  return (
    <ul>
      {related.map((item: any) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// SEO Metadata
export async function generateMetadata({ params }: Props) {
  const [entity] = await get[Entity]Data(params.id);

  return {
    title: [entity].name,
    description: [entity].description,
    openGraph: {
      title: [entity].name,
      description: [entity].description,
      url: `https://example.com/[entities]/${params.id}`,
      type: 'article',
    },
  };
}

// Generate static params for ISR
export async function generateStaticParams() {
  const response = await fetch('https://api.example.com/[entities]');
  const [entities] = await response.json();

  return [entities].map((entity: any) => ({
    id: String(entity.id),
  }));
}
