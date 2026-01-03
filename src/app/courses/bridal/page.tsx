
import { moduleCategories } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import type { Metadata } from 'next';

const bridalCategory = moduleCategories.find(cat => cat.id === 'bridal');

export const metadata: Metadata = {
  title: 'Bridal Dresser Course Modules | Oshadi Vidarshana',
  description: 'Explore all modules for the NVQ Level 4 Bridal Dresser course. Get complete notes and assignments.',
};

export default function BridalCoursePage() {
  if (!bridalCategory) {
    return <div>Category not found.</div>;
  }

  return (
    <main className="container my-12 md:my-24">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-playfair">
          Bridal Dresser Course
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
          {bridalCategory.description}
        </p>
      </section>

      <section className="max-w-4xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle>Course Modules ({bridalCategory.modules.length})</CardTitle>
                <CardDescription>A complete list of modules for the Bridal Dresser course.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                {bridalCategory.modules.map((module) => (
                    <div key={module.code} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {module.code}
                            </span>
                        </div>
                        <h4 className="font-medium text-foreground text-sm md:text-base">
                            {module.title}
                        </h4>
                        <p className="text-muted-foreground text-xs md:text-sm mt-1">
                            {module.sinhala}
                        </p>
                        </div>
                    </div>
                ))}
                </div>
            </CardContent>
        </Card>
      </section>
    </main>
  );
}
