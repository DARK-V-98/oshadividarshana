import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { blogPostsData } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { format } from "date-fns";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Oshadi Vidarshana',
  description: 'Thoughts and tutorials on web development, technology, and more from Oshadi Vidarshana.',
};

export default function BlogPage() {
  return (
    <main className="container my-12 md:my-24">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
          My Blog
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
          Sharing thoughts on technology, development, and life.
        </p>
      </section>

      <section className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((post) => {
          const postImage = PlaceHolderImages.find(p => p.id === post.imageId);
          return (
              <Card key={post.slug} className="h-full flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <CardHeader className="p-0">
                    {postImage && (
                      <div className="overflow-hidden rounded-t-lg">
                         <Image
                            src={postImage.imageUrl}
                            alt={post.title}
                            width={600}
                            height={400}
                            className="object-cover w-full aspect-[3/2] transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={postImage.imageHint}
                         />
                      </div>
                    )}
                    <div className="p-6">
                      <CardTitle className="leading-snug hover:text-primary transition-colors">{post.title}</CardTitle>
                      <CardDescription className="pt-2">
                        {format(new Date(post.date), "MMMM d, yyyy")}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow p-6 pt-0">
                    <p className="text-muted-foreground">{post.summary}</p>
                  </CardContent>
                </Link>
              </Card>
          );
        })}
      </section>
    </main>
  );
}
