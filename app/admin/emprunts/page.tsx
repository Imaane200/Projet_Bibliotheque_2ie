// --- app/admin/emprunts/page.tsx ---

// Ce composant délègue tout le travail au composant client
import { BorrowsClientPage } from "./BorrowsClientPage";

export default function AdminBorrowsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Suivi des Emprunts en Cours</h2>
      <BorrowsClientPage />
    </div>
  )
}
