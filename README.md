# AI 프로필 사진 생성기

사용자의 일반 사진을 전문 포토그래퍼가 촬영한 프로필 사진으로 변환해주는 웹 서비스입니다.

## 주요 기능

- 📸 사진 업로드 및 AI 프로필 사진 생성
- 🎨 일관된 스타일 (밝은 하늘색 배경, 스튜디오 조명)
- 🖼️ 한 번에 4장의 프로필 사진 생성
- 💾 개별 또는 전체 다운로드 지원
- 🚀 간편한 MVP 형태의 웹 서비스

## 기술 스택

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **AI Model**: Replicate (fofr/consistent-character)
- **배포**: Vercel / Railway

## AI 모델 선정 근거

다양한 AI 이미지 생성 모델을 조사한 결과, **Replicate의 fofr/consistent-character** 모델을 선택했습니다:

- ✅ 단일 참조 이미지로 일관된 캐릭터 생성 가능
- ✅ 얼굴 특징 유지 능력이 뛰어남
- ✅ API 접근이 간편하고 안정적
- ✅ 다양한 포즈와 표정 생성 지원

대안으로 고려한 모델:
- FLUX.1 Kontext (참조 이미지 기반 일관성 유지)
- InstantID (높은 얼굴 유사도)

## 로컬 개발 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 Replicate API 키를 설정합니다:

```bash
# .env.example을 복사
cp .env.example .env
```

`.env` 파일에 다음 내용을 추가:

```
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

Replicate API 키는 [https://replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)에서 발급받을 수 있습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

## Vercel 배포 가이드

### 1. GitHub 저장소 생성

프로젝트를 GitHub에 푸시합니다:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/profile-photo-gen.git
git push -u origin main
```

### 2. Vercel 배포

1. [Vercel](https://vercel.com)에 로그인
2. "Add New Project" 클릭
3. GitHub 저장소 연결
4. 프로젝트 선택
5. 환경 변수 설정:
   - `REPLICATE_API_TOKEN`: Replicate API 키 입력
6. "Deploy" 클릭

### 3. 배포 완료

몇 분 후 배포가 완료되면 제공된 URL로 접속하여 서비스를 이용할 수 있습니다.

## Railway 배포 가이드 (대안)

### 1. Railway 프로젝트 생성

1. [Railway](https://railway.app)에 로그인
2. "New Project" 클릭
3. "Deploy from GitHub repo" 선택
4. 저장소 연결 및 선택

### 2. 환경 변수 설정

Railway 프로젝트 설정에서:
- `REPLICATE_API_TOKEN`: Replicate API 키 입력

### 3. 배포 설정

Railway는 자동으로 Next.js를 감지하고 배포합니다.

## 프로젝트 구조

```
profile-photo-gen/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # Replicate API 연동
│   ├── globals.css                # 전역 스타일
│   ├── layout.tsx                 # 루트 레이아웃
│   └── page.tsx                   # 메인 페이지
├── components/
│   ├── ImageUploader.tsx          # 이미지 업로드 컴포넌트
│   └── ImageGallery.tsx           # 이미지 갤러리 컴포넌트
├── public/                        # 정적 파일
├── .env.example                   # 환경 변수 예시
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## 사용 방법

1. 메인 페이지에서 본인의 얼굴이 선명하게 나온 사진을 업로드합니다
2. "프로필 사진 생성하기" 버튼을 클릭합니다
3. 약 30초~1분 후 4장의 프로필 사진이 생성됩니다
4. 마음에 드는 사진을 개별 다운로드하거나 전체 다운로드합니다

### 최적의 결과를 위한 팁

- ✅ 밝은 조명 아래에서 촬영된 사진
- ✅ 정면을 바라본 얼굴
- ✅ 얼굴이 선명하게 나온 사진
- ✅ JPG, PNG 형식의 이미지

## 비용 안내

- **Vercel**: Hobby 플랜(무료) 사용 가능
- **Replicate**: 사용량 기반 과금 (API 요청당 약 $0.01~$0.05)
  - 무료 크레딧으로 테스트 가능
  - 자세한 가격은 [Replicate Pricing](https://replicate.com/pricing) 참조

## 향후 개선 사항

MVP 버전에서 제외된 기능들 (필요시 추가 개발 가능):
- 사용자 인증 및 로그인
- 결제 시스템 연동
- 생성 기록 저장
- 다양한 배경 스타일 선택
- 배치 처리 (여러 사진 한 번에 업로드)

## 라이선스

MIT

## 참고 자료

- [Replicate Documentation](https://replicate.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
