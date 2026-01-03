import { notFound } from "next/navigation";
import Image from "next/image";
import { blogPostsData } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { format } from "date-fns";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return blogPostsData.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPostsData.find(p => p.slug === params.slug);
  if (!post) {
    return {
      title: 'Post Not Found'
    };
  }
  return {
    title: `${post.title} | Oshadi Vidarshana`,
    description: post.summary,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPostsData.find(p => p.slug === params.slug);

  if (!post) {
    notFound();
  }
  
  const postImage = PlaceHolderImages.find(p => p.id === post.imageId);

  return (
    <main className="container my-12 md:my-24">
      <article className="prose prose-lg dark:prose-invert mx-auto max-w-4xl">
        {postImage && (
          <Image
            src={postImage.imageUrl}
            alt={post.title}
            width={800}
            height={450}
            className="rounded-lg object-cover w-full aspect-video mb-8"
            data-ai-hint={postImage.imageHint}
            priority
          />
        )}
        <h1 className="!mb-2">{post.title}</h1>
        <p className="text-muted-foreground text-base mt-0">
          Posted on {format(new Date(post.date), "MMMM d, yyyy")}
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </main>
  );
}
