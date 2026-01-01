import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 프로필 사진 생성기",
  description: "사진을 업로드하면 AI가 전문가 수준의 프로필 사진으로 변환해드립니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
