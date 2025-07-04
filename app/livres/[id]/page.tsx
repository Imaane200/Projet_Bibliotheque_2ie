// --- app/livres/[id]/page.tsx ---

import { Book, User } from "@/types"; 
import axios from "axios";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { BookHeart, BookmarkX, MessageSquare } from "lucide-react";
import { BorrowButton } from "../_components/BorrowButton";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReviewClientSection } from "./_components/ReviewClientSection";

// On définit le type pour un avis
export interface Review {
  id: number;
  note: number;
  commentaire: string;
  date_creation: string;
  etudiant_nom: string;
}

// Fonction pour récupérer les détails du livre
async function getBookDetails(id: string): Promise<Book | null> {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/livres/${id}`);
        return response.data;
    } catch (error) { return null; }
}

// Fonction pour récupérer les avis du livre
async function getBookReviews(id: string): Promise<Review[]> {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/livres/${id}/reviews`);
        return response.data;
    } catch (error) { return []; }
}

export default async function BookDetailPage({ params }: { params: { id: string } }) {
    const book = await getBookDetails(params.id);
    const initialReviews = await getBookReviews(params.id);

    if (!book) {
        return <div>Livre non trouvé.</div>;
    }

    return (
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Colonne de gauche : Image et Bouton */}
            <div className="md:col-span-1">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src={book.image_url || "/placeholder-book.svg"}
                        alt={`Couverture de ${book.titre}`}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="mt-4">
                    <BorrowButton bookId={book.id} isAvailable={book.disponible} />
                </div>
            </div>

            {/* Colonne de droite : Informations et Avis */}
            <div className="md:col-span-2">
                <Badge>{book.genre}</Badge>
                <h1 className="text-4xl font-bold mt-2">{book.titre}</h1>
                <p className="text-xl text-muted-foreground mt-1">par {book.auteur}</p>

                <div className="mt-6 flex items-center gap-4">
                    {book.disponible ? (
                        <span className="flex items-center text-green-600 font-semibold"><BookHeart className="mr-2 h-5 w-5" /> Disponible</span>
                    ) : (
                        <span className="flex items-center text-red-600 font-semibold"><BookmarkX className="mr-2 h-5 w-5" /> Déjà emprunté</span>
                    )}
                </div>

                <div className="mt-8 prose max-w-none dark:prose-invert">
                    <p>Description du livre à ajouter ici... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.</p>
                </div>
                
                <Separator className="my-8" />

               
                {/* On délègue toute l'interactivité à un composant client */}
                <ReviewClientSection livreId={book.id} initialReviews={initialReviews} />
            </div>
        </div>
    );
}
