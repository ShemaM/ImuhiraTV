import useSWR from 'swr';

// 1. Define the shape YOUR UI EXPECTS (matches FeedPage)
export interface DebateUI {
  id: string;
  title: string;
  topic: string;
  summary: string;
  status: 'published' | 'draft';
  verdict?: string;
  createdAt: string;
  arguments: {
    idubu: { argument: string }[];
    akagara: { argument: string }[];
  };
}

// 2. Define the shape COMING FROM DB (matches Supabase/Drizzle)
interface DebateDB {
  id: string;
  title: string;
  topic: string;
  summary: string;
  status: 'published' | 'draft';
  verdict?: string | null;
  createdAt: string;
  faction1Arguments: string[];
  faction2Arguments: string[];
  faction1Label?: string;
  faction2Label?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDebates() {
  // Fetch raw data from your API
  const { data: dbDebates, error, isLoading } = useSWR<DebateDB[]>('/api/debates', fetcher);

  // 3. Transform DB data to UI data
  // This prevents your FeedPage from crashing because it expects nested objects
  const debates: DebateUI[] = dbDebates?.map((dbDebate) => ({
    id: dbDebate.id,
    title: dbDebate.title,
    topic: dbDebate.topic,
    summary: dbDebate.summary,
    status: dbDebate.status,
    verdict: dbDebate.verdict || undefined,
    createdAt: dbDebate.createdAt,
    arguments: {
      // Convert ["arg1"] -> [{ argument: "arg1" }]
      idubu: (dbDebate.faction1Arguments || []).map((arg) => ({ argument: arg })),
      akagara: (dbDebate.faction2Arguments || []).map((arg) => ({ argument: arg })),
    },
  })) || [];

  return {
    debates,
    isLoading,
    isError: error,
  };
}