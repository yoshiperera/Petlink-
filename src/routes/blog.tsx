import { createFileRoute } from "@tanstack/react-router";
import { MainLayout } from "@/layouts/MainLayout";
import { BlogCard, type BlogPost } from "@/components/blog/BlogCard";
import { Newsletter } from "@/components/blog/Newsletter";

const posts: BlogPost[] = [
  {
    id: "1",
    title: "How to Create an Effective Lost Pet Poster",
    excerpt:
      "Learn the essential elements that make a lost pet poster effective and increase your chances of finding your beloved companion.",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=900&q=80",
    category: "Tips",
    author: "Emma Rodriguez",
    date: "1/22/2025",
    readTime: "6 min read",
  },
  {
    id: "2",
    title: "Understanding Pet Microchipping: A Complete Guide",
    excerpt:
      "Everything you need to know about microchipping your pet, from the procedure to maintaining updated information.",
    image: "https://images.unsplash.com/photo-1583511666445-775f1f2116f5?w=900&q=80",
    category: "Health",
    author: "Dr. Michael Chen",
    date: "1/20/2025",
    readTime: "8 min read",
  },
  {
    id: "3",
    title: "Building a Pet-Safe Community: Neighborhood Tips",
    excerpt:
      "Discover how communities can work together to create safer environments for pets and prevent them from getting lost.",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=900&q=80",
    category: "Community",
    author: "Lisa Thompson",
    date: "1/18/2025",
    readTime: "7 min read",
  },
];

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Pet Care, Tips & Stories | Petlink" },
      {
        name: "description",
        content: "Articles, guides, and tips for pet owners and community members.",
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <h1 className="text-4xl text-foreground">Latest Posts</h1>
          <p className="text-sm text-muted-foreground">
            Showing {posts.length} of {posts.length} posts
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      </div>
      <Newsletter />
    </MainLayout>
  );
}

