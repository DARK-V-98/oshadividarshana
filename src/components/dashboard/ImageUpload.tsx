
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

export default function ImageUpload({ pathPrefix, onUploadComplete }: ImageUploadProps) {
  const storage = useStorage();
  const [fileData, setFileData] = useState<{ name: string; dataUrl: string; type: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast({ variant: "destructive", title: "Invalid file", description: "Please choose an image file." });
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          setFileData({ name: file.name, dataUrl: loadEvent.target.result as string, type: file.type });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!fileData || !storage) return;
    setUploading(true);
    const safeName = fileData.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storageRef = ref(storage, `${pathPrefix}/${Date.now()}-${safeName}`);
    const base64String = fileData.dataUrl.split(",")[1];
    try {
      const snapshot = await uploadString(storageRef, base64String, "base64", { contentType: fileData.type });
      const downloadURL = await getDownloadURL(snapshot.ref);
      onUploadComplete(downloadURL);
      setFileData(null);
      toast({ title: "Image uploaded", description: "Remember to click Save Settings to publish." });
    } catch (error) {
      console.error("Upload error:", error);
      toast({ variant: "destructive", title: "Upload Failed", description: "There was an issue uploading the image." });
    } finally {
      setUploading(false);
    }
  };

  if (uploading) {
    return (
      <div className="flex items-center gap-2 p-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <p className="text-sm text-muted-foreground">Uploading...</p>
      </div>
    );
  }

  if (fileData) {
    return (
      <div className="flex items-center gap-2">
        <img src={fileData.dataUrl} alt="preview" className="h-12 w-12 rounded object-cover" />
        <p className="text-sm truncate flex-1">{fileData.name}</p>
        <Button onClick={handleUpload} size="sm" type="button">
          <Upload className="mr-2 h-4 w-4" /> Upload
        </Button>
        <Button onClick={() => setFileData(null)} size="sm" variant="ghost" type="button">
          <XCircle className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button size="sm" variant="outline" type="button" className="w-full">
        <ImagePlus className="mr-2 h-4 w-4" /> Choose Review Image
      </Button>
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
}
