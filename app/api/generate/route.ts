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

    const { imageDataUrl, userInfo, selectedPose } = await request.json();

    if (!imageDataUrl) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    console.log('Processing image for profile generation', { userInfo, selectedPose });

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

    // 포즈별 프롬프트 매핑 (모든 포즈에서 얼굴은 정면)
    const posePrompts: Record<string, string> = {
      'front-formal': 'face directly facing camera, head straight forward, arms naturally at sides, shoulders square to camera, neutral professional stance',
      'arms-crossed': 'face directly facing camera, head straight forward, arms crossed confidently, professional stance, approachable expression',
      'slight-angle': 'face directly facing camera, head straight forward, body at a slight angle, one shoulder forward, relaxed professional pose',
      'hands-together': 'face directly facing camera, head straight forward, hands clasped together in front, standing upright, composed and professional demeanor'
    };

    const posePrompt = posePrompts[selectedPose || 'front-formal'];

    // fofr/consistent-character 최신 모델을 사용하여 프로필 사진 생성
    const output = await replicate.run(
      "fofr/consistent-character:9c77a3c2f884193fcee4d89645f02a0b9def9434f9e03cb98460456b831c8772",
      {
        input: {
          subject: imageDataUrl,
          prompt: `professional corporate headshot of a ${ageDescription} ${genderTerm}, ${styleGuide}, ${posePrompt}, neutral light gray background, professional studio lighting, natural expression, subtle smile, looking directly at camera, eyes facing camera, high-quality professional photography, clean and minimalist, smooth skin texture, well-groomed appearance, appropriate for corporate use`,
          negative_prompt: "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, harsh shadows, overexposed, underexposed, artificial look, overly retouched, plastic skin, cartoon, anime, dramatic lighting, colorful background, messy background, cluttered, unprofessional, casual selfie, party photo, seductive, sexy, glamorous, side view, profile view, side face, turned head, looking away, face turned away, back view",
          number_of_outputs: 1,
          output_format: "png",
          output_quality: 95,
          randomise_poses: false,
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
