
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth, useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

const provider = new GoogleAuthProvider();
const ADMIN_EMAIL = "tikfese@gmail.com";

export default function SignInForm({ onFlip }: { onFlip: () => void }) {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (values: z.infer<typeof formSchema>) => {
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: "Signed in successfully!" });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Sign in error:", error);
      let description = "An unexpected error occurred. Please try again.";
      if (error && error.code) {
        switch (error.code) {
          case "auth/user-not-found":
            description = "No account found with this email. Please sign up.";
            break;
          case "auth/wrong-password":
          case "auth/invalid-credential":
            description = "Invalid email or password. Please try again.";
            break;
          case "auth/user-disabled":
            description = "This user account has been disabled.";
            break;
          default:
            description = error.message;
        }
      }
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: description,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth || !firestore) return;
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: user.email === ADMIN_EMAIL ? 'admin' : 'user',
        }, { merge: true });
      }

      toast({ title: "Signed in with Google successfully!" });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Google sign in error:", error);
      let description = "An unexpected error occurred during Google Sign-In.";
      if (error && error.code) {
        description = error.message;
      }
      toast({
        variant: "destructive",
        title: "Google sign in failed",
        description: description,
      });
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to your account to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </Form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
          <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.67-4.66 1.67-3.86 0-6.99-3.16-6.99-7.02s3.13-7.02 6.99-7.02c2.2 0 3.28.85 4.04 1.58l2.6-2.58C17.34 2.36 15.17 1.5 12.48 1.5c-6.19 0-11.24 5.01-11.24 11.22s5.05 11.22 11.24 11.22c3.21 0 5.7-1.09 7.56-2.92 1.95-1.95 2.58-4.88 2.58-7.78 0-.59-.05-.99-.12-1.38H12.48z"></path></svg>
          Google
        </Button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button
            onClick={onFlip}
            className="font-medium text-primary hover:underline"
          >
            Sign Up
          </button>
        </p>
      </CardContent>
    </Card>
  );
}
