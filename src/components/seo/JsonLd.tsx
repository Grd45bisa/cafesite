/**
 * JsonLd — menginjeksikan structured data (JSON-LD) ke dalam halaman.
 * Server-only component sederhana; tanpa props-client, aman di prerender.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      suppressHydrationWarning
    />
  );
}