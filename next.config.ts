/**
 * Next.js 설정 파일
 * 프로덕션 최적화 및 보안 헤더 설정
 */

import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // 프로덕션 빌드 시 타입 오류 발생하면 빌드 중단
  typescript: {
    ignoreBuildErrors: false,
  },
  // 보안 헤더 설정
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ]
  },
}

export default nextConfig
