// --- app/admin/emprunts/BorrowsClientPage.tsx ---

"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/app/admin/livres/data-table";
import { createBorrowsColumns, EmpruntAdminView } from "./columns";
import { toast } from "sonner";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

export function BorrowsClientPage() {
  const { token } = useAuthStore();
  const [borrows, setBorrows] = useState<EmpruntAdminView[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBorrows = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/emprunts/all`, config);
      setBorrows(response.data);
    } catch (error) {
      toast.error("Impossible de charger les emprunts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, [token]);

  const handleReturnBook = async (empruntId: number) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/emprunts/${empruntId}/return`, {}, config);
      toast.success("Livre marqué comme retourné !");
      fetchBorrows(); // On recharge la liste pour voir le changement
    } catch (error) {
      toast.error("Erreur lors du retour du livre.");
    }
  };

  const columns = createBorrowsColumns({ onReturn: handleReturnBook });

  if (loading) return <p>Chargement des emprunts en cours...</p>;

  return (
    <DataTable
      columns={columns}
      data={borrows}
      filterColumnId="livre_titre"
      filterPlaceholder="Filtrer par titre de livre..."
    />
  );
}
