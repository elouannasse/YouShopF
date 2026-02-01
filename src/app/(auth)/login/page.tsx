"use client";

import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Login page with react-hook-form + Zod validation
 */
export default function LoginPage() {
  const { login, isLoading, user } = useAuth();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !hasRedirected) {
      console.log("[Login] User detected, redirecting...", user);
      setHasRedirected(true);
      
      const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get("redirect") || searchParams.get("callbackUrl");
      
      if (redirectUrl) {
        console.log("[Login] Redirecting to:", redirectUrl);
        router.replace(redirectUrl);
      } else if (user.role?.toLowerCase() === "admin") {
        console.log("[Login] Redirecting admin to /admin");
        router.replace("/admin");
      } else {
        console.log("[Login] Redirecting user to /");
        router.replace("/");
      }
    }
  }, [user, hasRedirected, router]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data);

      if (result.success && result.user) {
        toast.success("Connexion réussie !");
        
        // Get redirect URL from query params
        const searchParams = new URLSearchParams(window.location.search);
        const redirectUrl = searchParams.get("redirect") || searchParams.get("callbackUrl");
        
        // Redirect immediately based on user role
        if (redirectUrl) {
          console.log("[Login] Redirecting to:", redirectUrl);
          router.replace(redirectUrl);
        } else if (result.user.role?.toLowerCase() === "admin") {
          console.log("[Login] Redirecting admin to /admin");
          router.replace("/admin");
        } else {
          console.log("[Login] Redirecting user to /");
          router.replace("/");
        }
      } else {
        toast.error(result.error || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("[Login] Submit error:", error);
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Connexion
          </CardTitle>
          <CardDescription className="text-center">
            Connectez-vous à votre compte YouShop
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="exemple@email.com"
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
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Créer un compte
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
