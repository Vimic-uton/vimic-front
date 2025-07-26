'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Next.js의 useRouter 사용
import { generateSong, pollSongStatus } from '../../api/client';
import { GenerateSongRequest } from '../../shared/types/api.types';

export default function Create() {
  const [title, setTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [vocalStyle, setVocalStyle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedLyrics, setGeneratedLyrics] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const router = useRouter(); // Next.js의 useRouter로 페이지 이동 구현

  const tags = [
    { id: '틱톡', label: '틱톡감성', selected: selectedTags.includes('틱톡') },
    { id: '병맛', label: '병맛', selected: selectedTags.includes('병맛') },
    { id: '개그', label: '개그', selected: selectedTags.includes('개그') },
    { id: '슬픔', label: '슬픔', selected: selectedTags.includes('슬픔') },
    { id: '공포', label: '공포', selected: selectedTags.includes('공포') }
  ];

  const handleTagClick = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else if (selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleSubmit = async () => {
    // 입력 검증
    if (!title.trim()) {
      setError('곡 제목을 입력해주세요.');
      return;
    }
    if (selectedTags.length === 0) {
      setError('최소 1개의 태그를 선택해주세요.');
      return;
    }
    if (!vocalStyle.trim()) {
      setError('보컬 스타일을 입력해주세요.');
      return;
    }
    if (!description.trim()) {
      setError('프롬프트를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedLyrics('');
    setCoverImage('');

    try {
      // 노래 생성 요청
      const request: GenerateSongRequest = {
        title: title.trim(),
        tags: selectedTags,
        vocal_style: vocalStyle.trim(),
        description: description.trim()
      };

      const response = await generateSong(request);
      if (response.status === 'success' || response.status === 'pending') {
        const songResult = await pollSongStatus(response.task_id, 60, 5000); // 5초마다 체크

        if (songResult.status === 'complete' && songResult.song_info) {
          let lyrics = '';
          let imageUrl = '';

          // response가 null인지 확인하고 처리
          if (songResult.song_info.response) {
            console.log('response 확인:', songResult.song_info.response);

            // response 내부 데이터에서 필요한 정보 추출
            const sunoData = songResult.song_info.response.sunoData?.[0];
            if (sunoData) {
              lyrics = sunoData.prompt || '';
              imageUrl = sunoData.image_url || '';
            }
          } else {
            console.warn('song_info.response가 null입니다.');
          }

          // 가사 설정
          if (lyrics) {
            setGeneratedLyrics(lyrics);
            console.log('가사 설정 완료:', lyrics);
          } else {
            setGeneratedLyrics('가사 생성 완료 (가사 데이터 없음)');
            console.warn('가사 데이터를 찾을 수 없습니다.');
          }

          // 이미지 설정
          if (imageUrl) {
            setCoverImage(imageUrl);
            console.log('표지 이미지 설정 완료:', imageUrl);
          } else {
            console.warn('표지 이미지 URL을 찾을 수 없습니다.');
          }

          setIsLoading(false);
        } else {
          setError('노래 생성에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        setError(response.message || '노래 생성에 실패했습니다.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '노래 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 가사 생성 감지 및 페이지 이동
  useEffect(() => {
    if (generatedLyrics) {
      router.push('/manage'); // 가사가 생성되면 /manage로 이동
    }
  }, [generatedLyrics, router]); // generatedLyrics와 router를 감지

  return (
    <div className="text-white p-8 pt-24">
      <div className="relative z-20 max-w-7xl mx-auto">
        {/* 제목 */}
        <h1 className="text-2xl font-bodoni mb-8">Create</h1>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <div className="">
          {/* 왼쪽: 입력 폼 */}
          <div className="space-y-8">
            {/* 곡 제목 입력 */}
            <div className="mt-12">
              <label className="block text-white mb-2">곡제목을 입력해주세요</label>
              <input
                type="text"
                placeholder="혼술 먹방 바이럴 송"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-white/40 rounded-[30px] text-white placeholder-white/60 focus:outline-none focus:border-white/60"
                disabled={isLoading}
              />
            </div>

            {/* 태그 선택 */}
            <div>
              <label className="block text-white mb-2">태그를 설정해주세요(최소 1개 최대 3개)</label>
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagClick(tag.id)}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-[30px] border border-white/40 transition-all ${
                      tag.selected
                        ? 'bg-white text-black'
                        : 'bg-transparent text-white/60 hover:text-white'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 보컬 스타일 */}
            <div>
              <label className="block text-white mb-2">보컬 스타일을 정해주세요</label>
              <input
                type="text"
                placeholder="30대 아저씨가 걸걸하게"
                value={vocalStyle}
                onChange={(e) => setVocalStyle(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-white/40 rounded-[30px] text-white placeholder-white/60 focus:outline-none focus:border-white/60"
                disabled={isLoading}
              />
            </div>

            {/* 프롬프트 입력 */}
            <div>
              <label className="block text-white mb-2">프롬프트를 입력해주세요</label>
              <textarea
                placeholder="30대 아저씨가 슬프면서 애절하게 하지만 듣는사람은 웃긴 가사들로 구성해줘"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 bg-transparent border border-white/40 rounded-[30px] text-white placeholder-white/60 focus:outline-none focus:border-white/60 resize-none"
                disabled={isLoading}
              />
            </div>

            {/* 제작하기 버튼 */}
            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full px-6 py-4 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 border border-white/40 rounded-[30px] text-white hover:from-blue-500/60 hover:via-purple-500/60 hover:to-pink-500/60 transition-all duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? '생성 중...' : '제작하기'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
