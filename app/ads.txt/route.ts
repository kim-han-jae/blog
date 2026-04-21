export async function GET() {
  const publisherId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID;

  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`
    : "# Set NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID to enable ads.txt";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
