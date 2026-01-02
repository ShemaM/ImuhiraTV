import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../components/admin/AdminLayout';
import DebateForm, { DebateFormData, Argument } from '../../../../components/admin/DebateForm';

interface DebateData {
  id: number;
  title: string;
  slug: string;
  topic: string;
  summary: string;
  verdict: string;
  youtubeVideoId: string;
  youtubeVideoTitle: string;
  mainImageUrl: string;
  authorName: string;
  status: 'draft' | 'published';
  arguments: {
    idubu: Argument[];
    akagara: Argument[];
  };
}

export default function EditDebate() {
  const router = useRouter();
  const { id } = router.query;
  const [debate, setDebate] = useState<DebateData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDebate = async () => {
      try {
        const response = await fetch(`/api/debates/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.details 
            ? `${errorData.error}: ${errorData.details}` 
            : (errorData.error || 'Failed to fetch debate');
          throw new Error(errorMessage);
        }
        const data = await response.json();
        setDebate(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDebate();
  }, [id]);

  const handleSubmit = async (data: DebateFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/debates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.details 
          ? `${errorData.error}: ${errorData.details}` 
          : (errorData.error || 'Failed to update debate');
        throw new Error(errorMessage);
      }

      router.push('/admin/debates');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Debate">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!debate) {
    return (
      <AdminLayout title="Edit Debate">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-6 text-center">
          <p>Debate not found</p>
          <button 
            onClick={() => router.push('/admin/debates')}
            className="mt-4 text-red-600 hover:text-red-800 underline"
          >
            Back to debates
          </button>
        </div>
      </AdminLayout>
    );
  }

  // Transform the data for the form
  const initialData = {
    title: debate.title,
    slug: debate.slug,
    topic: debate.topic,
    summary: debate.summary || '',
    verdict: debate.verdict,
    youtubeVideoId: debate.youtubeVideoId || '',
    youtubeVideoTitle: debate.youtubeVideoTitle || '',
    mainImageUrl: debate.mainImageUrl || '',
    authorName: debate.authorName || 'Imuhira Staff',
    status: debate.status,
    idubuArguments: debate.arguments.idubu.length > 0 
      ? debate.arguments.idubu.map(a => ({ speakerName: a.speakerName || '', argument: a.argument }))
      : [{ speakerName: '', argument: '' }],
    akagaraArguments: debate.arguments.akagara.length > 0 
      ? debate.arguments.akagara.map(a => ({ speakerName: a.speakerName || '', argument: a.argument }))
      : [{ speakerName: '', argument: '' }],
  };

  return (
    <AdminLayout title="Edit Debate">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
            {error}
          </div>
        )}
        <DebateForm 
          initialData={initialData}
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </AdminLayout>
  );
}
