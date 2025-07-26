'use client';

type PlayViewProps = { id?: string };

export default function PlayView({ id }: PlayViewProps) {
  // id가 없을 때와 있을 때 모두 동작하도록 설계
  return <div>Play {id ?? '(no id)'}</div>;
}
