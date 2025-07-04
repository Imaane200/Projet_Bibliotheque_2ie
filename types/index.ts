export type User = {
  id: number;
  nom: string;
  email: string;
  role: 'etudiant' | 'admin';
  date_creation?: string; // Optionnel
};

export type Book = {
  id: number;
  titre: string;
  auteur: string;
  genre: string;
  image_url: string;
  disponible: boolean;
};