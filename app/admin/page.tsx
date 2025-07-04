// --- app/admin/page.tsx ---

// On importe la fonction de redirection de Next.js
import { redirect } from 'next/navigation';

// Ce composant est un "Server Component". Il s'exécute sur le serveur.
// Il ne renverra jamais de HTML, son seul but est de rediriger.
export default function AdminPage() {
  
  // On redirige immédiatement l'utilisateur vers la page de gestion des livres.
  // C'est la destination par défaut de notre section admin.
  redirect('/admin/livres');

  // Comme la redirection se produit, rien ne sera jamais retourné ici.
  // On peut retourner null pour satisfaire TypeScript.
  return null;
}
