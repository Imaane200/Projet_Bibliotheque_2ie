// --- app/admin/emprunts/columns.tsx ---

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

// Type pour les données d'emprunt que l'on va afficher
export interface EmpruntAdminView {
  id: number;
  livre_titre: string;
  etudiant_nom: string;
  date_emprunt: string;
  date_retour_prevue: string;
}

interface ColumnsProps {
  onReturn: (empruntId: number) => void;
}

export const createBorrowsColumns = ({ onReturn }: ColumnsProps): ColumnDef<EmpruntAdminView>[] => [
  { accessorKey: "livre_titre", header: "Titre du Livre" },
  { accessorKey: "etudiant_nom", header: "Emprunté par" },
  {
    accessorKey: "date_emprunt",
    header: "Date d'emprunt",
    cell: ({ row }) => new Date(row.getValue("date_emprunt")).toLocaleDateString(),
  },
  {
    accessorKey: "date_retour_prevue",
    header: "Retour Prévu Le",
    cell: ({ row }) => new Date(row.getValue("date_retour_prevue")).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const emprunt = row.original;
      return (
        <Button onClick={() => onReturn(emprunt.id)} size="sm">
          Marquer comme Retourné
        </Button>
      );
    },
  },
];
