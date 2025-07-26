// Vimic 음악 생성 API 엔드포인트 정의

export const API_ENDPOINTS = {
  // 노래 생성 요청
  GENERATE_SONG: '/generate-song',
  
  // 모든 노래 조회
  GET_ALL_SONGS: '/get-all-songs',
  
  // 특정 노래 조회
  GET_SONG: '/get-song',
} as const;

// API 관련 설정
export const API_CONFIG = {
  // API 기본 URL (실제 환경에 맞게 설정 필요)
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://port-0-backend-m8axs0yud99a54dd.sel4.cloudtype.app',
  
  // API 키 환경변수명 (필요시)
  API_KEY_ENV: 'API_KEY',
} as const;
