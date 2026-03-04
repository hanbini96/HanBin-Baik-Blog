import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/useAuth';
import { getBasePath } from '../lib/useBasePath';
import MarkdownEditor from './MarkdownEditor';

interface PostEditorProps {
  postId?: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
}

export default function PostEditor({ postId }: PostEditorProps) {
  const { session } = useAuth();
  const [post, setPost] = useState<Post>({
    id: '',
    title: '',
    slug: '',
    content: '',
    published: false,
  });
  const [loading, setLoading] = useState(!!postId && postId !== 'new');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!postId || postId === 'new' || !session) return;

    const fetchPost = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('posts')
          .select('*')
          .eq('id', postId)
          .eq('author_id', session.user?.id)
          .single();

        if (fetchError) throw fetchError;
        if (data) {
          setPost(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, session]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setPost((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleSave = async (publish: boolean = false) => {
    if (!session || !post.title || !post.slug || !post.content) {
      setError('Please fill in all required fields');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      if (postId && postId !== 'new') {
        // Update existing post
        const { error: updateError } = await supabase
          .from('posts')
          .update({
            title: post.title,
            slug: post.slug,
            content: post.content,
            published: publish,
            published_at: publish ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', postId);

        if (updateError) throw updateError;
      } else {
        // Create new post
        const { error: createError } = await supabase.from('posts').insert([
          {
            title: post.title,
            slug: post.slug,
            content: post.content,
            published: publish,
            published_at: publish ? new Date().toISOString() : null,
            author_id: session.user?.id,
          },
        ]);

        if (createError) throw createError;
      }

      setSuccess(true);
      if (publish) {
        setTimeout(() => {
          window.location.href = getBasePath('/editor');
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-300">Loading post...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">
          {postId && postId !== 'new' ? 'Edit Post' : 'Create New Post'}
        </h2>
        <a
          href={getBasePath('/editor')}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white font-medium transition"
        >
          ← Back
        </a>
      </div>

      {error && (
        <div className="p-4 bg-red-900 border border-red-700 rounded text-red-100">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-900 border border-green-700 rounded text-green-100">
          Post saved successfully!
        </div>
      )}

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={post.title}
            onChange={handleTitleChange}
            placeholder="Post title"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Slug *
          </label>
          <input
            type="text"
            value={post.slug}
            onChange={(e) => setPost({ ...post, slug: e.target.value })}
            placeholder="post-slug"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-slate-400 mt-1">
            URL-friendly identifier for your post
          </p>
        </div>

        {/* Markdown Editor */}
        <MarkdownEditor
          value={post.content}
          onChange={(content) => setPost({ ...post, content })}
        />

        {/* Buttons */}
        <div className="flex gap-4 pt-6 border-t border-slate-700">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700 disabled:cursor-not-allowed rounded text-white font-medium transition"
          >
            {saving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-600 disabled:cursor-not-allowed rounded text-white font-medium transition"
          >
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}
