import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
import DebateForm, { DebateFormData } from '../../../components/admin/DebateForm';

export default function NewDebate() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: DebateFormData) => {
    setIsSubmitting(true);
    setError(null);

    // 🟢 TRANSFORM DATA: Map old form fields to new API fields
    const payload = {
      title: data.title,
      slug: data.slug,
      
      // Map 'topic' -> 'category' (API requires 'category')
      category: data.topic || 'Politics', 
      
      summary: data.summary,
      
      // Map labels -> Proposer/Opposer Names
      proposerName: data.faction1Label || 'Proposer',
      opposerName: data.faction2Label || 'Opposer',

      // Map Arguments: Convert Array -> Single HTML String
      // If your form returns an array of strings, we join them into paragraphs.
      proposerArguments: Array.isArray(data.faction1Arguments) 
        ? data.faction1Arguments.map(arg => `<p>${arg}</p>`).join('') 
        : (data.faction1Arguments || ''),

      opposerArguments: Array.isArray(data.faction2Arguments) 
        ? data.faction2Arguments.map(arg => `<p>${arg}</p>`).join('') 
        : (data.faction2Arguments || ''),

      youtubeVideoId: data.youtubeVideoId,
      mainImageUrl: data.mainImageUrl,
      
      // Map status string -> boolean
      isPublished: data.status === 'published'
    };

    try {
      const response = await fetch('/api/debates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Send the transformed payload
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.details 
          ? `${errorData.error}: ${errorData.details}` 
          : (errorData.error || 'Failed to create debate');
        throw new Error(errorMessage);
      }

      router.push('/admin/debates');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Create New Debate">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
            {error}
          </div>
        )}
        <DebateForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </AdminLayout>
  );
}