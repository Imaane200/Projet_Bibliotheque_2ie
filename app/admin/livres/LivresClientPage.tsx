// --- app/admin/livres/LivresClientPage.tsx ---

"use client";

// Imports depuis React et Next.js
import { useState } from "react";
import { useRouter } from "next/navigation";

// Imports des types et des composants UI
import { Book } from "@/types";
import { DataTable } from "./data-table";
import { columns as createColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookForm } from "./BookForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// Imports pour la communication avec l'API et la gestion de l'état
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

interface LivresClientPageProps {
  initialBooks: Book[];
}

export function LivresClientPage({ initialBooks }: LivresClientPageProps) {
  const router = useRouter();
  const { token } = useAuthStore();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedBook(null);
    setIsFormOpen(true);
  };
  
  const handleDeleteConfirm = (book: Book) => {
    setSelectedBook(book);
    setIsDeleteAlertOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!selectedBook) return;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/livres/${selectedBook.id}`, config);
      
      toast.success("Livre supprimé avec succès !");
      setIsDeleteAlertOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Erreur API:", error);
      toast.error("Erreur lors de la suppression.");
    }
  };

  const columns = createColumns({ onEdit: handleEdit, onDelete: handleDeleteConfirm });

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAdd}>Ajouter un livre</Button>
      </div>
      
      {/* ---  --- */}
      <DataTable 
        columns={columns} 
        data={initialBooks} 
        filterColumnId="titre" 
        filterPlaceholder="Filtrer par titre..."
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedBook ? "Modifier le livre" : "Ajouter un nouveau livre"}</DialogTitle>
          </DialogHeader>
          <BookForm bookToEdit={selectedBook} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce livre ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le livre "{selectedBook?.titre}" sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
