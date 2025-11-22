import { create } from 'zustand';

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  createPost: (title: string, body: string, userId: number) => Promise<void>;
  updatePost: (id: number, title: string, body: string) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
  getPostById: (id: number) => Post | undefined;
}

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await response.json();
      
      // Add timestamps to posts
      const postsWithTimestamps = data.slice(0, 20).map((post: any) => ({
        ...post,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      
      set({ posts: postsWithTimestamps, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch posts', loading: false });
    }
  },

  createPost: async (title: string, body: string, userId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
          title,
          body,
          userId,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const data = await response.json();
      
      const newPost = {
        ...data,
        id: Date.now(), // Use timestamp for unique ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      set(state => ({ 
        posts: [newPost, ...state.posts], 
        loading: false 
      }));
    } catch (error) {
      set({ error: 'Failed to create post', loading: false });
      throw error;
    }
  },

  updatePost: async (id: number, title: string, body: string) => {
    set({ loading: true, error: null });
    try {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          id,
          title,
          body,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      
      set(state => ({
        posts: state.posts.map(post =>
          post.id === id
            ? { ...post, title, body, updatedAt: new Date().toISOString() }
            : post
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update post', loading: false });
      throw error;
    }
  },

  deletePost: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'DELETE',
      });
      
      set(state => ({
        posts: state.posts.filter(post => post.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete post', loading: false });
      throw error;
    }
  },

  getPostById: (id: number) => {
    return get().posts.find(post => post.id === id);
  },
}));
