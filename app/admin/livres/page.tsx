// --- app/admin/livres/page.tsx ---

import { Book } from "@/types";
import axios from "axios";
import { LivresClientPage } from "./LivresClientPage";

// --- RÉCUPÉRATION DES LIVRES DE L'API ---

async function getAllBooks(): Promise<Book[]> {
  try {
    // Elle fait uniquement l'appel à l'API réelle
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/livres`);
    return response.data;
  } catch (error) {
    console.error("Impossible de récupérer les livres depuis l'API:", error);
    // En cas d'erreur, on renvoie un tableau vide pour ne pas faire planter la page
    return [];
  }
}

export default async function AdminLivresPage() {
  const books = await getAllBooks();

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Gestion des Livres</h2>
      <LivresClientPage initialBooks={books} />
    </div>
  )
}