'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import UserInfoForm, { UserInfo } from './UserInfoForm';
import PoseSelector, { professionalPoses } from './PoseSelector';

interface ImageUploaderProps {
  onImagesGenerated: (images: string[]) => void;
}

export default function ImageUploader({ onImagesGenerated }: ImageUploaderProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [selectedPose, setSelectedPose] = useState<string>('front-formal');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUserInfoSubmit = (info: UserInfo) => {
    setUserInfo(info);
    setStep(2);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 최대 4장까지만 허용
    if (files.length > 4) {
      setError('최대 4장까지만 업로드 가능합니다.');
      return;
    }

    // 모든 파일이 이미지인지 확인
    const allImages = Array.from(files).every(file => file.type.startsWith('image/'));
    if (!allImages) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }

    try {
      // 이미지 압축 옵션
      const options = {
        maxSizeMB: 0.8, // 최대 800KB로 압축
        maxWidthOrHeight: 1024, // 최대 1024px
        useWebWorker: true,
        fileType: 'image/jpeg' as const,
      };

      // 모든 파일을 압축하고 base64로 변환
      const imagePromises = Array.from(files).map(async (file) => {
        // 이미지 압축
        const compressedFile = await imageCompression(file, options);

        // base64로 변환
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(compressedFile);
        });
      });

      const images = await Promise.all(imagePromises);
      setSelectedImages(images);
      setError(null);
    } catch (err) {
      console.error('Image compression error:', err);
      setError('이미지 처리에 실패했습니다.');
    }
  };

  const pollPredictionStatus = async (predictionId: string): Promise<string[]> => {
    const maxAttempts = 120; // 최대 2분 (1초 간격)
    let attempts = 0;

    while (attempts < maxAttempts) {
      const response = await fetch(`/api/generate/status?id=${predictionId}`);
      const data = await response.json();

      if (data.status === 'succeeded') {
        return data.images;
      } else if (data.status === 'failed' || data.status === 'canceled') {
        throw new Error(data.error || '이미지 생성에 실패했습니다.');
      }

      // 1초 대기 후 재시도
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    throw new Error('이미지 생성 시간이 초과되었습니다. 다시 시도해주세요.');
  };

  const handleGenerate = async () => {
    if (selectedImages.length === 0) {
      setError('이미지를 먼저 업로드해주세요.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 1단계: prediction 생성 요청
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageDataUrls: selectedImages,
          userInfo: userInfo,
          selectedPose: selectedPose
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '이미지 생성 요청에 실패했습니다.');
      }

      const data = await response.json();

      if (!data.predictionId) {
        throw new Error('서버 응답 오류: prediction ID가 없습니다.');
      }

      // 2단계: 폴링으로 결과 대기
      const images = await pollPredictionStatus(data.predictionId);
      onImagesGenerated(images);
    } catch (err: any) {
      setError(err.message || '이미지 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
              3
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {step === 1 && '기본 정보 입력'}
          {step === 2 && '포즈 선택'}
          {step === 3 && '프로필 사진 생성하기'}
        </h2>

        {/* Step 1: User Info Form */}
        {step === 1 && (
          <UserInfoForm onSubmit={handleUserInfoSubmit} />
        )}

        {/* Step 2: Pose Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <PoseSelector
              selectedPose={selectedPose}
              onPoseSelect={setSelectedPose}
            />
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                이전
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                다음
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Image Upload and Generate */}
        {step === 3 && (
          <div className="space-y-4">
            {/* 파일 업로드 영역 */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />

              {selectedImages.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {selectedImages.map((image: string, index: number) => (
                      <div key={index} className="relative w-full aspect-square">
                        <Image
                          src={image}
                          alt={`Selected ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    {selectedImages.length}장 선택됨 (최대 4장)
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    다른 이미지 선택
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-block"
                >
                  <div className="space-y-2">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="text-gray-600">
                      <span className="font-semibold text-blue-600">
                        클릭하여 업로드
                      </span>
                      {' '}또는 드래그 앤 드롭
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, JPEG (최대 4장, 각 10MB)
                    </p>
                  </div>
                </label>
              )}
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* 버튼 그룹 */}
            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                이전
              </button>
              <button
                onClick={handleGenerate}
                disabled={selectedImages.length === 0 || isGenerating}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    프로필 사진 생성 중...
                  </span>
                ) : (
                  '프로필 사진 생성하기'
                )}
              </button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              사진 생성에는 약 30초~1분 정도 소요됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
