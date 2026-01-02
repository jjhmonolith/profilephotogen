'use client';

import { useState } from 'react';

export interface PoseOption {
  value: string;
  label: string;
  description: string;
  prompt: string;
}

// 회사 프로필 사진용 전문적인 포즈 4가지
export const professionalPoses: PoseOption[] = [
  {
    value: 'front-formal',
    label: '정면 기본',
    description: '정면을 바라보며 양손을 자연스럽게 내린 클래식한 포즈',
    prompt: 'facing camera directly, arms naturally at sides, shoulders square to camera, neutral professional stance'
  },
  {
    value: 'arms-crossed',
    label: '팔짱 포즈',
    description: '자신감 있고 전문적인 이미지의 팔짱 포즈',
    prompt: 'arms crossed confidently, facing camera, professional stance, approachable expression'
  },
  {
    value: 'slight-angle',
    label: '약간 비스듬히',
    description: '몸은 약간 옆으로, 얼굴은 카메라를 향한 자연스러운 포즈',
    prompt: 'body at a slight angle, face towards camera, one shoulder forward, relaxed professional pose'
  },
  {
    value: 'hands-together',
    label: '손 모음',
    description: '두 손을 앞에서 모은 정중하고 차분한 포즈',
    prompt: 'hands clasped together in front, standing upright, composed and professional demeanor'
  }
];

interface PoseSelectorProps {
  selectedPose: string;
  onPoseSelect: (pose: string) => void;
}

export default function PoseSelector({ selectedPose, onPoseSelect }: PoseSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        포즈 선택
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {professionalPoses.map((pose) => (
          <button
            key={pose.value}
            type="button"
            onClick={() => onPoseSelect(pose.value)}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              selectedPose === pose.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="font-medium text-gray-900 mb-1">
              {pose.label}
              {selectedPose === pose.value && (
                <span className="ml-2 text-blue-600">✓</span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {pose.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
