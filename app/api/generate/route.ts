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

    const { imageDataUrls, userInfo, selectedPose } = await request.json();

    if (!imageDataUrls || imageDataUrls.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      );
    }

    console.log('Processing images for profile generation', {
      imageCount: imageDataUrls.length,
      userInfo,
      selectedPose
    });

    // 나이대와 직군에 따른 프롬프트 생성
    const age = userInfo?.age ? parseInt(userInfo.age) : 30;
    const gender = userInfo?.gender || 'male';
    const jobRole = userInfo?.jobRole || 'developer';

    // 나이대 표현
    let ageDescription = '';
    if (age < 30) {
      ageDescription = 'young professional';
    } else if (age < 45) {
      ageDescription = 'professional';
    } else {
      ageDescription = 'experienced professional';
    }

    // 성별에 따른 표현
    const genderTerm = gender === 'female' ? 'woman' : 'man';

    // 직군별 복장 및 분위기
    const jobRoleStyles: Record<string, string> = {
      developer: 'smart casual, modern tech professional style',
      designer: 'creative professional, contemporary styling',
      pm: 'business professional, polished appearance',
      sales: 'business formal, confident presence',
      education: 'approachable professional, warm demeanor',
      marketing: 'modern professional, creative edge',
      hr: 'professional friendly, welcoming appearance',
      finance: 'business formal, conservative professional'
    };

    const styleGuide = jobRoleStyles[jobRole] || jobRoleStyles.developer;

    // 포즈별 프롬프트 매핑 (모든 포즈에서 얼굴과 시선은 정면, 고개는 수직)
    const posePrompts: Record<string, string> = {
      'front-formal': 'arms naturally at sides, shoulders square to camera, neutral professional stance',
      'arms-crossed': 'arms crossed confidently, professional stance, approachable expression',
      'slight-angle': 'body at a slight angle, one shoulder forward, relaxed professional pose',
      'hands-together': 'hands clasped together in front, standing upright, composed and professional demeanor'
    };

    const posePrompt = posePrompts[selectedPose || 'front-formal'];

    const MAX_REFERENCE_IMAGES = 5;
    const referenceImages = imageDataUrls.slice(0, MAX_REFERENCE_IMAGES);
    
    const prompt = `Create a professional corporate headshot photograph of the person shown in the reference image(s). 
The subject is a ${ageDescription} ${genderTerm}.
Style: ${styleGuide}
Pose: ${posePrompt}

Requirements:
- Head perfectly straight and upright, not tilted
- Face directly facing the camera with direct eye contact
- Solid plain light gray background, uniform and flat
- Professional studio lighting with soft, even illumination
- Natural, confident expression with a subtle smile
- High-quality professional photography style
- Clean and minimalist composition
- Well-groomed, polished appearance appropriate for corporate use
- Maintain the exact facial features and identity from the reference image(s)

Do NOT include: watermarks, text overlays, dramatic shadows, colorful or patterned backgrounds, casual or unprofessional styling.`;

    const inputParams: any = {
      prompt,
      reference_images: referenceImages,
      aspect_ratio: "1:1",
      output_format: "png",
      safety_filter_level: "block_medium_and_above",
    };

    const output = await replicate.run(
      "google/nano-banana-pro",
      { input: inputParams }
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
