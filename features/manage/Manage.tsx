'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { API_ENDPOINTS, SUNO_API_CONFIG } from '@/api/endpoints';

interface MusicItem {
  id: string;
  title: string;
  duration: string;
  thumbnail?: string;
}

export default function Manage() {
  const [musicList, setMusicList] = useState<MusicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleMusicClick = (id: string) => {
    router.push(`/play/${id}`);
  };

  useEffect(() => {
  const fetchSongs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${SUNO_API_CONFIG.BASE_URL}${API_ENDPOINTS.GET_ALL_SONGS}`
      );
      console.log(res.data);

      const songs = Array.isArray(res.data.songs)
        ? res.data.songs.map((song: any) => {
            const suno = song.song_info?.response?.sunoData?.[0] || {};
            return {
              id: suno.id || song.taskId,
              title: suno.title || '제목 없음',
              duration: `${Math.round(suno.duration || 0)}s`,
              thumbnail: suno.imageUrl || undefined,
            };
          })
        : [];

      setMusicList(songs);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || '데이터를 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  fetchSongs();
}, []);



  return (
    <div className="min-h-screen text-white p-8 pt-32">
      <div className="relative z-20 max-w-7xl mx-auto">
        {/* 제목 */}
        <h1 className="text-2xl font-bodoni mb-8">Manage</h1>

        {/* 로딩 상태 */}
        {loading && (
          <div className="text-center py-20 text-white/60">로딩 중...</div>
        )}

        {/* 에러 상태 */}
        {error && !loading && (
          <div className="text-center py-20 text-red-400">{error}</div>
        )}

        {/* 음악 목록 */}
        {!loading && !error && musicList.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {musicList.map((music, index) => (
              <div
                key={`${music.id}-${index}`}
                className="group cursor-pointer"
                onClick={() => handleMusicClick(music.id)}
              >
                {/* 썸네일 */}
                <div className="w-full h-[287px] border border-white/40 rounded-[20px] bg-transparent flex items-center justify-center mb-4 group-hover:border-white/60 transition-colors">
                  {music.thumbnail ? (
                    <img
                      src={music.thumbnail}
                      alt={music.title}
                      className="w-full h-full object-cover rounded-[20px]"
                    />
                  ) : (
                    <div className="text-white/40 text-center">
                      <svg
                        className="w-16 h-16 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                      <p className="text-sm">음악 썸네일</p>
                    </div>
                  )}
                </div>

                {/* 음악 정보 */}
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium text-base">
                    {music.title}
                  </h3>
                  <span className="text-white/70 text-xs font-medium">
                    {music.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 빈 상태 */}
        {!loading && !error && musicList.length === 0 && (
          <div className="text-center py-20">
            <div className="text-white/40 mb-4">
              <svg
                className="w-24 h-24 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
            <h3 className="text-white/60 text-lg mb-2">
              생성된 음악이 없습니다
            </h3>
            <p className="text-white/40">
              Create 페이지에서 새로운 음악을 만들어보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
