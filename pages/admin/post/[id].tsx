import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import AdminLayout from '../../../components/admin//AdminLayout';
import { LATEST_ARTICLES, FEATURED_ARTICLE, TRENDING_ARTICLES } from '../../../constants/mockData';

export default function EditPost() {
  const router = useRouter();
  const { id } = router.query;

  // Combine all articles into one array
  const allArticles = useMemo(() => [...LATEST_ARTICLES, FEATURED_ARTICLE, ...TRENDING_ARTICLES], []);

  const article = useMemo(() => {
    if (!id) return null;
    return allArticles.find(a => String(a.id) === String(id)) || null;
  }, [id, allArticles]);

  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(newTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Changes Saved! (Mock)");
    router.push('/admin/posts');
  };

  if (!article) return <AdminLayout title="Loading..."><div className="p-10">Loading article...</div></AdminLayout>;

  return (
    <AdminLayout title={`Edit: ${article.title}`}>
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
          
          <div>
            <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-1">Title</label>
            <input 
              id="title"
              type="text" 
              value={title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none" 
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-bold text-gray-700 mb-1">Slug</label>
            <input id="slug" required type="text" value={slug} readOnly placeholder="e.g., my-awesome-article" className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div>
              <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-1">Category</label>
              <select id="category" defaultValue={typeof article.category === 'object' ? article.category.name : article.category} className="w-full px-4 py-2 border rounded-lg">
                <option>Conflict Monitor</option>
                <option>Humanitarian</option>
                <option>Politics</option>
                <option>Culture</option>
                <option>Security</option>
              </select>
            </div>
            <div>
                <label htmlFor="author_name" className="block text-sm font-bold text-gray-700 mb-1">Author Name</label>
                <input id="author_name" required type="text" defaultValue={article.author_name} placeholder="e.g., John Doe" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none" />
            </div>
          </div>
          
          <div>
            <label htmlFor="main_image_url" className="block text-sm font-bold text-gray-700 mb-1">Main Image</label>
            <div className="mt-1 flex items-center space-x-4">
                {(selectedFile || article.main_image_url) && (
                  <img 
                    src={selectedFile ? URL.createObjectURL(selectedFile) : article.main_image_url} 
                    alt="Current" 
                    className="w-20 h-20 object-cover rounded-lg" 
                  />
                )}
                <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-slate-600 hover:text-slate-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-slate-500">
                        <span>{selectedFile ? 'Change image' : 'Upload image'}</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange}/>
                    </label>
                </div>
                {selectedFile && <p className="text-sm text-gray-500">{selectedFile.name}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-bold text-gray-700 mb-1">Excerpt</label>
            <textarea id="excerpt" required rows={3} defaultValue={article.excerpt} placeholder="A short summary of the article..." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none"></textarea>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-bold text-gray-700 mb-1">Content</label>
            <textarea id="content" defaultValue={"Full article content goes here..."} rows={15} className="w-full px-4 py-2 border rounded-lg"></textarea>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
             <button type="button" onClick={() => router.back()} className="px-6 py-2 text-gray-600 font-bold">Cancel</button>
             <button type="submit" className="px-8 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">Save Changes</button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}