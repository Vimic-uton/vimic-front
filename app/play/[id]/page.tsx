import PlayView from '@/features/play/PlayView';

export default function PlayPage({ params }: { params: { id: string } }) {
  return <PlayView id={params.id} />;
}
