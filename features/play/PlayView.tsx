'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, SUNO_API_CONFIG } from '@/api/endpoints';

type PlayViewProps = { id?: string };

interface MusicDetail {
  title: string;
  audioUrl?: string;
  thumbnail?: string;
  sourceAudioUrl? : string;
  streamAudioUrl? : string;
  sourceStreamAudioUrl? : string;
}

export default function PlayView({ id }: PlayViewProps) {
  const [music, setMusic] = useState<MusicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  

  useEffect(() => {
    if (!id) return;

    const fetchMusic = async () => {
      setLoading(true);
      setError(null);
      try {
          const res = await axios.post(
          `${SUNO_API_CONFIG.BASE_URL}${API_ENDPOINTS.GET_SONGS}`,
          { task_id: id }, // body
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        );

        // 응답 구조에 맞춰 데이터 파싱
        const suno = res.data.song_info?.response?.sunoData?.[0] || {};
        console.log(suno)
        setMusic({
          title: suno.title || '제목 없음',
          audioUrl: suno.audioUrl || '',
          thumbnail: suno.imageUrl || '',
        });
      } catch (err: any) {
        console.error(err);
        setError('음악 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMusic();
  }, [id]);

    const playSrc =
    music?.audioUrl ||
    music?.sourceAudioUrl ||
    music?.streamAudioUrl ||
    music?.sourceStreamAudioUrl ||
    '';

  return (
  <div className="text-white flex flex-col overflow-x-hidden h-full">

    {/* 헤더 영역 */}
    <div className="relative z-20 max-w-7xl p-8 pt-32">
      <h1 className="text-2xl font-bodoni mb-8  mx-auto">Play</h1>
    </div>

    {/* 메인 컨텐츠 - 남은 공간 모두 사용 */}
    <div className="border-[1px] border-[#EDEDED] flex-grow flex flex-col items-center justify-center h-[100vh] rounded-[30px] ">

      <h1 className="text-2xl font-bodoni mb-8  mx-auto">{music?.title}</h1>
      {music?.thumbnail ? (
        <div>
        <img
          src={music.thumbnail}
          alt={music.title}
          className=""
        />
        </div>
      ) : (

        <span className="text-white/50">썸네일 없음</span>
      )}
          {playSrc && (
        <audio controls preload="metadata" className="w-full max-w-2xl">
          <source src={playSrc} type="audio/mpeg" />
        </audio>
      )}
      </div>
  </div>
);
}