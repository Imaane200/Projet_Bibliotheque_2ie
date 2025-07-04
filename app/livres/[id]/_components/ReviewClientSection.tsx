// --- app/livres/[id]/_components/ReviewClientSection.tsx ---

"use client";

import { useState } from "react";
import { Review } from "../page"; // On importe le type depuis la page parente
import { AddReviewForm } from "./AddReviewForm";
import { useAuthStore } from "@/stores/authStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ReviewClientSectionProps {
  livreId: number;
  initialReviews: Review[];
}

export function ReviewClientSection({ livreId, initialReviews }: ReviewClientSectionProps) {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const handleReviewAdded = (newReview: Review) => {
    // Ajoute le nouvel avis en haut de la liste pour une mise à jour instantanée
    setReviews([newReview, ...reviews]);
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Avis des lecteurs ({reviews.length})</h2>
      
      {/* Formulaire pour ajouter un avis (visible uniquement si l'utilisateur est connecté) */}
      {user && (
        <div className="mb-8 p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Laissez votre avis</h3>
          <AddReviewForm livreId={livreId} onReviewAdded={handleReviewAdded} />
        </div>
      )}

      {/* Liste des avis */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="flex space-x-4">
              <Avatar>
                <AvatarFallback>{review.etudiant_nom.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{review.etudiant_nom}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.date_creation).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.note ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                  ))}
                </div>
                <p className="mt-2 text-sm">{review.commentaire}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">Aucun avis pour ce livre pour le moment.</p>
        )}
      </div>
    </section>
  );
}
