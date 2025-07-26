'use client';

import { useState } from 'react';

export default function Create() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [vocalStyle, setVocalStyle] = useState('');
  const [prompt, setPrompt] = useState('');

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

      return (
      <div className=" text-white p-8 pt-24">

      <div className="relative z-20 max-w-7xl mx-auto">
        {/* 제목 */}
        <h1 className="text-2xl font-bodoni mb-8">Create</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 입력 폼 */}
          <div className="space-y-6">
            {/* 곡 제목 입력 */}
            <div className="mt-20">
              <label className="block text-white mb-2">곡제목을 입력해주세요</label>
              <input
                type="text"
                placeholder="혼술 먹방 바이럴 송"
                className="w-full px-4 py-3 bg-transparent border border-white/40 rounded-[30px] text-white placeholder-white/60 focus:outline-none focus:border-white/60"
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
                    className={`px-4 py-2 rounded-[30px] border border-white/40 transition-all ${
                      tag.selected
                        ? 'bg-white text-black'
                        : 'bg-transparent text-white/60 hover:text-white'
                    }`}
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
              />
            </div>

            {/* 프롬프트 입력 */}
            <div>
              <label className="block text-white mb-2">프롬프트를 입력해주세요</label>
              <textarea
                placeholder="30대 아저씨가 슬프면서 애절하게 하지만 듣는사람은 웃긴 가사들로 구성해줘"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 bg-transparent border border-white/40 rounded-[30px] text-white placeholder-white/60 focus:outline-none focus:border-white/60 resize-none"
              />
            </div>

            {/* 제작하기 버튼 */}
            <button className="w-full px-6 py-4 bg-transparent border border-white/40 rounded-[30px] text-white hover:bg-white/10 transition-colors">
              제작하기
            </button>
          </div>
          <div className='mt-[50vh]'>
          <div className=" flex flex-col ">
            {/* 표지 */}
            <div>
              <label className="block text-white mb-4">표지</label>
              <div className="w-full h-[594px] border border-white/40 rounded-[10px] bg-transparent flex items-center justify-center">
                <span className="text-white/60">표지 이미지가 여기에 표시됩니다</span>
              </div>
            </div>

            {/* 가사 */}
            <div>
              <label className="block text-white mb-2">가사</label>
              <div className="w-full h-[76px] border border-white/40 rounded-[30px] bg-transparent flex items-center justify-center">
                <span className="text-white/60">생성된 가사가 여기에 표시됩니다</span>
              </div>
            </div>
          
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
