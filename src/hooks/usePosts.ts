import { usePostsStore } from '@/stores/postsStore';

export const usePosts = () => {
  const { posts, loading, error, fetchPosts, createPost, updatePost, deletePost, getPostById } = usePostsStore();

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    getPostById,
  };
};
