import { BookCard } from "./BookCard";
import type { Book } from "@/types";
import axios from "axios";

async function getBooks(query: { titre?: string; auteur?: string; genre?: string }): Promise<Book[]> {
  try {
    const params = new URLSearchParams();
    if (query.titre) params.append('titre', query.titre);
    if (query.auteur) params.append('auteur', query.auteur);
    if (query.genre) params.append('genre', query.genre);
    
    // NOTE: Remplacer par l'URL de votre API
    // Ceci est un exemple, votre API backend devra gérer ces paramètres de recherche
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/livres`, { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch books:", error);
    // Dans une vraie app, on gérerait mieux les erreurs
    return []; 
  }
}

export async function BookList({ titre, auteur, genre }: { titre?: string; auteur?: string; genre?: string }) {
  const books = await getBooks({ titre, auteur, genre });

  if (books.length === 0) {
    return <p className="text-center text-muted-foreground">Aucun livre ne correspond à votre recherche.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}