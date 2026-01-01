import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const { imageDataUrl } = await request.json();

    if (!imageDataUrl) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // fofr/consistent-character 모델을 사용하여 일관된 프로필 사진 생성
    // 밝은 하늘색 배경의 전문적인 프로필 사진 컨셉
    const output = await replicate.run(
      "fofr/consistent-character:9c77a5f3c27c67a06bc370fe9c22b76ede7fe7a94200d0e02875021c4f9f884a",
      {
        input: {
          subject: imageDataUrl,
          prompt: "professional headshot portrait, bright sky blue background, soft studio lighting, clean and minimalist, high quality photography, 8k, professional photographer style, natural smile, business casual attire, sharp focus on face",
          negative_prompt: "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, dark background, messy background, cluttered",
          number_of_images: 4,
          output_format: "png",
          output_quality: 90,
          randomise_poses: true,
        }
      }
    );

    return NextResponse.json({ images: output });
  } catch (error: any) {
    console.error('Error generating images:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate images' },
      { status: 500 }
    );
  }
}
