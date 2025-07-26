// Vimic 음악 생성 API 클라이언트

import { 
  GenerateSongRequest, 
  GenerateSongResponse, 
  GetAllSongsResponse,
  GetSongRequest,
  GetSongResponse,
  ApiErrorResponse 
} from '../shared/types/api.types';
import { API_ENDPOINTS, API_CONFIG } from './endpoints';

/**
 * 노래 생성 요청을 API에 전송
 * @param request 노래 생성 요청 데이터
 * @returns Promise<GenerateSongResponse>
 */
export async function generateSong(request: GenerateSongRequest): Promise<GenerateSongResponse> {
  try {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.GENERATE_SONG}`;
    console.log('API 호출 URL:', url);
    console.log('요청 데이터:', request);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    console.log('API 응답 상태:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData: ApiErrorResponse = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (parseError) {
        console.warn('에러 응답 파싱 실패:', parseError);
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('API 응답 데이터:', result);
    return result;
  } catch (error) {
    console.error('노래 생성 요청 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 모든 노래 목록 조회
 * @returns Promise<GetAllSongsResponse>
 */
export async function getAllSongs(): Promise<GetAllSongsResponse> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.GET_ALL_SONGS}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('노래 목록 조회 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 특정 노래 조회
 * @param request 노래 조회 요청 데이터
 * @returns Promise<GetSongResponse>
 */
export async function getSong(request: GetSongRequest): Promise<GetSongResponse> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.GET_SONG}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('노래 조회 중 오류 발생:', error);
    throw error;
  }
}
/**
 * 노래 상태 폴링 (진행 중인 노래의 완료 여부 확인)
 * @param taskId 태스크 ID
 * @param maxAttempts 최대 시도 횟수 (기본값: 30)
 * @param interval 폴링 간격 (기본값: 10초)
 * @returns Promise<GetSongResponse>
 */
export async function pollSongStatus(
  taskId: string, 
  maxAttempts: number = 60, 
  interval: number = 10000
): Promise<GetSongResponse> {
  let attempts = 0;
  
  console.log(`폴링 시작: taskId=${taskId}, maxAttempts=${maxAttempts}, interval=${interval}ms`);
  
  while (attempts < maxAttempts) {
    try {
      console.log(`폴링 시도 ${attempts + 1}/${maxAttempts}`);
      const response = await getSong({ task_id: taskId });
      
      console.log(`폴링 응답 상태: ${response.status}`, response);

      // song_info와 sunoData가 존재하는지 확인
      if (response.song_info?.sunoData && Array.isArray(response.song_info.sunoData)) {
        const sunoData = response.song_info.sunoData[0];
        
        if (sunoData?.prompt) {
          console.log('가사 생성 완료:', sunoData.prompt);
          return response; // 성공적으로 데이터를 반환
        }
      } else {
        console.warn('sunoData가 존재하지 않거나 빈 배열입니다.');
      }
      
      if (response.status === 'error') {
        console.error('노래 생성 실패됨');
        throw new Error('노래 생성에 실패했습니다.');
      }
      
      // 진행 중인 경우 대기 후 재시도
      console.log(`${interval}ms 후 재시도...`);
      await new Promise(resolve => setTimeout(resolve, interval));
      attempts++;
      
    } catch (error) {
      console.error(`폴링 시도 ${attempts + 1} 실패:`, error);
      attempts++;
      
      if (attempts >= maxAttempts) {
        console.error('최대 시도 횟수 초과');
        throw new Error('노래 생성이 시간 초과되었습니다.');
      }
      
      // 에러 발생 시에도 잠시 대기
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
  
  console.error('폴링 루프 종료 - 시간 초과');
  throw new Error('노래 생성이 시간 초과되었습니다.');
}


/**
 * 오디오 파일 다운로드
 * @param audioUrl 오디오 파일 URL
 * @returns Promise<ArrayBuffer>
 */
export async function downloadAudio(audioUrl: string): Promise<ArrayBuffer> {
  try {
    const response = await fetch(audioUrl);
    
    if (!response.ok) {
      throw new Error(`오디오 파일 다운로드 실패: ${response.status}`);
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error('오디오 파일 다운로드 중 오류 발생:', error);
    throw error;
  }
}
