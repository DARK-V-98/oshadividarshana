import Image from "next/image";
import { Code, Server, Zap } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card } from "@/components/ui/card";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Oshadi Vidarshana',
  description: 'Learn more about Oshadi Vidarshana, his background, skills, and expertise in full-stack development.',
};

const skills = [
  { name: 'JavaScript', icon: Code },
  { name: 'TypeScript', icon: Code },
  { name: 'React', icon: Code },
  { name: 'Next.js', icon: Code },
  { name: 'Node.js', icon: Code },
  { name: 'Python', icon: Code },
  { name: 'Firebase', icon: Server },
  { name: 'PostgreSQL', icon: Server },
  { name: 'Docker', icon: Server },
  { name: 'Tailwind CSS', icon: Code },
  { name: 'REST APIs', icon: Zap },
  { name: 'GraphQL', icon: Zap },
];

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find(p => p.id === 'ov-about');
  
  return (
    <main className="container my-12 md:my-24">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
          About Me
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
          Innovator, Problem-Solver, and Lifelong Learner.
        </p>
      </section>

      <section className="mt-12 md:mt-20 grid md:grid-cols-3 gap-12 items-center">
        <div className="md:col-span-1 flex justify-center">
          {aboutImage && (
            <Image
              src={aboutImage.imageUrl}
              alt="Oshadi Vidarshana"
              width={300}
              height={300}
              className="rounded-full object-cover aspect-square shadow-lg"
              data-ai-hint={aboutImage.imageHint}
            />
          )}
        </div>
        <div className="md:col-span-2 space-y-4 text-lg text-muted-foreground">
          <p>
            Hello! I'm Oshadi, a full-stack software engineer with a deep passion for technology and building beautiful, functional applications from the ground up. My journey in software development started with a simple "Hello, World!" and has since grown into a full-fledged career where I get to solve complex problems and bring ideas to life.
          </p>
          <p>
            I thrive in collaborative environments and am always eager to learn new technologies and methodologies. My expertise lies in the JavaScript ecosystem, particularly with React and Next.js for the frontend, and Node.js for the backend. I believe in writing clean, maintainable, and scalable code.
          </p>
          <p>
            When I'm not coding, you can find me exploring new open-source projects, contributing to the community, or enjoying a good cup of coffee while reading up on the latest tech trends.
          </p>
        </div>
      </section>

      <section className="mt-16 md:mt-24">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center font-headline">
          Skills & Expertise
        </h2>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {skills.map(skill => (
              <Card key={skill.name} className="flex flex-col items-center justify-center p-4 text-center hover:shadow-md transition-shadow">
                <skill.icon className="h-8 w-8 mb-2 text-primary" />
                <p className="font-semibold text-sm">{skill.name}</p>
              </Card>
            ))}
        </div>
      </section>
    </main>
  );
}
