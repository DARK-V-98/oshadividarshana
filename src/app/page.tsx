import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Code, Database, Server } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { projectsData } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const featuredProjects = projectsData.slice(0, 2);

  return (
    <main className="flex-1">
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
            Oshadi Vidarshana
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
            A passionate Full-Stack Developer creating modern, responsive, and user-friendly web applications.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/projects">View My Work</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32 bg-secondary">
        <div className="container">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
              My Expertise
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
              I specialize in building full-stack solutions with a focus on performance and user experience.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12 mt-12">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-primary text-primary-foreground rounded-full p-4">
                <Code className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Frontend</h3>
              <p className="text-muted-foreground">
                React, Next.js, TypeScript, Tailwind CSS. Building beautiful and performant UIs.
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-primary text-primary-foreground rounded-full p-4">
                <Database className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Backend</h3>
              <p className="text-muted-foreground">
                Node.js, Express, Firebase, PostgreSQL. Crafting robust and scalable server-side logic.
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-primary text-primary-foreground rounded-full p-4">
                <Server className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">DevOps & Cloud</h3>
              <p className="text-muted-foreground">
                Docker, Google Cloud, Vercel. Automating deployments and managing infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32">
        <div className="container">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
              Featured Projects
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
              Here are a few projects I've worked on recently.
            </p>
          </div>
          <div className="mx-auto grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:gap-12 mt-12">
            {featuredProjects.map((project) => {
              const projectImage = PlaceHolderImages.find(p => p.id === project.imageId);
              return (
                <Card key={project.title} className="overflow-hidden">
                  <CardHeader className="p-0">
                    {projectImage && (
                      <Image
                        src={projectImage.imageUrl}
                        alt={project.title}
                        width={600}
                        height={400}
                        className="rounded-t-lg object-cover w-full aspect-[3/2]"
                        data-ai-hint={projectImage.imageHint}
                      />
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="pb-2">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.tags.map(tag => (
                         <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 pb-6">
                    <Button asChild variant="outline">
                      <Link href={`/projects#${project.id}`}>Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
          <div className="mt-12 text-center">
             <Button asChild size="lg" variant="outline">
                <Link href="/projects">View All Projects</Link>
             </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
