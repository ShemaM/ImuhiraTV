import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../components/admin/AdminLayout';
import DebateForm, { DebateFormData } from '../../../../components/admin/DebateForm';

interface ArgumentApiData {
  argument: string;
}

export default function EditDebate() {
  const router = useRouter();
  const { id } = router.query;
  
  const [initialData, setInitialData] = useState<DebateFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Existing Data
  useEffect(() => {
    if (!id) return;

    const fetchDebate = async () => {
      try {
        const res = await fetch(`/api/debates/${id}`);
        if (!res.ok) throw new Error('Failed to load debate');
        
        const data = await res.json();

        // 🟢 Transform API data back to Form format
        setInitialData({
          title: data.title,
          slug: data.slug,
          topic: data.topic,
          summary: data.summary,
          verdict: data.verdict,
          youtubeVideoId: data.youtubeVideoId,
          youtubeVideoTitle: data.youtubeVideoTitle,
          mainImageUrl: data.mainImageUrl,
          authorName: data.authorName,
          status: data.status,
          faction1Label: data.faction1Label,
          faction2Label: data.faction2Label,
          // Extract argument strings from objects
          faction1Arguments: data.arguments.faction1.map((a: ArgumentApiData) => a.argument),
          faction2Arguments: data.arguments.faction2.map((a: ArgumentApiData) => a.argument),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading debate');
      } finally {
        setLoading(false);
      }
    };

    fetchDebate();
  }, [id]);

  // 2. Handle Update
  const handleSubmit = async (data: DebateFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/debates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to update debate');

      router.push('/admin/debates');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      setIsSubmitting(false);
    }
  };

  if (loading) return <AdminLayout title="Edit Debate"><div className="p-8 text-center">Loading...</div></AdminLayout>;
  if (error) return <AdminLayout title="Error"><div className="text-red-500 p-8">{error}</div></AdminLayout>;

  return (
    <AdminLayout title="Edit Debate">
      {/* 🟢 Reusing the DebateForm with initialData */}
      {initialData && (
        <DebateForm 
          initialData={initialData} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      )}
    </AdminLayout>
  );
}