// pages/feed.tsx
import { useDebates } from '../hooks/useDebates';
import Head from 'next/head';

export default function FeedPage() {
  const { debates, isLoading, isError } = useDebates();

  if (isLoading) return <div className="p-10 text-center text-gray-500">Loading debates...</div>;
  if (isError) return <div className="p-10 text-center text-red-500">Failed to load debates.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Daily Pulse | Debate Feed</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Latest Debates</h1>

        <div className="grid gap-6">
          {debates.map((debate) => (
            <div key={debate.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              
              {/* Card Header */}
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                      {debate.topic}
                    </span>
                    <h2 className="text-xl font-semibold text-gray-900">{debate.title}</h2>
                  </div>
                  {debate.status === 'published' && (
                     <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                       Published
                     </span>
                  )}
                </div>

                <p className="mt-2 text-gray-600 line-clamp-2">{debate.summary}</p>
                
                {/* Verdict Section */}
                {debate.verdict && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-100">
                    <span className="text-sm font-semibold text-gray-700">Verdict: </span>
                    <span className="text-sm text-gray-800 italic">{debate.verdict}</span>
                  </div>
                )}
              </div>

              {/* Arguments Preview */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Idubu Arguments</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {debate.arguments.idubu.slice(0, 2).map((arg, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {arg.argument}
                      </li>
                    ))}
                    {debate.arguments.idubu.length === 0 && <li className="italic text-gray-400">No arguments yet</li>}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Akagara Arguments</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {debate.arguments.akagara.slice(0, 2).map((arg, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        {arg.argument}
                      </li>
                    ))}
                    {debate.arguments.akagara.length === 0 && <li className="italic text-gray-400">No arguments yet</li>}
                  </ul>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}