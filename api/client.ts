// Suno 음악 생성 API 클라이언트

import { 
  GenerateMusicRequest, 
  GenerateMusicResponse, 
  CallbackRequest, 
  CallbackResponse,
  ApiErrorResponse 
} from '../shared/types/api.types';
import { API_ENDPOINTS, SUNO_API_CONFIG } from './endpoints';

// 음악 생성
export async function generateMusic(request: GenerateMusicRequest): Promise<GenerateMusicResponse> {
  try {
    const response = await fetch(`${SUNO_API_CONFIG.BASE_URL}${API_ENDPOINTS.GENERATE_MUSIC}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env[SUNO_API_CONFIG.API_KEY_ENV]}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('음악 생성 요청 중 오류 발생:', error);
    throw error;
  }
}

// 콜백 처리
export async function handleCallback(callbackData: CallbackRequest): Promise<CallbackResponse> {
  try {
    // 콜백 데이터 검증
    if (!callbackData.taskId) {
      throw new Error('taskId is required');
    }

    // 콜백 처리 로직 (예: 데이터베이스에 저장, 알림 발송 등)
    console.log('콜백 수신:', callbackData);

    // 성공 응답 반환
    return {
      message: 'Callback received'
    };
  } catch (error) {
    console.error('콜백 처리 중 오류 발생:', error);
    throw error;
  }
}

// 태스크 상태 확인
export async function checkTaskStatus(taskId: string): Promise<GenerateMusicResponse> {
  try {
    const response = await fetch(`${SUNO_API_CONFIG.BASE_URL}/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env[SUNO_API_CONFIG.API_KEY_ENV]}`,
      },
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('태스크 상태 확인 중 오류 발생:', error);
    throw error;
  }
}

// 음악 파일 다운로드
export async function downloadAudio(audioUrl: string): Promise<ArrayBuffer> {
  try {
    const response = await fetch(audioUrl);
    
    if (!response.ok) {
      throw new Error(`음악 파일 다운로드 실패: ${response.status}`);
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error('음악 파일 다운로드 중 오류 발생:', error);
    throw error;
  }
}
