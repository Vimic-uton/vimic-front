'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, API_CONFIG } from '@/api/endpoints';

type aboutwProps = { id?: string };

interface MusicDetail {
  title: string;
  audioUrl?: string;
  thumbnail?: string;
  sourceAudioUrl?: string;
  streamAudioUrl?: string;
  sourceStreamAudioUrl?: string;
  prompt?: string;
  tags?: string;
  lys? : string; // 태그를 문자열로 저장
}

export default function AboutView({ id }: aboutwProps) {
  const [music, setMusic] = useState<MusicDetail | null>(null);

  const fetchMusic = async () => {
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
      console.log(res);

      const suno = res.data.song_info?.sunoData?.[0] || {};
      const sunop = res.data;

        const prompt = sunop.prompt || '';
      const tagsMatch = prompt.match(/태그:\s*(.+)/);

      // 태그를 배열에서 문자열로 변환
      const tags = tagsMatch ? tagsMatch[1].split(',').map((tag: string) => tag.trim()).join(', ') : '';


      setMusic({
        title: suno.title || '제목 없음',
        audioUrl: suno.audioUrl || '',
        thumbnail: suno.image_url || '',
        sourceAudioUrl: suno.source_audio_url || '',
        streamAudioUrl: suno.source_stream_audio_url || '',
        sourceStreamAudioUrl: suno.stream_audio_url || '',
        tags: tags, // 변환된 태그를 저장
        prompt: sunop.prompt || '',
        lys : suno.prompt || '',
      });
    } catch (error) {
      console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
    }
  };

  console.log(music)

  useEffect(() => {
    fetchMusic();
  }, []);

  return (
    <div className="text-white p-8 pt-24">
        <div className='flex items-center justify-center'>
      <div className="relative z-20 max-w-7xl mx-auto ml-[30vh]">
        {/* 제목 */}
        <h1 className="text-2xl font-bodoni mb-8">Manage</h1>

        <div className="">
          {/* 왼쪽: 입력 폼 */}
          <div className="space-y-8">
            {/* 곡 제목 입력 */}
            <div className="mt-12 flex flex-col gap-[3vh]">
              <p className="text-[2.3vh]">곡제목</p>
              <input
                type="text"
                placeholder="혼술 먹방 바이럴 송"
                value={music?.title || '혼술'}
                readOnly
              />
              <hr className="border-b w-[50%] mt-[-2vh]" />
            </div>
          </div>

          <div className="space-y-8">
            {/* 태그 입력 */}
            <div className="mt-12 flex flex-col gap-[3vh]">
              <p className="text-[2.3vh]">태그</p>
              <p>{music?.tags || '혼술'}</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* 태그 입력 */}
            <div className="mt-12 flex flex-col gap-[3vh] w-[50%]">
              <p className="text-[2.3vh]">프롬포트</p>
              <p className='whitespace-pre-wrap'>{music?.prompt || '혼술'}</p>
            </div>
          </div>

        </div>
      </div>

      <div className='mr-[20vh] flex flex-col gap-[10vh]'>
        <div className='w-[50vh] h-[auto] '>
            <img src={music?.thumbnail} alt="" className='w-[100%] h-[auto] rounded-[5vh]'/>
        </div>
        <div className="max-h-40 overflow-y-auto whitespace-pre-wrap text-sm   rounded-lg w-full max-w-2xl text-center">
          {music?.lys || '가사 없음'}
        </div>
      </div>
      </div>
    </div>
  );
}
