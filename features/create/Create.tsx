'use client';

import { useState } from 'react';
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

  const tags = [
    { id: 'tiktok', label: '틱톡감성', selected: selectedTags.includes('tiktok') },
    { id: 'funny', label: '병맛', selected: selectedTags.includes('funny') },
    { id: 'comedy', label: '개그', selected: selectedTags.includes('comedy') },
    { id: 'sad', label: '슬픔', selected: selectedTags.includes('sad') },
    { id: 'horror', label: '공포', selected: selectedTags.includes('horror') }
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

      console.log('노래 생성 요청 시작:', request);
      setGeneratedLyrics('노래 생성 요청 중...');
      
      const response = await generateSong(request);
      console.log('노래 생성 응답:', response);
      
      if (response.status === 'success' || response.status === 'pending') {
        console.log('노래 생성 시작됨, task_id:', response.task_id);
        setGeneratedLyrics(`노래가 생성 중입니다... (Task ID: ${response.task_id})`);
        
        // 폴링으로 완료 확인
        console.log('폴링 시작...');
        const songResult = await pollSongStatus(response.task_id, 30, 5000); // 5초마다 체크
        console.log('폴링 완료, 결과:', songResult);
        
        if (songResult.status === 'complete' && songResult.song_info) {
          console.log('전체 song_info:', songResult.song_info);
          console.log('최상위 prompt:', songResult.prompt);
          
          // 가사 추출 - 최상위 레벨에서 먼저 확인
          let lyrics = '';
          let imageUrl = '';
          
          // 1. 최상위 레벨의 prompt 확인
          if (songResult.prompt) {
            lyrics = songResult.prompt;
            console.log('가사 추출 성공 (최상위 prompt):', lyrics);
          } else {
            // 2. song_info.response에서 확인 (null이 아닌 경우)
            const sunoData = songResult.song_info.response?.sunoData?.[0];
            console.log('sunoData:', sunoData);
            
            if (sunoData?.prompt) {
              lyrics = sunoData.prompt;
              console.log('가사 추출 성공 (sunoData.prompt):', lyrics);
            } else if (sunoData?.response?.prompt) {
              lyrics = sunoData.response.prompt;
              console.log('가사 추출 성공 (sunoData.response.prompt):', lyrics);
            } else {
              console.warn('가사 데이터를 찾을 수 없습니다');
            }
          }
          
          // 표지 이미지 URL 추출 - song_info.response가 null이므로 다른 방법 필요
          // 현재 API 응답 구조에서는 이미지 URL이 없는 것 같음
          console.log('표지 이미지 URL 추출 시도...');
          
          // song_info.response가 null이므로 이미지 URL을 찾을 수 없음
          if (!imageUrl) {
            console.warn('표지 이미지 URL을 찾을 수 없습니다 (song_info.response가 null)');
          }
          
          // 결과 설정
          if (lyrics) {
            setGeneratedLyrics(lyrics);
            console.log('가사 설정 완료');
          } else {
            console.warn('가사 데이터를 찾을 수 없습니다');
            setGeneratedLyrics('가사 생성 완료 (가사 데이터 없음)');
          }
          
          if (imageUrl) {
            setCoverImage(imageUrl);
            console.log('표지 이미지 설정 완료:', imageUrl);
          } else {
            console.warn('표지 이미지 URL을 찾을 수 없습니다');
          }
          
          console.log('노래 생성 완료!');
        } else {
          console.error('노래 생성 실패:', songResult);
          setError('노래 생성에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        console.error('노래 생성 요청 실패:', response);
        setError(response.message || '노래 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('노래 생성 중 오류 발생:', error);
      setError(error instanceof Error ? error.message : '노래 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
          
          <div className="flex flex-col space-y-8">
            {/* 표지 */}
            <div>
              <label className="block text-white mb-4">표지</label>
              <div className="w-full h-[550px] border border-white/40 rounded-[10px] bg-transparent flex items-center justify-center overflow-hidden">
                {coverImage ? (
                  <img 
                    src={coverImage} 
                    alt="앨범 커버" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white/60">
                    {isLoading ? '표지 이미지 생성 중...' : '표지 이미지가 여기에 표시됩니다'}
                  </span>
                )}
              </div>
            </div>

            {/* 가사 */}
            <div>
              <label className="block text-white mb-2">가사</label>
              <div className="w-full h-[76px] border border-white/40 rounded-[30px] bg-transparent flex items-center justify-center p-4 overflow-y-auto">
                {generatedLyrics ? (
                  <span className="text-white text-sm whitespace-pre-wrap text-center">
                    {generatedLyrics}
                  </span>
                ) : (
                  <span className="text-white/60">
                    {isLoading ? '가사 생성 중...' : '생성된 가사가 여기에 표시됩니다'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
