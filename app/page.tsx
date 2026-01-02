'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import ImageGallery from '@/components/ImageGallery';

export default function Home() {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleImagesGenerated = (images: string[]) => {
    setGeneratedImages(images);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">
            AI 프로필 사진 생성기
          </h1>
          <p className="text-gray-600 mt-2">
            사진을 업로드하면 AI가 전문가 수준의 프로필 사진으로 변환해드립니다
          </p>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="container mx-auto px-4 py-12">
        {/* 안내 섹션 */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              사용 방법
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>본인의 얼굴이 선명하게 나온 사진을 업로드해주세요</li>
              <li>AI가 자동으로 4장의 프로필 사진을 생성합니다</li>
              <li>마음에 드는 사진을 다운로드하여 사용하세요</li>
            </ol>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>팁:</strong> 밝은 조명 아래에서 정면을 바라본 사진이 가장 좋은 결과를 만들어냅니다.
                생성된 사진은 밝은 하늘색 배경에 전문적인 스튜디오 조명으로 촬영된 것처럼 보입니다.
              </p>
            </div>
          </div>
        </div>

        {/* 이미지 업로더 */}
        <ImageUploader onImagesGenerated={handleImagesGenerated} />

        {/* 생성된 이미지 갤러리 */}
        <ImageGallery images={generatedImages} />
      </div>

      {/* 푸터 */}
      <footer className="bg-white mt-20 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              AI 프로필 사진 생성기 &copy; 2026
            </p>
            <p className="text-xs mt-2">
              Powered by Replicate AI
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
