
'use client';

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDoc, useFirestore } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2, PlusCircle } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

const testimonialSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required."),
  role: z.string().min(1, "Role is required."),
  text: z.string().min(10, "Testimonial must be at least 10 characters."),
  rating: z.coerce.number().min(1).max(5),
});

const settingsSchema = z.object({
  announcement: z.object({
    message: z.string().max(200, "Message is too long."),
    enabled: z.boolean(),
  }),
  testimonials: z.array(testimonialSchema),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SiteSettings() {
  const { data: siteSettings, loading } = useDoc<SiteSettings>('settings/site');
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    values: {
        announcement: siteSettings?.announcement || { message: '', enabled: false },
        testimonials: siteSettings?.testimonials || [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "testimonials",
  });

  const onSubmit = async (values: SettingsFormValues) => {
    if (!firestore) return;
    setIsSaving(true);
    try {
      await setDoc(doc(firestore, "settings", "site"), values);
      toast({ title: "Success", description: "Site settings updated." });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Failed to save settings." });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Announcement Banner</CardTitle>
            <CardDescription>Display a site-wide banner at the top of the page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="announcement.message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Holiday Sale! 10% off all packs!" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="announcement.enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Enable Banner</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Testimonials</CardTitle>
                <CardDescription>Manage testimonials displayed on the homepage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-3 relative">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={() => remove(index)}
                        >
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <FormField
                            control={form.control}
                            name={`testimonials.${index}.name`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl><Input {...field} placeholder="John Doe"/></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`testimonials.${index}.role`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl><Input {...field} placeholder="NVQ Student"/></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`testimonials.${index}.text`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Testimonial Text</FormLabel>
                                    <FormControl><Textarea {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`testimonials.${index}.rating`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rating (1-5)</FormLabel>
                                    <FormControl><Input type="number" min="1" max="5" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ id: new Date().toISOString(), name: '', role: '', text: '', rating: 5 })}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Testimonial
                </Button>
            </CardContent>
        </Card>

        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Settings
        </Button>
      </form>
    </Form>
  );
}
