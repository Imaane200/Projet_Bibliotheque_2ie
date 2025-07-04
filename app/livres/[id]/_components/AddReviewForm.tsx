// --- app/livres/[id]/_components/AddReviewForm.tsx ---

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const reviewSchema = z.object({
  note: z.number().min(1, "La note est requise.").max(5),
  commentaire: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface AddReviewFormProps {
  livreId: number;
  onReviewAdded: (newReview: any) => void;
}

export function AddReviewForm({ livreId, onReviewAdded }: AddReviewFormProps) {
  const { token } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
  });

  const onSubmit = async (data: ReviewFormValues) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/livres/${livreId}/reviews`, data, config);
      toast.success("Votre avis a été ajouté !");
      onReviewAdded(response.data); // On envoie le nouvel avis au composant parent
      reset();
      setRating(0);
    } catch (error: any) {
      toast.error("Erreur", { description: error.response?.data?.message || "Impossible d'ajouter votre avis." });
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Votre note</Label>
        <div className="flex items-center space-x-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "h-6 w-6 cursor-pointer",
                (hoverRating || rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              )}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => {
                setRating(star);
                setValue("note", star, { shouldValidate: true });
              }}
            />
          ))}
        </div>
        {errors.note && <p className="text-sm text-red-500 mt-1">{errors.note.message}</p>}
      </div>

      <div>
        <Label htmlFor="commentaire">Votre commentaire (optionnel)</Label>
        <Textarea id="commentaire" {...register("commentaire")} className="mt-2" />
      </div>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Envoi en cours..." : "Soumettre mon avis"}
      </Button>
    </form>
  );
}
