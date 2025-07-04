// File: app/livres/_components/BookList.tsx

import { BookCard } from "./BookCard";
import type { Book } from "@/types";
import axios from "axios";

// Données de simulation
const mockBooks: Book[] = [
  { id: 1, titre: "React pour les Pros", auteur: "Jane Doe", genre: "Technique", image_url: "/placeholder-book.svg", disponible: true },
  { id: 2, titre: "Les secrets de Node.js", auteur: "John Smith", genre: "Technique", image_url: "/placeholder-book.svg", disponible: false },
  { id: 3, titre: "L'art du CSS moderne", auteur: "Alice Johnson", genre: "Design", image_url: "/placeholder-book.svg", disponible: true },
  { id: 4, titre: "Fondations de l'Informatique", auteur: "Robert Martin", genre: "Science", image_url: "/placeholder-book.svg", disponible: true },
];

async function getBooks(query: { titre?: string; auteur?: string; genre?: string }): Promise<Book[]> {
  try {
    const params = new URLSearchParams();
    if (query.titre) params.append('titre', query.titre);
    if (query.auteur) params.append('auteur', query.auteur);
    if (query.genre) params.append('genre', query.genre);
    
    // On essaie de contacter la VRAIE API
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/livres`, { params });
    return response.data;
  } catch (error) {
    console.warn("--- MODE SIMULATION ACTIF ---");
    console.warn("Impossible de contacter l'API. Utilisation de données de simulation.");
    // En cas d'erreur (backend non démarré), on renvoie les fausses données
    return mockBooks;
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