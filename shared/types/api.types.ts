// Suno 음악 생성 API 타입 정의

// 음악 생성 요청 타입
export interface GenerateMusicRequest {
  prompt: string;
}

// 음악 생성 응답 타입
export interface GenerateMusicResponse {
  taskId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  message: string;
}

// 콜백 요청 타입
export interface CallbackRequest {
  taskId: string;
  status: 'completed' | 'failed';
  audioUrl?: string;
  meta?: {
    title: string;
    duration: string;
    model: string;
  };
  error?: string;
}

// 콜백 응답 타입
export interface CallbackResponse {
  message: string;
}

// API 에러 응답 타입
export interface ApiErrorResponse {
  detail: string;
}
