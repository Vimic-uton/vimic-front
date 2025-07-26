import PlayView from '@/features/play/PlayView';

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <PlayView id={resolvedParams.id} />;
}

