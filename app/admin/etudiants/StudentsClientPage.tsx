// --- app/admin/etudiants/StudentsClientPage.tsx ---

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { DataTable } from "@/app/admin/livres/data-table"; // On réutilise le composant DataTable !
import { createStudentColumns } from "./columns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StudentForm } from "./StudentForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

export function StudentsClientPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  useEffect(() => {
    if (token) {
      const fetchStudents = async () => {
        setLoading(true);
        try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/etudiants`, config);
          setStudents(response.data);
        } catch (error) {
          toast.error("Impossible de charger la liste des étudiants.");
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchStudents();
    }
  }, [token, router]); // On ajoute router aux dépendances pour le rafraîchissement

  const handleEdit = (student: User) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };
  
  const handleDeleteConfirm = (student: User) => {
    setSelectedStudent(student);
    setIsDeleteAlertOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    // On force un re-fetch des données après une modification réussie
    const fetchStudents = async () => {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/etudiants`, config);
        setStudents(response.data);
        setLoading(false);
    };
    fetchStudents();
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/etudiants/${selectedStudent.id}`, config);
      toast.success("Étudiant supprimé avec succès !");
      setIsDeleteAlertOpen(false);
      // On met à jour la liste manuellement pour une réactivité instantanée
      setStudents(students.filter(s => s.id !== selectedStudent.id));
    } catch (error) {
      toast.error("Erreur lors de la suppression.");
      console.error(error);
    }
  };

  const columns = createStudentColumns({ onEdit: handleEdit, onDelete: handleDeleteConfirm });

  if (loading) {
    return <p>Chargement des étudiants...</p>;
  }

  return (
    <div>
      {/*  --- */}
      <DataTable 
        columns={columns} 
        data={students} 
        filterColumnId="nom" 
        filterPlaceholder="Filtrer par nom..."
      />

      {/* Dialog pour le formulaire de modification */}
      {selectedStudent && (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier l'étudiant</DialogTitle>
            </DialogHeader>
            <StudentForm studentToEdit={selectedStudent} onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Dialog pour la confirmation de suppression */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible et supprimera le compte de {selectedStudent?.nom}.
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
