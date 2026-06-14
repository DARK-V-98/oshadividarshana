
"use client";

import { useState } from "react";
import { useStorage } from "@/firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, XCircle, Loader2, ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  pathPrefix: string;
  onUploadComplete: (downloadUrl: string) => void;
}

type PendingFile = { name: string; dataUrl: string; type: string };

export default function ImageUpload({ pathPrefix, onUploadComplete }: ImageUploadProps) {
  const storage = useStorage();
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selected = Array.from(e.target.files);
    const images = selected.filter((f) => f.type.startsWith("image/"));
    if (images.length !== selected.length) {
      toast({ variant: "destructive", title: "Some files skipped", description: "Only image files are allowed." });
    }

    Promise.all(
      images.map(
        (file) =>
          new Promise<PendingFile>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (ev) =>
              ev.target?.result
                ? resolve({ name: file.name, dataUrl: ev.target.result as string, type: file.type })
                : reject();
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    ).then((loaded) => setFiles((prev) => [...prev, ...loaded]));

    // allow re-selecting the same files later
    e.target.value = "";
  };

  const removePending = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0 || !storage) return;
    setUploading(true);
    setProgress({ done: 0, total: files.length });
    let success = 0;

    for (const file of files) {
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const storageRef = ref(storage, `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`);
      const base64String = file.dataUrl.split(",")[1];
      try {
        const snapshot = await uploadString(storageRef, base64String, "base64", { contentType: file.type });
        const downloadURL = await getDownloadURL(snapshot.ref);
        onUploadComplete(downloadURL);
        success += 1;
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        setProgress((p) => ({ ...p, done: p.done + 1 }));
      }
    }

    setUploading(false);
    setFiles([]);
    setProgress({ done: 0, total: 0 });
    if (success > 0) {
      toast({ title: `${success} image${success > 1 ? "s" : ""} uploaded`, description: 'Click "Save Settings" to publish.' });
    }
    if (success < files.length) {
      toast({ variant: "destructive", title: "Some uploads failed", description: "Please retry the remaining images." });
    }
  };

  if (uploading) {
    return (
      <div className="flex items-center gap-2 p-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <p className="text-sm text-muted-foreground">
          Uploading {progress.done}/{progress.total}...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {files.map((file, index) => (
              <div key={index} className="relative group rounded-md overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={file.dataUrl} alt={file.name} className="h-16 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePending(index)}
                  className="absolute top-0.5 right-0.5 text-white bg-black/50 rounded-full"
                  aria-label="Remove"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleUpload} size="sm" type="button">
              <Upload className="mr-2 h-4 w-4" /> Upload {files.length} image{files.length > 1 ? "s" : ""}
            </Button>
            <Button onClick={() => setFiles([])} size="sm" variant="ghost" type="button">
              Clear
            </Button>
          </div>
        </div>
      )}

      <div className="relative">
        <Button size="sm" variant="outline" type="button" className="w-full">
          <ImagePlus className="mr-2 h-4 w-4" /> Choose Review Images (select multiple)
        </Button>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}
