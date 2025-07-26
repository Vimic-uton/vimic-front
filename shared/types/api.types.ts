// Vimic 음악 생성 API 타입 정의

// 노래 생성 요청 타입
export interface GenerateSongRequest {
  title: string;
  tags: string[];
  vocal_style: string;
  description: string;
}

// 노래 생성 응답 타입
export interface GenerateSongResponse {
  status: 'success' | 'pending' | 'error';
  task_id: string;
  message: string;
}

// 노래 정보 타입
export interface SongInfo {
  taskId: string;
  parentMusicId: string;
  param: string;
  response: {
    taskId: string;
    sunoData: SunoData[];
    prompt?: string; // response 레벨에서도 prompt가 있을 수 있음
    imageUrl?: string; // response 레벨에서도 imageUrl이 있을 수 있음
  };
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  type: string;
  operationType: string;
  errorCode: string | null;
  errorMessage: string | null;
  createTime: number;
}

// Suno 데이터 타입
export interface SunoData {
  id: string;
  audioUrl: string;
  sourceAudioUrl: string;
  streamAudioUrl: string;
  sourceStreamAudioUrl: string;
  imageUrl: string;
  sourceImageUrl: string;
  prompt: string;
  modelName: string;
  title: string;
  tags: string;
  createTime: number;
  duration: number;
  response?: {
    prompt: string;
  };
}

// 모든 노래 조회 응답 타입
export interface GetAllSongsResponse {
  status: 'success' | 'error';
  songs: SongItem[];
}

// 개별 노래 아이템 타입
export interface SongItem {
  task_id: string;
  prompt: string;
  song_info: SongInfo;
}

// 특정 노래 조회 요청 타입
export interface GetSongRequest {
  task_id: string;
}

// 특정 노래 조회 응답 타입
export interface GetSongResponse {
  status: 'complete' | 'pending' | 'error';
  task_id: string;
  prompt?: string; // 최상위 레벨에 prompt가 있을 수 있음
  song_info: SongInfo;
}

// API 에러 응답 타입
export interface ApiErrorResponse {
  detail: string;
}
