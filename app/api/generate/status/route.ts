import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const predictionId = searchParams.get('id');

    if (!predictionId) {
      return NextResponse.json(
        { error: 'Prediction ID is required' },
        { status: 400 }
      );
    }

    const prediction = await replicate.predictions.get(predictionId);

    // 상태에 따른 응답
    if (prediction.status === 'succeeded') {
      const imageUrls = Array.isArray(prediction.output)
        ? prediction.output
        : [prediction.output];

      return NextResponse.json({
        status: 'succeeded',
        images: imageUrls
      });
    } else if (prediction.status === 'failed') {
      return NextResponse.json({
        status: 'failed',
        error: prediction.error || 'Image generation failed'
      });
    } else if (prediction.status === 'canceled') {
      return NextResponse.json({
        status: 'canceled',
        error: 'Image generation was canceled'
      });
    } else {
      // starting, processing
      return NextResponse.json({
        status: prediction.status,
        progress: prediction.logs || 'Processing...'
      });
    }
  } catch (error: any) {
    console.error('Error checking prediction status:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to check status' },
      { status: 500 }
    );
  }
}
