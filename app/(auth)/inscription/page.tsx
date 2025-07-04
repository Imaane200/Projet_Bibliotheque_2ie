// --- app/(auth)/inscription/page.tsx ---

// "use client" est une directive obligatoire pour les pages qui contiennent de l'interactivité
// (gestion d'état, écouteurs d'événements, hooks comme useState ou useEffect).
// Nos formulaires sont interactifs, donc cette ligne est nécessaire.
"use client";

// Importations des bibliothèques et composants nécessaires
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // Le système de notification moderne que nous avons installé
import Link from "next/link";
import { useRouter } from "next/navigation"; // Pour rediriger l'utilisateur après l'inscription
import { useForm } from "react-hook-form"; // Le gestionnaire de formulaires
import { zodResolver } from "@hookform/resolvers/zod"; // Le pont entre Zod et React Hook Form
import * as z from "zod"; // La bibliothèque pour valider nos données
import axios from "axios"; // La bibliothèque pour faire des appels à l'API backend

// On définit le "schéma" de validation pour notre formulaire d'inscription avec Zod.
// C'est ici qu'on définit les règles : quel champ est obligatoire, le format de l'email, la taille du mot de passe, etc.
const registerSchema = z.object({
  nom: z.string().min(2, { message: "Le nom doit faire au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
});

// On crée un type TypeScript à partir de notre schéma Zod pour garantir la cohérence des données.
type RegisterFormValues = z.infer<typeof registerSchema>;

// C'est notre composant React qui représente la page d'inscription.
export default function RegisterPage() {
  // On initialise le hook de redirection.
  const router = useRouter();

  // On configure notre formulaire avec react-hook-form.
  // - `resolver` lui dit d'utiliser notre schéma Zod pour la validation.
  // - `formState` nous donne des informations utiles comme les erreurs ou si le formulaire est en cours de soumission.
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  // Cette fonction sera appelée uniquement si le formulaire est valide (grâce à Zod).
  // Elle reçoit les données du formulaire en paramètre.
  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // On envoie les données du formulaire à notre API backend sur la route d'inscription.
      // L'URL de base de l'API vient de notre fichier .env.local.
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, data);

      // Si l'inscription réussit, on affiche une notification de succès.
      toast.success("Inscription réussie !", {
        description: "Vous pouvez maintenant vous connecter.",
      });

      // On redirige l'utilisateur vers la page de connexion.
      router.push("/connexion");

    } catch (error) {
      // Si l'API renvoie une erreur (ex: l'email existe déjà), on l'attrape ici.
      toast.error("Erreur d'inscription", {
        description: "Cet email est peut-être déjà utilisé. Veuillez réessayer.",
      });
    }
  };

  // C'est la partie "visible" de notre page, écrite en JSX.
  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Créer un compte</CardTitle>
          <CardDescription>Rejoignez la plateforme de la bibliothèque en quelques secondes</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Le `handleSubmit` de react-hook-form s'assure que `onSubmit` n'est appelé que si la validation est OK */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Champ pour le nom */}
            <div className="space-y-2">
              <Label htmlFor="nom">Nom complet</Label>
              {/* On "enregistre" ce champ dans le formulaire avec {...register("nom")} */}
              <Input id="nom" type="text" placeholder="Ex: Imaane SAWADOGO" {...register("nom")} />
              {/* On affiche le message d'erreur s'il y en a un pour ce champ */}
              {errors.nom && <p className="text-sm text-red-500">{errors.nom.message}</p>}
            </div>

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

            {/* Bouton de soumission */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {/* On change le texte du bouton si le formulaire est en cours de soumission */}
              {isSubmitting ? "Création en cours..." : "S'inscrire"}
            </Button>
          </form>

          {/* Lien pour les utilisateurs qui ont déjà un compte */}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link href="/connexion" className="underline font-semibold hover:text-primary">
              Se connecter
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}