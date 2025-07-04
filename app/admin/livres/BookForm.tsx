// --- app/admin/livres/BookForm.tsx ---

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Book } from "@/types";
import { useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

// Schéma de validation Zod pour un livre
const bookSchema = z.object({
  titre: z.string().min(3, { message: "Le titre doit faire au moins 3 caractères." }),
  auteur: z.string().min(3, { message: "L'auteur doit faire au moins 3 caractères." }),
  genre: z.string().min(2, { message: "Le genre est requis." }),
  image_url: z.string().url({ message: "Veuillez entrer une URL d'image valide." }).or(z.literal('')), // L'URL est optionnelle mais doit être une URL valide si elle est fournie
});

type BookFormValues = z.infer<typeof bookSchema>;

interface BookFormProps {
  // Le livre à modifier (optionnel, si null, c'est un ajout)
  bookToEdit?: Book | null;
  // Fonction à appeler quand le formulaire est soumis avec succès
  onSuccess: () => void;
}

export function BookForm({ bookToEdit, onSuccess }: BookFormProps) {
  // On récupère le token depuis notre store pour authentifier nos requêtes
  const { token } = useAuthStore();
  
  // Configuration du formulaire avec react-hook-form et Zod
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      titre: '',
      auteur: '',
      genre: '',
      image_url: '',
    }
  });

  // useEffect est utilisé ici pour pré-remplir le formulaire si on est en mode "modification".
  useEffect(() => {
    if (bookToEdit) {
      // `reset` de react-hook-form met à jour toutes les valeurs du formulaire.
      reset(bookToEdit);
    } else {
      // Si on est en mode "ajout", on s'assure que le formulaire est vide.
      reset({ titre: '', auteur: '', genre: '', image_url: '' });
    }
  }, [bookToEdit, reset]);

  // Logique de soumission qui appelle notre API
  const onSubmit = async (data: BookFormValues) => {
    // On prépare les en-têtes de la requête pour inclure le token JWT
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      if (bookToEdit) {
        // --- LOGIQUE DE MODIFICATION ---
        // On envoie une requête PUT à l'API avec les données et la configuration d'authentification
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/livres/${bookToEdit.id}`, data, config);
        toast.success("Livre modifié avec succès !");
      } else {
        // --- LOGIQUE D'AJOUT ---
        // On envoie une requête POST à l'API
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/livres`, data, config);
        toast.success("Livre ajouté avec succès !");
      }
      onSuccess(); // On exécute la fonction de succès (fermer le dialog, rafraîchir la page)
    } catch (error) {
      console.error("Erreur API:", error);
      toast.error("Une erreur est survenue. Vérifiez que vous êtes bien admin.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="titre">Titre</Label>
        <Input id="titre" {...register("titre")} />
        {errors.titre && <p className="text-sm text-red-500">{errors.titre.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="auteur">Auteur</Label>
        <Input id="auteur" {...register("auteur")} />
        {errors.auteur && <p className="text-sm text-red-500">{errors.auteur.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="genre">Genre</Label>
        <Input id="genre" {...register("genre")} />
        {errors.genre && <p className="text-sm text-red-500">{errors.genre.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image_url">URL de l'image de couverture</Label>
        <Input id="image_url" {...register("image_url")} />
        {errors.image_url && <p className="text-sm text-red-500">{errors.image_url.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : (bookToEdit ? "Mettre à jour" : "Ajouter le livre")}
      </Button>
    </form>
  );
}
