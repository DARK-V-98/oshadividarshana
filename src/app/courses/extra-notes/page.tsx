
import { moduleCategories } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import type { Metadata } from 'next';

const extraNotesCategory = moduleCategories.find(cat => cat.id === 'extra-notes');

export const metadata: Metadata = {
  title: 'Extra Notes | Oshadi Vidarshana',
  description: 'Explore specialized extra notes covering salon management, health & safety, and more.',
};

export default function ExtraNotesPage() {
  if (!extraNotesCategory) {
    return <div>Category not found.</div>;
  }

  return (
    <main className="container my-12 md:my-24">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-playfair">
          Extra Notes
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
          {extraNotesCategory.description}
        </p>
      </section>

      <section className="max-w-4xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle>Available Notes ({extraNotesCategory.modules.length})</CardTitle>
                <CardDescription>A list of specialized extra notes.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                {extraNotesCategory.modules.map((module) => (
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
