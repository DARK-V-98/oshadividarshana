import Image from "next/image";
import Link from "next/link";
import { Github, ExternalLink } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { projectsData } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Oshadi Vidarshana',
  description: 'Explore a collection of projects by Oshadi Vidarshana, showcasing his skills in web development.',
};

export default function ProjectsPage() {
  return (
    <main className="container my-12 md:my-24">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
          My Projects
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
          A collection of my work, from web apps to open-source libraries.
        </p>
      </section>

      <section className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsData.map((project) => {
          const projectImage = PlaceHolderImages.find(p => p.id === project.imageId);
          return (
            <Card key={project.id} id={project.id} className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="p-0">
                {projectImage && (
                  <div className="mb-4 overflow-hidden rounded-t-lg">
                    <Image
                      src={projectImage.imageUrl}
                      alt={project.title}
                      width={600}
                      height={400}
                      className="object-cover w-full aspect-[3/2] transition-transform duration-300 hover:scale-105"
                      data-ai-hint={projectImage.imageHint}
                    />
                  </div>
                )}
                 <div className="px-6">
                    <CardTitle>{project.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow px-6 pt-4">
                <p className="text-muted-foreground">{project.description}</p>
              </CardContent>
              <CardFooter className="flex justify-start gap-2 px-6 pb-6">
                {project.githubUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={project.githubUrl} target="_blank">
                      <Github className="mr-2 h-4 w-4" /> GitHub
                    </Link>
                  </Button>
                )}
                {project.demoUrl && (
                  <Button variant="default" size="sm" asChild>
                    <Link href={project.demoUrl} target="_blank">
                      <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
