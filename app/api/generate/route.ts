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

    // PuLID 모델을 사용하여 프로필 사진 생성 (얼굴 일관성 우수, 다중 이미지 지원)
    const inputParams: any = {
      main_face_image: imageDataUrls[0],
      prompt: `professional corporate headshot, ${ageDescription} ${genderTerm}, ${styleGuide}, ${posePrompt}, head perfectly straight and upright, head not tilted, head vertical, face directly facing camera, eyes looking straight at camera, direct eye contact with camera, solid plain light gray background, uniform flat background, no gradient, no texture, no patterns, studio backdrop, professional studio lighting, soft even lighting, natural expression, subtle smile, high-quality professional photography, clean and minimalist, smooth skin texture, well-groomed appearance, appropriate for corporate use, front-facing portrait`,
      negative_prompt: "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, harsh shadows, overexposed, underexposed, artificial look, overly retouched, plastic skin, cartoon, anime, dramatic lighting, unprofessional, casual selfie, party photo, seductive, sexy, glamorous, side view, profile view, side face, turned head, looking away, face turned away, back view, tilted head, head tilt, angled head, looking up, looking down, eyes looking away, eyes closed, head turned, colorful background, patterned background, textured background, gradient background, messy background, cluttered background, outdoor background, nature background, office background, room background, wall details, decorations, furniture, windows, doors",
      num_steps: 20,
      cfg_scale: 1.2,
      seed: Math.floor(Math.random() * 1000000),
      output_format: "png",
      output_quality: 100,
      identity_scale: 0.8,
      generation_mode: "fidelity",
      num_samples: 1,
    };

    // 추가 참조 이미지가 있으면 auxiliary 이미지로 추가
    if (imageDataUrls.length > 1) {
      inputParams.auxiliary_face_image1 = imageDataUrls[1];
    }
    if (imageDataUrls.length > 2) {
      inputParams.auxiliary_face_image2 = imageDataUrls[2];
    }
    if (imageDataUrls.length > 3) {
      inputParams.auxiliary_face_image3 = imageDataUrls[3];
    }

    const output = await replicate.run(
      "zsxkib/pulid:43d309c37ab4e62361e5e29b8e9e867fb2dcbcec77ae91206a8d95ac5dd451a0",
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
