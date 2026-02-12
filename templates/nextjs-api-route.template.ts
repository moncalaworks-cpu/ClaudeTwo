// Template: Next.js API Route
// File: app/api/[entity]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

interface [Entity] {
  id: number;
  name: string;
  email: string;
}

/**
 * GET handler for fetching [entities]
 * GET /api/[entities]
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '50';

    // Fetch from database/API
    const response = await fetch(
      `https://api.example.com/[entities]?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.API_SECRET}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    // Return with proper caching headers
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('GET /api/[entities]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating [entity]
 * POST /api/[entities]
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email' },
        { status: 400 }
      );
    }

    // Create [entity]
    const response = await fetch('https://api.example.com/[entities]', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_SECRET}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to create [entity]`);
    }

    const created = await response.json();

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('POST /api/[entities]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Route handler with dynamic params
 * File: app/api/[entities]/[id]/route.ts
 */
export async function GET_BY_ID(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = await fetch(
      `https://api.example.com/[entities]/${params.id}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.API_SECRET}`,
        },
      }
    );

    if (response.status === 404) {
      return NextResponse.json(
        { error: '[Entity] not found' },
        { status: 404 }
      );
    }

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const entity = await response.json();
    return NextResponse.json(entity);
  } catch (error) {
    console.error('GET /api/[entities]/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
