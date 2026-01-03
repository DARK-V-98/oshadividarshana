
"use client";

import { useState } from "react";
import { useStorage } from "@/firebase";
import { ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, XCircle, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  filePath: string;
  onUploadComplete: (downloadUrl: string) => void;
  onDelete: () => void;
  currentFileUrl: string | null;
}

export default function FileUpload({
  filePath,
  onUploadComplete,
  onDelete,
  currentFileUrl,
}: FileUploadProps) {
  const storage = useStorage();
  const [fileData, setFileData] = useState<{ name: string; dataUrl: string; } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          setFileData({
            name: file.name,
            dataUrl: loadEvent.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async () => {
    if (!storage || !currentFileUrl) return;

    setDeleting(true);
    const fileRef = ref(storage, filePath);

    try {
        await deleteObject(fileRef);
        onDelete();
        toast({ title: "File Deleted", description: "The file has been successfully removed." });
    } catch (error: any) {
        console.error("File deletion error:", error);
        if (error.code === 'storage/object-not-found') {
            onDelete();
            toast({ variant: 'default', title: "File Not Found in Storage", description: "Removing stale URL from record." });
        } else {
             toast({ variant: "destructive", title: "Deletion Failed", description: error.message });
        }
    } finally {
        setDeleting(false);
    }
  }

  const handleUpload = async () => {
    if (!fileData || !storage) return;

    setUploading(true);
    const storageRef = ref(storage, filePath);

    try {
      const snapshot = await uploadString(storageRef, fileData.dataUrl, 'data_url');
      const downloadURL = await getDownloadURL(snapshot.ref);
      onUploadComplete(downloadURL);
      setFileData(null);
      toast({ title: "Upload Complete", description: "File has been uploaded successfully." });
    } catch (error) {
      console.error("Upload error:", error);
      toast({ variant: "destructive", title: "Upload Failed", description: "There was an issue uploading your file." });
    } finally {
      setUploading(false);
    }
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
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={handleDelete} disabled={deleting}>
                {deleting ? <Loader2 className="h-4 w-4 animate-spin text-destructive"/> : <Trash2 className="h-4 w-4 text-destructive" />}
            </Button>
        </div>
    );
  }

  if (uploading) {
    return (
      <div className="flex items-center justify-center space-y-2 p-2">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <p className="text-sm text-muted-foreground">Uploading...</p>
      </div>
    );
  }

  if (fileData) {
      return (
        <div className="flex items-center gap-2">
          <p className="text-sm truncate flex-1">{fileData.name}</p>
          <Button onClick={handleUpload} size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <Button onClick={() => setFileData(null)} size="sm" variant="ghost">
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
