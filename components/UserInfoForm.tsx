'use client';

import { useState } from 'react';

export interface UserInfo {
  age: string;
  gender: 'male' | 'female' | '';
  jobRole: string;
}

interface UserInfoFormProps {
  onSubmit: (info: UserInfo) => void;
}

const jobRoles = [
  {
    value: 'developer',
    label: '개발자',
    description: '소프트웨어 개발, 프로그래밍, 기술 엔지니어링'
  },
  {
    value: 'designer',
    label: '디자이너',
    description: 'UI/UX, 그래픽 디자인, 제품 디자인'
  },
  {
    value: 'pm',
    label: '기획자',
    description: '제품 기획, 프로젝트 관리, 전략 수립'
  },
  {
    value: 'sales',
    label: '영업',
    description: '비즈니스 개발, 영업, 고객 관리'
  },
  {
    value: 'education',
    label: '교육운영',
    description: '교육 프로그램 운영, 강의, 트레이닝'
  },
  {
    value: 'marketing',
    label: '마케팅',
    description: '마케팅 전략, 홍보, 브랜딩'
  },
  {
    value: 'hr',
    label: '인사',
    description: '인사 관리, 채용, 조직 문화'
  },
  {
    value: 'finance',
    label: '재무/회계',
    description: '재무 관리, 회계, 자금 운용'
  },
];

export default function UserInfoForm({ onSubmit }: UserInfoFormProps) {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    age: '',
    gender: '',
    jobRole: ''
  });

  const [errors, setErrors] = useState<Partial<UserInfo>>({});

  const validate = () => {
    const newErrors: Partial<UserInfo> = {};

    if (!userInfo.age || parseInt(userInfo.age) < 18 || parseInt(userInfo.age) > 100) {
      newErrors.age = '18-100 사이의 나이를 입력해주세요';
    }

    if (!userInfo.gender) {
      newErrors.gender = '성별을 선택해주세요';
    }

    if (!userInfo.jobRole) {
      newErrors.jobRole = '직군을 선택해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(userInfo);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 나이 입력 */}
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
          나이
        </label>
        <input
          type="number"
          id="age"
          min="18"
          max="100"
          value={userInfo.age}
          onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="예: 30"
        />
        {errors.age && (
          <p className="mt-1 text-sm text-red-600">{errors.age}</p>
        )}
      </div>

      {/* 성별 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          성별
        </label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={userInfo.gender === 'male'}
              onChange={(e) => setUserInfo({ ...userInfo, gender: e.target.value as 'male' })}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">남성</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={userInfo.gender === 'female'}
              onChange={(e) => setUserInfo({ ...userInfo, gender: e.target.value as 'female' })}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">여성</span>
          </label>
        </div>
        {errors.gender && (
          <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
        )}
      </div>

      {/* 직군 선택 */}
      <div>
        <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700 mb-2">
          직군
        </label>
        <select
          id="jobRole"
          value={userInfo.jobRole}
          onChange={(e) => setUserInfo({ ...userInfo, jobRole: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">직군을 선택해주세요</option>
          {jobRoles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
        {userInfo.jobRole && (
          <p className="mt-2 text-sm text-gray-600">
            {jobRoles.find(r => r.value === userInfo.jobRole)?.description}
          </p>
        )}
        {errors.jobRole && (
          <p className="mt-1 text-sm text-red-600">{errors.jobRole}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        다음 단계
      </button>
    </form>
  );
}
