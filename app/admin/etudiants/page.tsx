// --- app/admin/etudiants/page.tsx (Final) ---

// Ce composant reste un Server Component, mais il délègue tout le travail
// d'affichage et d'interaction au composant client.
import { StudentsClientPage } from "./StudentsClientPage";

export default function AdminStudentsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestion des Étudiants</h2>
      {/* On appelle notre composant client qui s'occupera de tout */}
      <StudentsClientPage />
    </div>
  )
}
