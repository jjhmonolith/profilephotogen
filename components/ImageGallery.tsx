'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [downloading, setDownloading] = useState<number | null>(null);

  const handleDownload = async (imageUrl: string, index: number) => {
    setDownloading(index);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `profile-photo-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('다운로드에 실패했습니다.');
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadAll = async () => {
    for (let i = 0; i < images.length; i++) {
      await handleDownload(images[i], i);
      // 다운로드 사이에 짧은 지연 추가 (브라우저 제한 방지)
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  if (images.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            생성된 프로필 사진
          </h2>
          <button
            onClick={handleDownloadAll}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            전체 다운로드
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="relative group bg-gray-100 rounded-lg overflow-hidden"
            >
              <div className="relative aspect-square">
                <Image
                  src={imageUrl}
                  alt={`Generated profile ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* 호버 오버레이 */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                <button
                  onClick={() => handleDownload(imageUrl, index)}
                  disabled={downloading === index}
                  className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 font-semibold py-2 px-6 rounded-lg transition-opacity disabled:opacity-50"
                >
                  {downloading === index ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                      다운로드 중...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      다운로드
                    </span>
                  )}
                </button>
              </div>

              {/* 이미지 번호 */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                {index + 1} / {images.length}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
