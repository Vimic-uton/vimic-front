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
  tags? : string;
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
            console.log(res)

            const suno = res.data.song_info?.sunoData?.[0] || {};
            const sunop = res.data;

            // 객체를 중괄호로 감싸야 합니다.
            setMusic({
            title: suno.title || '제목 없음',
            audioUrl: suno.audioUrl || '',
            thumbnail: suno.image_url || '',
            sourceAudioUrl: suno.source_audio_url || '',
            streamAudioUrl: suno.source_stream_audio_url || '',
            sourceStreamAudioUrl: suno.stream_audio_url || '',
            tags :  suno.tags || '',
            prompt: sunop.prompt || '',
            });
        } catch (error) {
            console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
        }
        };
        
        useEffect(()=>{
            fetchMusic();
        },[])
    

  return (
    <div className="text-white p-8 pt-24">
      <div className="relative z-20 max-w-7xl mx-auto">
        {/* 제목 */}
        <h1 className="text-2xl font-bodoni mb-8">Manage</h1>

        

        <div className="">
          {/* 왼쪽: 입력 폼 */}
          <div className="space-y-8">
            {/* 곡 제목 입력 */}
            <div className="mt-12 flex flex-col gap-[3vh]">
             <p className='text-[2.3vh]'>곡제목</p>
              <input
                type="text"
                placeholder="혼술 먹방 바이럴 송"
                value={music?.title || "혼술"}
                readOnly

              />
              <hr className='border-b w-[50%] mt-[-2vh]' />
            </div>


          </div>

                <div className="space-y-8">
                {/* 곡 제목 입력 */}
                <div className="mt-12 flex flex-col gap-[3vh]">
                <p className='text-[2.3vh]'>태그</p>
                <input
                    type="text"
                    placeholder="혼술 먹방 바이럴 송"
                    value={music?.tags || "혼술"}
                    readOnly

                />
                </div>             
            </div>

        </div>
      </div>
    </div>
  );
}
