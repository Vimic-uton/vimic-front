// Suno 음악 생성 API 엔드포인트 정의

export const API_ENDPOINTS = {
  // 음악 생성 요청
  GENERATE_MUSIC: '/generate-music',
  
  // 콜백 수신
  CALLBACK: '/callback',

  GET_ALL_SONGS : 'get-all-songs',

  GET_SONGS: 'get-song',
} as const;

// Suno API 관련 설정
export const SUNO_API_CONFIG = {
  // Suno API 기본 URL (실제 환경에 맞게 설정 필요)
  BASE_URL: process.env.SUNO_API_BASE_URL || 'https://port-0-backend-m8axs0yud99a54dd.sel4.cloudtype.app/',
  
  // API 키 환경변수명
  API_KEY_ENV: 'SUNO_API_KEY',
} as const;
