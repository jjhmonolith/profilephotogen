'use client';

import { useState, useEffect } from 'react';

interface CreditInfo {
  balance: number;
  estimatedCostPerGeneration: number;
  username?: string;
}

export default function CreditDisplay() {
  const [creditInfo, setCreditInfo] = useState<CreditInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/credits');
      
      if (!response.ok) {
        throw new Error('Failed to fetch credits');
      }
      
      const data = await response.json();
      setCreditInfo(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
      </div>
    );
  }

  if (error || !creditInfo) {
    return (
      <div className="text-sm text-red-500">
        크레딧 조회 실패
      </div>
    );
  }

  const hasBalance = creditInfo.balance !== null && creditInfo.balance !== undefined;
  const estimatedGenerations = hasBalance 
    ? Math.floor(creditInfo.balance / creditInfo.estimatedCostPerGeneration) 
    : null;

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium text-blue-700">
          {hasBalance ? `$${creditInfo.balance.toFixed(2)}` : '잔액 조회 불가'}
        </span>
      </div>
      <div className="text-gray-500 hidden sm:block">
        <span className="text-gray-400">예상 비용:</span>
        <span className="ml-1">${creditInfo.estimatedCostPerGeneration.toFixed(2)}/회</span>
        {hasBalance && estimatedGenerations !== null && (
          <>
            <span className="mx-1 text-gray-300">|</span>
            <span className="text-gray-400">약</span>
            <span className="ml-1 font-medium text-gray-600">{estimatedGenerations}회</span>
            <span className="ml-1 text-gray-400">생성 가능</span>
          </>
        )}
      </div>
    </div>
  );
}
