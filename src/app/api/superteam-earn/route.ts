import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'project';
    const limit = searchParams.get('limit') || '30';
    const page = searchParams.get('page') || '0';
    const slug = searchParams.get('slug') || '';

    // Build the URL for the external API
    let url = `https://earn.superteam.fun/api/listings?type=${type}&limit=${limit}&page=${page}`;

    // Add slug if provided
    if (slug) {
      url += `&slug=${slug}`;
    }

    console.log(`Fetching from: ${url}`);

    // Fetch data from the external API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    // Check if the response is ok
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch from Superteam Earn API: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Parse and return the data
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in proxy API route:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
