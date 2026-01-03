"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import type { Metadata } from 'next';

// This is a client component, so we can't export metadata directly.
// We'd set this in layout or the parent page if it were a server component.
// For this standalone page, we can manage the title via useEffect if needed, but for SEO, server-side is best.

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters.").max(500, "Message must be less than 500 characters."),
});

export default function ContactPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out. I'll get back to you soon.",
    });
    form.reset();
  }

  return (
    <main className="container my-12 md:my-24">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
          Get in Touch
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
          Have a project in mind, a question, or just want to say hi? I'd love to hear from you.
        </p>
      </section>

      <section className="mt-12 md:mt-20 grid md:grid-cols-2 gap-12">
        <div className="space-y-6 rounded-lg bg-secondary p-8">
            <h2 className="text-2xl font-bold font-headline">Contact Information</h2>
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <Mail className="h-6 w-6 text-primary" />
                    <a href="mailto:oshadi@example.com" className="text-lg hover:underline">oshadi@example.com</a>
                </div>
                <div className="flex items-center gap-4">
                    <Phone className="h-6 w-6 text-primary" />
                    <span className="text-lg">+1 (234) 567-890</span>
                </div>
                <div className="flex items-center gap-4">
                    <MapPin className="h-6 w-6 text-primary" />
                    <span className="text-lg">Colombo, Sri Lanka</span>
                </div>
            </div>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell me about your project or inquiry..." rows={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg">Send Message</Button>
            </form>
          </Form>
        </div>
      </section>
    </main>
  );
}
