
"use client";

import { useState } from "react";
import { useStorage } from "@/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, XCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  filePath: string;
  onUploadComplete: (downloadUrl: string) => void;
  onDelete?: () => void;
  currentFileUrl: string | null;
}

export default function FileUpload({
  filePath,
  onUploadComplete,
  onDelete,
  currentFileUrl,
}: FileUploadProps) {
  const storage = useStorage();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file || !storage) return;

    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        toast({ variant: "destructive", title: "Upload Failed", description: error.message });
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        onUploadComplete(downloadURL);
        setUploading(false);
        setFile(null);
        toast({ title: "Upload Complete", description: "File has been uploaded successfully." });
      }
    );
  };

  if (currentFileUrl) {
    return (
        <div className="flex items-center justify-between">
             <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <FileText className="h-4 w-4" />
                <a href={currentFileUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline">
                    View File
                </a>
            </div>
            {onDelete && (
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={onDelete}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            )}
        </div>
    );
  }

  if (uploading) {
    return (
      <div className="space-y-2">
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground">{Math.round(progress)}% uploaded</p>
      </div>
    );
  }

  if (file) {
      return (
        <div className="flex items-center gap-2">
          <p className="text-sm truncate flex-1">{file.name}</p>
          <Button onClick={handleUpload} size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <Button onClick={() => setFile(null)} size="sm" variant="ghost">
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      )
  }

  return (
    <div className="relative">
        <Button size="sm" variant="outline" type="button" className="w-full">
            <Upload className="mr-2 h-4 w-4" /> Choose File
        </Button>
        <Input 
            type="file" 
            accept=".pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
    </div>
  );
}
