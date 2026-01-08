import { NextResponse } from 'next/server';

const ESTIMATED_COST_PER_GENERATION = 0.05;

export async function GET() {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'API token not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.replicate.com/v1/account', {
      headers: {
        'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch account info');
    }

    const account = await response.json();

    return NextResponse.json({
      balance: account.balance || 0,
      estimatedCostPerGeneration: ESTIMATED_COST_PER_GENERATION,
      username: account.username,
    });
  } catch (error: any) {
    console.error('Error fetching credits:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch credits' },
      { status: 500 }
    );
  }
}
