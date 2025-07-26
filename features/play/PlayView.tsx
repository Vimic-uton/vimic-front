'use client';

import { useEffect, useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS, API_CONFIG } from '@/api/endpoints';

type PlayViewProps = { id?: string };

interface MusicDetail {
  title: string;
  audioUrl?: string;
  thumbnail?: string;
  sourceAudioUrl?: string;
  streamAudioUrl?: string;
  sourceStreamAudioUrl?: string;
  prompt?: string;
}

export default function PlayView({ id }: PlayViewProps) {
  const [music, setMusic] = useState<MusicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!id) return;

    const fetchMusic = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.post(
          `${API_CONFIG.BASE_URL}${API_ENDPOINTS.GET_SONG}`,
          { task_id: id },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        );

        const suno = res.data.song_info?.sunoData?.[0] || {};

        setMusic({
          title: suno.title || '제목 없음',
          audioUrl: suno.audioUrl || '',
          thumbnail: suno.image_url || '',
          sourceAudioUrl: suno.source_audio_url || '',
          streamAudioUrl: suno.source_stream_audio_url || '',
          sourceStreamAudioUrl: suno.stream_audio_url || '',
          prompt: suno.prompt || '',
        });
      } catch (err) {
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
    null;

  /** 오디오 컨트롤 */
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration || 0;
    setProgress((current / total) * 100);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = (Number(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = seekTime;
      setProgress(Number(e.target.value));
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="text-white p-8 pt-32 text-center">
        로딩 중...
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="text-red-400 p-8 pt-32 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="text-white flex flex-col mb-[10vh]">
      {/* 메인 컨텐츠 */}
      <h1 className="text-2xl font-bodoni mt-[13vh] ml-[-130vh] text-center">
            Play
          </h1>

      <div className="flex flex-col items-center justify-center">
        <div className="relative z-20 mt-[4vh]">
              <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={handleSeek}
              className="w-[170vh] h-0.5 bg-white rounded-lg appearance-none accent-white custom-slider"
            />
          <h1 className="text-2xl font-bodoni mt-[5vh] text-center">
            {music?.title || 'Play'}
          </h1>
        </div>

        {/* 썸네일 */}

        {/* 커스텀 오디오 플레이어 */}
        {playSrc ? (
          <div className="w-full max-w-2xl mb-4 flex flex-col items-center">
            <audio
              ref={audioRef}
              src={playSrc}
              preload="metadata"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />

            <p className="text-sm text-white/70 mt-2">
              {Math.floor((progress / 100) * duration)}s / {Math.floor(duration)}s
            </p>

          {music?.thumbnail ? (
              <img
                src={music.thumbnail}
                alt={music.title}
                className="w-[auto] h-[30vh] object-cover rounded-lg mt-[3vh]"
              />
            ) : (
              <span className="text-white/50 mb-6">썸네일 없음</span>
            )}

              </div>
        ) : (
          <p className="text-white/50 mb-4">오디오 URL 없음</p>
        )}

        {/* 가사 (Prompt) */}
        <div className="max-h-40 overflow-y-auto whitespace-pre-wrap text-sm   rounded-lg w-full max-w-2xl text-center">
          {music?.prompt || '가사 없음'}
        </div>


        <button
              onClick={togglePlay}
              className="p-4 rounded-full border-[1px] mt-[3vh] focus-none outline-none"
            >
              {isPlaying ? <Pause className="text-white w-6 h-6" /> : <Play className="text-white w-6 h-6" />}
            </button>

      </div>

      <style jsx>{`
        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
        }

        .custom-slider::-moz-range-thumb {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}