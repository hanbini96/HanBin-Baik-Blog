# 🎨 Customization Guide

**How to customize the HanBin-Baik-Blog template for your needs**

This guide covers all the ways you can customize the template to make it your own, from simple styling changes to advanced functionality modifications.

---

## 📋 Table of Contents

1. [Quick Customizations](#-quick-customizations)
2. [Site Configuration](#-site-configuration)
3. [Styling & Theme](#-styling--theme)
4. [Layout & Structure](#-layout--structure)
5. [Content & Pages](#-content--pages)
6. [Components](#-components)
7. [Database & Backend](#-database--backend)
8. [Advanced Customizations](#-advanced-customizations)

---

## ⚡ Quick Customizations

### Change Site Title & Description

Edit `src/layouts/Base.astro`:

```astro
<head>
  <title>{title} | My Awesome Blog</title>
  <meta name="description" content="Welcome to my awesome blog about web development">
  <meta name="author" content="Your Name">
</head>
```

### Change Favicon

Replace `public/favicon.svg` with your own favicon:

```bash
# Generate favicon from image
# Use: https://favicon.io/ or similar service

# Replace the file
cp my-favicon.svg public/favicon.svg
```

### Change Default Meta Tags

Edit `src/layouts/Base.astro`:

```astro
<head>
  <!-- Open Graph / Social Media -->
  <meta property="og:title" content="My Awesome Blog">
  <meta property="og:description" content="Welcome to my blog">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://your-domain.com">
  <meta property="og:image" content="https://your-domain.com/images/og-image.jpg">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="My Awesome Blog">
  <meta name="twitter:description" content="Welcome to my blog">
  <meta name="twitter:image" content="https://your-domain.com/images/twitter-image.jpg">
</head>
```

---

## 🔧 Site Configuration

### Update Site URL

Edit `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://your-domain.com',  // ← Change this
  // ...
});
```

### Change Base Path (for GitHub Pages)

If using GitHub Pages with a project site (not custom domain):

```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://your-username.github.io',
  base: '/my-blog',  // ← Add this for project sites
  // ...
});
```

### Configure Markdown

Edit `astro.config.mjs`:

```javascript
markdown: {
  shikiConfig: {
    theme: 'github-dark',  // Change theme
    // Available themes: 'github-dark', 'github-light', 'dracula', etc.
  },
  remarkPlugins: [
    // Add remark plugins here
  ],
  rehypePlugins: [
    // Add rehype plugins here
  ],
}
```

---

## 🎨 Styling & Theme

### Change Color Scheme

Edit `tailwind.config.cjs`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',  // Main primary color
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Secondary colors
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',  // Main secondary color
          600: '#059669',
        },
        // Accent colors
        accent: {
          500: '#8b5cf6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
};
```

### Add Custom CSS

Edit `src/styles/global.css`:

```css
/* Custom CSS variables */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
  --bg-color: #ffffff;
  --text-color: #1f2937;
  --border-radius: 0.5rem;
  --box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Dark mode */
.dark {
  --bg-color: #111827;
  --text-color: #f9fafb;
}

/* Base styles */
body {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
}

/* Custom utility classes */
.btn-primary {
  @apply bg-primary-500 text-white px-4 py-2 rounded-md 
         hover:bg-primary-600 transition-colors;
}

.btn-secondary {
  @apply bg-secondary-500 text-white px-4 py-2 rounded-md 
         hover:bg-secondary-600 transition-colors;
}
```

### Use Custom Fonts

1. **Add font to `src/layouts/Base.astro`:**

```astro
<head>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Or self-hosted -->
  <link rel="stylesheet" href="/fonts/inter.css">
</head>
```

2. **Update `tailwind.config.cjs`:**

```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
}
```

### Dark Mode

Enable dark mode in `tailwind.config.cjs`:

```javascript
module.exports = {
  darkMode: 'class',  // or 'media' for system preference
  // ...
};
```

Then add dark mode toggle:

```astro
<!-- In your Nav component -->
<button 
  id="darkModeToggle"
  class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
  onclick="toggleDarkMode()"
>
  <svg class="w-5 h-5 hidden dark:block" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
  </svg>
  <svg class="w-5 h-5 dark:hidden" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path>
  </svg>
</button>

<script>
  function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
  }
  
  // Check for saved preference
  if (localStorage.getItem('darkMode') === 'true' || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches && 
       localStorage.getItem('darkMode') === null)) {
    document.documentElement.classList.add('dark');
  }
</script>
```

---

## 🏗️ Layout & Structure

### Modify Base Layout

Edit `src/layouts/Base.astro`:

```astro
---
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title?: string;
  description?: string;
}

const { title = 'My Blog', description = 'Welcome to my blog' } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content={description}>
    <title>{title}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  </head>
  <body class="min-h-screen flex flex-col">
    <header>
      <Nav />
    </header>
    <main class="flex-grow">
      <slot />
    </main>
    <footer>
      <Footer />
    </footer>
  </body>
</html>
```

### Create New Layout

Create `src/layouts/BlogPost.astro`:

```astro
---
import Base from './Base.astro';

interface Props {
  title: string;
  date: string;
  tags?: string[];
}

const { title, date, tags = [] } = Astro.props;
---

<Base title={title}>
  <article class="max-w-4xl mx-auto px-4 py-8">
    <header class="mb-8">
      <h1 class="text-4xl font-bold mb-2">{title}</h1>
      <div class="flex items-center text-gray-500 text-sm">
        <time datetime={date}>{new Date(date).toLocaleDateString()}</time>
        {tags.length > 0 && (
          <div class="ml-4">
            {tags.map(tag => (
              <span class="mr-2">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </header>
    <div class="prose prose-lg max-w-none">
      <slot />
    </div>
  </article>
</Base>
```

### Add Sidebar

Create `src/components/Sidebar.astro`:

```astro
---
interface Props {
  categories?: string[];
  tags?: string[];
}

const { categories = [], tags = [] } = Astro.props;
---

<aside class="w-64 p-4">
  <h2 class="text-xl font-bold mb-4">Categories</h2>
  <ul class="space-y-2 mb-6">
    {categories.map(category => (
      <li>
        <a href={`/categories/${category}`} class="hover:text-primary-500">
          {category}
        </a>
      </li>
    ))}
  </ul>
  
  <h2 class="text-xl font-bold mb-4">Tags</h2>
  <div class="flex flex-wrap gap-2">
    {tags.map(tag => (
      <a href={`/tags/${tag}`} class="px-2 py-1 bg-gray-100 rounded text-sm">
        {tag}
      </a>
    ))}
  </div>
</aside>
```

---

## ✍️ Content & Pages

### Create a New Page

1. **Create file in `src/pages/`:**
   ```bash
   touch src/pages/contact.astro
   ```

2. **Add content:**
   ```astro
   ---
   import Base from '../layouts/Base.astro';
   ---
   
   <Base title="Contact Me" description="Get in touch with me">
     <div class="max-w-2xl mx-auto px-4 py-8">
       <h1 class="text-3xl font-bold mb-6">Contact Me</h1>
       <p class="mb-6">Feel free to reach out to me for any questions or collaborations.</p>
       
       <form class="space-y-4">
         <div>
           <label for="name" class="block text-sm font-medium mb-1">Name</label>
           <input 
             type="text" 
             id="name" 
             name="name"
             class="w-full p-2 border rounded-md"
             required
           >
         </div>
         <div>
           <label for="email" class="block text-sm font-medium mb-1">Email</label>
           <input 
             type="email" 
             id="email" 
             name="email"
             class="w-full p-2 border rounded-md"
             required
           >
         </div>
         <div>
           <label for="message" class="block text-sm font-medium mb-1">Message</label>
           <textarea 
             id="message" 
             name="message"
             rows="5"
             class="w-full p-2 border rounded-md"
             required
           ></textarea>
         </div>
         <button 
           type="submit"
           class="btn-primary"
         >
           Send Message
         </button>
       </form>
     </div>
   </Base>
   ```

### Create a Blog Post

1. **Create markdown file:**
   ```bash
   touch src/pages/blog/2026-11-18-my-post.md
   ```

2. **Add frontmatter and content:**
   ```markdown
   ---
   title: My Awesome Blog Post
   description: This is a detailed guide about something interesting
   date: 2026-11-18
   tags:
     - web-development
     - tutorial
   category: Tutorials
   draft: false
   featured: true
   readingTime: 10
   ---
   
   # My Awesome Blog Post
   
   ## Introduction
   
   This is the introduction to my blog post.
   
   ## Main Content
   
   Here's the main content with some **bold text** and *italic text*.
   
   ### Code Example
   
   ```javascript
   function helloWorld() {
     console.log('Hello, World!');
   }
   ```
   
   ### List
   
   - Item 1
   - Item 2
   - Item 3
   
   ## Conclusion
   
   This is the conclusion.
   ```

### Create Dynamic Pages

Create `src/pages/blog/[slug].astro`:

```astro
---
import Base from '../../layouts/Base.astro';

// Get all blog posts
const posts = await Astro.glob('../blog/*.md');

// Find the post with matching slug
const post = posts.find(p => p.url.pathname === `/blog/${Astro.params.slug}/`) || 
             posts.find(p => p.url.pathname === `/blog/${Astro.params.slug}`);

if (!post) {
  return Response.redirect('/404', 404);
}

const { Content, title, date, description, tags } = post;
---

<Base title={title} description={description}>
  <article class="max-w-4xl mx-auto px-4 py-8">
    <header class="mb-8">
      <h1 class="text-4xl font-bold mb-2">{title}</h1>
      <div class="flex items-center text-gray-500 text-sm mb-4">
        <time datetime={date}>{new Date(date).toLocaleDateString()}</time>
      </div>
      {description && <p class="text-lg text-gray-600">{description}</p>}
    </header>
    
    <div class="prose prose-lg max-w-none">
      <Content />
    </div>
    
    {tags && tags.length > 0 && (
      <footer class="mt-8 pt-4 border-t">
        <div class="flex flex-wrap gap-2">
          {tags.map(tag => (
            <a 
              href={`/tags/${tag}`} 
              class="px-2 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
            >
              #{tag}
            </a>
          ))}
        </div>
      </footer>
    )}
  </article>
</Base>
```

### Create Tag Pages

Create `src/pages/tags/[tag].astro`:

```astro
---
import Base from '../../layouts/Base.astro';

const tag = Astro.params.tag;
const posts = await Astro.glob('../../blog/*.md');
const filteredPosts = posts.filter(post => 
  post.frontmatter.tags?.includes(tag)
);
---

<Base title={`Tag: ${tag}`} description={`Posts tagged with ${tag}`}>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Tag: {tag}</h1>
    <p class="mb-8">Found {filteredPosts.length} post(s)</p>
    
    <div class="space-y-6">
      {filteredPosts.map(post => (
        <article class="p-4 border rounded-lg">
          <h2 class="text-xl font-bold mb-2">
            <a href={`/blog/${post.url.pathname.split('/').pop()}`}>
              {post.frontmatter.title}
            </a>
          </h2>
          <p class="text-gray-500 text-sm mb-2">
            {new Date(post.frontmatter.date).toLocaleDateString()}
          </p>
          <p class="text-gray-600">{post.frontmatter.description}</p>
          <a 
            href={`/blog/${post.url.pathname.split('/').pop()}`} 
            class="text-primary-500 hover:text-primary-600 font-medium"
          >
            Read more →
          </a>
        </article>
      ))}
    </div>
  </div>
</Base>
```

---

## 🧩 Components

### Create a Reusable Button Component

Create `src/components/Button.astro`:

```astro
---
interface Props {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const {
  variant = 'primary',
  size = 'md',
  disabled = false
} = Astro.props;

const baseClasses = 'rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

const variants = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
  secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const classes = `${baseClasses} ${variants[variant]} ${sizes[size]}`;
---

<button
  {...Astro.props}
  class={classes}
  disabled={disabled}
>
  <slot />
</button>
```

Use it:
```astro
<Button variant="primary" size="lg">Click Me</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="outline" disabled>Disabled</Button>
```

### Create a Card Component

Create `src/components/Card.astro`:

```astro
---
interface Props {
  title: string;
  description?: string;
  image?: string;
  href?: string;
}

const { title, description, image, href } = Astro.props;
---

<div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
  {image && (
    <img 
      src={image} 
      alt={title}
      class="w-full h-48 object-cover"
      loading="lazy"
    >
  )}
  <div class="p-6">
    <h3 class="text-xl font-bold mb-2">{title}</h3>
    {description && <p class="text-gray-600 mb-4">{description}</p>}
    {href && (
      <a 
        href={href}
        class="text-primary-500 hover:text-primary-600 font-medium"
      >
        Learn more →
      </a>
    )}
  </div>
</div>
```

### Create a React Component

Create `src/components/Counter.tsx`:

```tsx
import { useState } from 'react';

interface CounterProps {
  initialValue?: number;
}

export default function Counter({ initialValue = 0 }: CounterProps) {
  const [count, setCount] = useState(initialValue);

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => setCount(count - 1)}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        -
      </button>
      <span className="text-xl font-medium">{count}</span>
      <button
        onClick={() => setCount(count + 1)}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        +
      </button>
    </div>
  );
}
```

Use it in Astro:
```astro
---
import Counter from '../components/Counter.tsx';
---

<Counter initialValue={5} client:load />
```

---

## 🗃️ Database & Backend

### Set Up Supabase Client

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Create a Database Component

Create `src/components/PostList.tsx`:

```tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <article key={post.id} className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="text-gray-500 text-sm">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
          <p className="mt-2">{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

### Add Real-time Updates

Update the component to use real-time:

```tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Initial fetch
    fetchPosts();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('posts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        fetchPosts
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    setPosts(data);
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <article key={post.id} className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="text-gray-500 text-sm">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
          <p className="mt-2">{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

---

## 🚀 Advanced Customizations

### Add Analytics

Create `src/components/Analytics.astro`:

```astro
---
const gaId = import.meta.env.PUBLIC_GA_ID;
const isProduction = import.meta.env.MODE === 'production';
---

{isProduction && gaId && (
  <>
    <!-- Google Analytics -->
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '{gaId}');
    </script>
    
    <!-- Plausible Analytics (Alternative) -->
    <script defer data-domain="your-domain.com" src="https://plausible.io/js/script.js"></script>
  </>
)}
```

Add to `Base.astro`:
```astro
<head>
  <Analytics />
</head>
```

### Add Search Functionality

Create `src/components/Search.astro`:

```astro
---
import { useState } from 'react';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // In a real app, you would fetch from an API or search index
  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic here
    console.log('Searching for:', query);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-full p-2 border rounded-md pr-10"
      />
      <button
        type="submit"
        className="absolute right-2 top-2 p-1"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  );
};
---

<Search client:load />
```

### Add Comments

Create `src/components/Comments.tsx`:

```tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Comment {
  id: string;
  content: string;
  author: string;
  created_at: string;
  post_id: string;
}

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  async function fetchComments() {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });
    setComments(data);
  }

  async function addComment(e: React.FormEvent) {
    e.preventDefault();
    
    const { error } = await supabase
      .from('comments')
      .insert([
        { content: newComment, author, post_id: postId }
      ]);
    
    if (!error) {
      setNewComment('');
      setAuthor('');
      fetchComments();
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments ({comments.length})</h2>
      
      <form onSubmit={addComment} className="mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Comment</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={4}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Add Comment
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <h3 className="font-bold">{comment.author}</h3>
              <span className="text-sm text-gray-500">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Add Newsletter Subscription

Create `src/components/Newsletter.tsx`:

```tsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const { error } = await supabase
      .from('subscribers')
      .insert([{ email }]);
    
    if (error) {
      setMessage('Error subscribing. Please try again.');
    } else {
      setMessage('Thanks for subscribing!');
      setEmail('');
      setIsSubscribed(true);
    }
  }

  if (isSubscribed) {
    return (
      <div className="p-4 bg-green-50 rounded-lg">
        <p className="text-green-700">Thanks for subscribing!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Subscribe to Newsletter
        </label>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-grow p-2 border rounded-md"
            required
          />
          <button type="submit" className="btn-primary whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </div>
      {message && (
        <p className={`text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
    </form>
  );
}
```

---

## 🎯 Customization Checklist

- [ ] Updated site title and description
- [ ] Changed favicon
- [ ] Configured custom domain
- [ ] Updated color scheme
- [ ] Added custom fonts
- [ ] Modified layout
- [ ] Created new pages
- [ ] Added blog posts
- [ ] Created reusable components
- [ ] Set up Supabase (if needed)
- [ ] Added analytics
- [ ] Added search functionality
- [ ] Added comments
- [ ] Added newsletter subscription

---

## 📚 Additional Resources

- **[Astro Documentation](https://docs.astro.build/)** - Official Astro docs
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Tailwind documentation
- **[Supabase Documentation](https://supabase.com/docs)** - Supabase guides
- **[React Documentation](https://react.dev/)** - React docs

---

## 💬 Need More Help?

- **Check [TEMPLATE.md](TEMPLATE.md)** for quick start
- **Check [SETUP_GUIDE.md](SETUP_GUIDE.md)** for detailed setup
- **Check [ARCHITECTURE.md](ARCHITECTURE.md)** for technical details
- **Check [DEPLOYMENT.md](DEPLOYMENT.md)** for hosting options

---

**Happy customizing! 🎨**

*Customization guide for HanBin-Baik-Blog template*
