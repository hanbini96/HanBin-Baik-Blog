import { useState } from 'react';
import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your post content in markdown...',
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    // reset height to allow shrink
    el.style.height = 'auto';
    // set height to scrollHeight so it expands with content
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Content</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm transition hidden sm:inline-block"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-96">
        {/* Editor */}
        <div className="flex flex-col">
          <label className="text-xs font-medium text-slate-400 mb-2">
            Markdown
          </label>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded font-mono text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 overflow-hidden"
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="hidden sm:flex flex-col">
            <label className="text-xs font-medium text-slate-400 mb-2">
              Preview
            </label>
            <div className="px-4 py-3 bg-slate-800 border border-slate-600 rounded overflow-auto prose prose-invert prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value || 'Preview will appear here...'}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Preview */}
      <div className="sm:hidden">
        <label className="text-xs font-medium text-slate-400 mb-2 block">
          Preview
        </label>
        <div className="px-4 py-3 bg-slate-800 border border-slate-600 rounded overflow-auto prose prose-invert prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {value || 'Preview will appear here...'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
