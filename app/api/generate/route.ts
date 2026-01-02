import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const { images } = await request.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'Multiple images are required' },
        { status: 400 }
      );
    }

    if (images.length < 3) {
      return NextResponse.json(
        { error: 'At least 3 images are required' },
        { status: 400 }
      );
    }

    if (images.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 images allowed' },
        { status: 400 }
      );
    }

    // fofr/consistent-character 모델을 사용하여 일관된 프로필 사진 생성
    // 여러 장의 사진에서 한 인물의 특징을 학습하여 1장의 프로필 사진 생성
    const output = await replicate.run(
      "fofr/consistent-character:9c77a5f3c27c67a06bc370fe9c22b76ede7fe7a94200d0e02875021c4f9f884a",
      {
        input: {
          subject: images[0], // 첫 번째 이미지를 주 참조로 사용
          prompt: "professional headshot portrait, bright sky blue background, soft studio lighting, clean and minimalist, high quality photography, 8k, professional photographer style, natural smile, business casual attire, sharp focus on face, consistent facial features",
          negative_prompt: "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, dark background, messy background, cluttered, inconsistent face",
          number_of_images: 1, // 1장만 생성
          output_format: "png",
          output_quality: 95,
          randomise_poses: false,
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
