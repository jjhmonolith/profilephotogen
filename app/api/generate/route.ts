import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    // API 토큰 확인
    if (!process.env.REPLICATE_API_TOKEN) {
      console.error('REPLICATE_API_TOKEN is not set');
      return NextResponse.json(
        { error: 'Server configuration error: API token not set' },
        { status: 500 }
      );
    }

    const { imageDataUrl } = await request.json();

    if (!imageDataUrl) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    console.log('Processing image for profile generation');

    // fofr/consistent-character 최신 모델을 사용하여 프로필 사진 생성
    const output = await replicate.run(
      "fofr/consistent-character:9c77a3c2f884193fcee4d89645f02a0b9def9434f9e03cb98460456b831c8772",
      {
        input: {
          subject: imageDataUrl,
          prompt: "professional headshot portrait, bright sky blue background, soft studio lighting, clean and minimalist, high quality photography, 8k, professional photographer style, natural smile, business casual attire, sharp focus on face",
          negative_prompt: "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, dark background, messy background, cluttered",
          number_of_outputs: 4,
          output_format: "png",
          output_quality: 90,
          randomise_poses: true,
        }
      }
    ) as any;

    console.log('Image generation successful');

    // Replicate API는 배열을 반환
    const imageUrls = Array.isArray(output) ? output : [output];

    return NextResponse.json({ images: imageUrls });
  } catch (error: any) {
    console.error('Error generating images:', error);

    // 상세한 에러 정보 제공
    const errorMessage = error.message || 'Failed to generate images';
    const errorDetails = error.response?.data || error.toString();

    console.error('Error details:', errorDetails);

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      },
      { status: 500 }
    );
  }
}
