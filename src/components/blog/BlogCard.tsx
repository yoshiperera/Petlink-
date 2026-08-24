import { Calendar, Clock, Tag, User, ArrowRight } from "lucide-react";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-pink-brand px-2.5 py-1 text-xs font-semibold text-pink-900">
          <Tag className="h-3 w-3" /> {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug text-foreground">{post.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <User className="h-3 w-3" /> {post.author}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {post.date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {post.readTime}
          </span>
        </div>
        <button className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-green-brand px-4 py-2 text-sm font-semibold text-green-900 transition hover:brightness-95">
          Read More <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
