import AboutView from '@/features/about/aboutView';

export default async function aboutpage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <AboutView id={resolvedParams.id} />;
}

