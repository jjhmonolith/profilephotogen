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
            여러 장의 사진을 업로드하면 AI가 하나의 완벽한 프로필 사진을 생성합니다
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
              <li>본인의 얼굴이 선명하게 나온 사진을 3~10장 업로드해주세요</li>
              <li>다양한 각도와 표정의 사진을 포함하면 더 좋습니다</li>
              <li>AI가 자동으로 1장의 완벽한 프로필 사진을 생성합니다</li>
              <li>생성된 사진을 다운로드하여 사용하세요</li>
            </ol>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>팁:</strong> 여러 장의 사진을 업로드할수록 AI가 얼굴 특징을 더 정확하게 학습합니다.
                밝은 조명 아래에서 촬영된 사진과 다양한 각도의 사진을 포함하면 최상의 결과를 얻을 수 있습니다.
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
