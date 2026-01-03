
'use client';

import { useState, useRef, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore, useStorage } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Camera } from 'lucide-react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters.'),
});

function getCroppedImg(
    image: HTMLImageElement,
    crop: Crop,
    fileName: string
  ): Promise<string> {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
  
    if (!ctx) {
      return Promise.reject(new Error('Canvas context is not available'));
    }
  
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  
    return new Promise((resolve) => {
      resolve(canvas.toDataURL('image/jpeg'));
    });
}

export default function UserProfile() {
  const { user, userProfile, loading, getIdToken } = useUser();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [photoForUpload, setPhotoForUpload] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Cropping state
  const [imgSrc, setImgSrc] = useState('');
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    values: {
      displayName: userProfile?.displayName || '',
    },
  });

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
      setIsCropDialogOpen(true);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    imgRef.current = e.currentTarget;
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          1,
          width,
          height
        ),
        width,
        height
      );
    setCrop(initialCrop);
    setCompletedCrop(initialCrop);
  };
  
  const handleCrop = async () => {
    if (completedCrop && imgRef.current) {
        const croppedImageUrl = await getCroppedImg(imgRef.current, completedCrop, 'profile.jpg');
        setPhotoForUpload(croppedImageUrl);
        setIsCropDialogOpen(false);
        setImgSrc('');
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!firestore || !storage || !user) return;
    setIsSaving(true);
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      let photoURL = userProfile?.photoURL;

      if (photoForUpload) {
        setIsUploading(true);
        const photoRef = ref(storage, `user-content/${user.uid}/profile-picture`);
        const base64String = photoForUpload.split(',')[1];
        const snapshot = await uploadString(photoRef, base64String, 'base64', { contentType: 'image/jpeg' });
        photoURL = await getDownloadURL(snapshot.ref);
        setIsUploading(false);
        setPhotoForUpload(null);
      }
      
      await updateProfile(user, { displayName: values.displayName, photoURL });
      await updateDoc(userDocRef, { displayName: values.displayName, photoURL });

      await getIdToken();

      toast({ title: 'Success', description: 'Your profile has been updated.' });
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={photoForUpload || userProfile?.photoURL || undefined} alt={userProfile?.displayName || 'User'} />
                    <AvatarFallback className="text-4xl">{getInitials(userProfile?.displayName)}</AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="photo-upload"
                    className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90"
                  >
                    <Camera className="h-4 w-4" />
                    <input id="photo-upload" type="file" accept="image/*" className="sr-only" onChange={onSelectFile} />
                  </label>
                </div>
              </div>

              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Your full name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input value={userProfile?.email || ''} disabled />
                  <FormMessage />
              </FormItem>

              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crop your new photo</DialogTitle>
          </DialogHeader>
          {imgSrc && (
            <ReactCrop
                crop={crop}
                onChange={c => setCrop(c)}
                onComplete={c => setCompletedCrop(c)}
                aspect={1}
                circularCrop
            >
                <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    onLoad={onImageLoad}
                    className="max-h-[60vh]"
                />
            </ReactCrop>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsCropDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCrop}>Crop & Use Photo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
