// --- app/admin/etudiants/columns.tsx ---

"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/types"; // On utilise notre type User
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Interface pour les fonctions que nos colonnes recevront du composant parent
interface ColumnsProps {
  onEdit: (student: User) => void;
  onDelete: (student: User) => void;
}

// La fonction qui crée et exporte nos définitions de colonnes
export const createStudentColumns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<User>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "nom",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Nom
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Rôle",
    // On utilise un Badge pour afficher le rôle de manière plus visuelle
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return <Badge variant={role === 'admin' ? "destructive" : "secondary"}>{role}</Badge>
    }
  },
  {
    // Colonne spéciale pour les actions (Modifier, Supprimer)
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(student)}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(student)} className="text-red-500 focus:text-red-500">
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
