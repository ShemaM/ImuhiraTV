// types/index.ts

export interface Argument {
  id: number;
  faction: 'idubu' | 'akagara';
  speakerName: string | null;
  argument: string;
  orderIndex: number | null;
}

export interface Debate {
  id: number;
  title: string;
  slug: string;
  topic: string;
  summary: string | null;
  verdict: string | null;
  status: 'draft' | 'published';
  publishedAt: string | null;
  mainImageUrl: string | null;
  youtubeVideoId: string | null;
  // This is the special structure your API returns
  arguments: {
    idubu: Argument[];
    akagara: Argument[];
  };
}