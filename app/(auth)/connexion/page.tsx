// --- app/(auth)/connexion/page.tsx ---

// On déclare cette page comme un "Client Component" car elle est interactive.
"use client";

// Importations des composants et bibliothèques.
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore"; // <-- IMPORTATION CLÉ : notre gestionnaire d'état !

// Le schéma de validation pour la connexion est plus simple : email et mot de passe.
const loginSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide" }),
  password: z.string().min(1, { message: "Le mot de passe ne peut pas être vide" }), // On vérifie juste qu'il n'est pas vide.
});

// Création du type TypeScript correspondant.
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  // On récupère la fonction "login" de notre store Zustand. C'est elle qui stockera les infos de l'utilisateur.
  const { login } = useAuthStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // La fonction de soumission pour la connexion.
  const onSubmit = async (data: LoginFormValues) => {
    try {
      // On appelle la route de connexion de notre API backend.
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, data);
      
      // L'API nous renvoie un token JWT et les informations de l'utilisateur.
      const { token, user } = response.data;

      // --- C'EST L'ÉTAPE LA PLUS IMPORTANTE ---
      // On appelle la fonction `login` de notre store pour sauvegarder le token et l'utilisateur.
      // L'application "saura" maintenant que l'utilisateur est connecté.
      login(token, user);

      // On affiche une notification de succès.
      toast.success("Connexion réussie", {
        description: `Bienvenue, ${user.nom} !`,
      });

      // On redirige l'utilisateur vers son tableau de bord.
      router.push("/dashboard"); // Note : cette page sera à créer.

    } catch (error) {
      // En cas d'erreur (ex: mot de passe incorrect), l'API renverra une erreur.
      toast.error("Erreur de connexion", {
        description: "L'email ou le mot de passe est incorrect.",
      });
    }
  };

  // Le JSX pour afficher le formulaire.
  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Accédez à votre espace personnel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Champ pour l'email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="etudiant@2ie-edu.org" {...register("email")} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Champ pour le mot de passe */}
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
          
          {/* Lien pour les utilisateurs qui n'ont pas de compte */}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="underline font-semibold hover:text-primary">
              S'inscrire
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}