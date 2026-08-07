import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/useAuth';
import { getBasePath } from '../lib/useBasePath';
import ErrorBoundary from './ErrorBoundary';

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export default function EditorPostList() {
  const { session } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;

    const fetchPosts = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('posts')
          .select('id, title, slug, published, created_at, updated_at')
          .eq('author_id', session.user?.id)
          .order('updated_at', { ascending: false });

        if (fetchError) throw fetchError;
        setPosts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [session]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setPosts(posts.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-300">Loading posts...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">My Posts</h2>
          <a
            href={getBasePath('/editor/new')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium transition"
          >
            + New Post
          </a>
        </div>

      {error && (
        <div className="p-4 bg-red-900 border border-red-700 rounded text-red-100">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 mb-4">No posts yet</p>
          <a
            href={getBasePath('/editor/new')}
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium transition"
          >
            Create your first post
          </a>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">{post.slug}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        post.published
                          ? 'bg-green-900 text-green-200'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                    <span className="px-3 py-1 rounded text-xs font-medium bg-slate-700 text-slate-300">
                      {new Date(post.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <a
                    href={getBasePath(`/editor/${post.id}`)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm font-medium transition"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="px-4 py-2 bg-red-900 hover:bg-red-800 rounded text-red-100 text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </ErrorBoundary>
) 
