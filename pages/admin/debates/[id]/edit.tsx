import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../components/admin/AdminLayout';
import DebateForm, { DebateFormData } from '../../../../components/admin/DebateForm';

export default function EditDebate() {
  const router = useRouter();
  const { id } = router.query;
  
  const [initialData, setInitialData] = useState<DebateFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Existing Data & Transform to Form Format
  useEffect(() => {
    if (!id) return;

    const fetchDebate = async () => {
      try {
        const res = await fetch(`/api/debates/${id}`);
        if (!res.ok) throw new Error('Failed to load debate');
        
        const data = await res.json();

        // 🟢 HELPER: Convert HTML string back to Array for the Form
        // The form expects an array of strings. We try to extract text from <p> tags, 
        // or just wrap the whole text if it's simple.
        const parseArgs = (htmlContent: string | null) => {
          if (!htmlContent) return [''];
          // Simple regex to extract content between <p> tags
          const matches = htmlContent.match(/<p>(.*?)<\/p>/g);
          if (matches) {
            return matches.map(s => s.replace(/<\/?p>/g, ''));
          }
          // Fallback: split by newlines or just return raw text as one item
          return [htmlContent.replace(/<[^>]+>/g, '')]; 
        };

        // 🟢 MAP API (New Schema) -> FORM (Old Schema)
        setInitialData({
          title: data.title,
          slug: data.slug,
          
          // Map category -> topic
          topic: data.category, 
          
          summary: data.summary,
          
          // Map Names -> Labels
          faction1Label: data.proposerName,
          faction2Label: data.opposerName,
          
          // Map HTML String -> Array of Strings
          faction1Arguments: parseArgs(data.proposerArguments),
          faction2Arguments: parseArgs(data.opposerArguments),
          
          youtubeVideoId: data.youtubeVideoId,
          youtubeVideoTitle: data.title, // Fallback if video title isn't stored
          mainImageUrl: data.mainImageUrl,
          authorName: 'Imuhira Staff', // Default since we might not have it
          
          // Map Boolean -> String Status
          status: data.isPublished ? 'published' : 'draft',
          
          // Legacy field (can leave empty)
          verdict: '', 
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading debate');
      } finally {
        setLoading(false);
      }
    };

    fetchDebate();
  }, [id]);

  // 2. Handle Update (Submit Form -> API)
  const handleSubmit = async (data: DebateFormData) => {
    setIsSubmitting(true);
    setError(null);

    // 🟢 TRANSFORM DATA: Map Form fields -> API fields
    const payload = {
      title: data.title,
      slug: data.slug,
      category: (data.topic || 'politics').toLowerCase(), // Enforce lowercase
      summary: data.summary,
      
      proposerName: data.faction1Label || 'Proposer',
      opposerName: data.faction2Label || 'Opposer',

      // Convert Array -> HTML String
      proposerArguments: Array.isArray(data.faction1Arguments) 
        ? data.faction1Arguments.map(arg => `<p>${arg}</p>`).join('') 
        : data.faction1Arguments,

      opposerArguments: Array.isArray(data.faction2Arguments) 
        ? data.faction2Arguments.map(arg => `<p>${arg}</p>`).join('') 
        : data.faction2Arguments,

      youtubeVideoId: data.youtubeVideoId,
      mainImageUrl: data.mainImageUrl,
      isPublished: data.status === 'published',
    };

    try {
      const res = await fetch(`/api/debates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Failed to update debate');
      }

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