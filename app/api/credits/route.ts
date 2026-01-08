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
      const errorText = await response.text();
      console.error('Account API error:', response.status, errorText);
      throw new Error(`Failed to fetch account info: ${response.status}`);
    }

    const account = await response.json();
    console.log('Account API response:', JSON.stringify(account, null, 2));

    const balance = account.billing?.prepaid_balance 
      ?? account.prepaid_balance 
      ?? account.credit_balance
      ?? account.credits
      ?? account.balance 
      ?? null;

    return NextResponse.json({
      balance: balance,
      estimatedCostPerGeneration: ESTIMATED_COST_PER_GENERATION,
      username: account.username,
      type: account.type,
      rawAccount: account,
    });
  } catch (error: any) {
    console.error('Error fetching credits:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch credits' },
      { status: 500 }
    );
  }
}
