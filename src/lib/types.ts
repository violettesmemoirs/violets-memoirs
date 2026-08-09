export type Poem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  published: boolean;
  created_at: string;
};

export type Profile = {
  id: string;
  display_name: string;
  role: 'admin' | 'subscriber';
  created_at: string;
};

export type CommentRow = {
  id: string;
  poem_id: string;
  author_id: string;
  body: string;
  created_at: string;
  profiles?: { display_name: string } | null;
};

export type Thread = {
  id: string;
  title: string;
  body: string;
  author_id: string;
  created_at: string;
  profiles?: { display_name: string } | null;
};

export type Reply = {
  id: string;
  thread_id: string;
  body: string;
  author_id: string;
  created_at: string;
  profiles?: { display_name: string } | null;
};

export type ChatMessage = {
  id: string;
  author_id: string;
  body: string;
  created_at: string;
  profiles?: { display_name: string } | null;
};
