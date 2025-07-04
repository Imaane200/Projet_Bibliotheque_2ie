// --- app/admin/livres/columns.tsx ---

"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { Book } from "@/types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// On définit une interface pour les fonctions que nos colonnes recevront
interface ColumnsProps {
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

// Notre fonction `createColumns` accepte maintenant ces fonctions en paramètre
export const columns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Book>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "titre",
    header: ({ column }) => {
      // ... (code de tri )
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Titre <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "auteur",
    header: "Auteur",
  },
  {
    accessorKey: "disponible",
    header: "Disponibilité",
    cell: ({ row }) => {
      // ... (code du badge )
      const disponible = row.getValue("disponible");
      return <Badge variant={disponible ? "default" : "destructive"}>{disponible ? "Oui" : "Non"}</Badge>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const book = row.original;

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
            {/* Au clic, on appelle les fonctions passées en props avec les données du livre */}
            <DropdownMenuItem onClick={() => onEdit(book)}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(book)} className="text-red-500 focus:text-red-500 focus:bg-red-50">
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];