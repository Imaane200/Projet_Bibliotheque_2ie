// --- app/admin/etudiants/StudentForm.tsx ---

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { User } from "@/types";
import { useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

// Schéma de validation pour le formulaire étudiant
const studentSchema = z.object({
  nom: z.string().min(2, { message: "Le nom est requis." }),
  email: z.string().email({ message: "Email invalide." }),
  role: z.enum(['etudiant', 'admin'], { required_error: "Le rôle est requis." }),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentFormProps {
  studentToEdit: User; // Ici, on part du principe qu'on ne fait que modifier
  onSuccess: () => void;
}

export function StudentForm({ studentToEdit, onSuccess }: StudentFormProps) {
  const { token } = useAuthStore();
  
  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
  });

  // Pré-remplissage du formulaire avec les données de l'étudiant à modifier
  useEffect(() => {
    if (studentToEdit) {
      reset(studentToEdit);
    }
  }, [studentToEdit, reset]);

  // Logique de soumission pour la mise à jour
  const onSubmit = async (data: StudentFormValues) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/etudiants/${studentToEdit.id}`, data, config);
      toast.success("Étudiant mis à jour avec succès !");
      onSuccess();
    } catch (error) {
      console.error("Erreur API:", error);
      toast.error("Une erreur est survenue lors de la mise à jour.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nom">Nom</Label>
        <Input id="nom" {...register("nom")} />
        {errors.nom && <p className="text-sm text-red-500">{errors.nom.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" {...register("email")} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Rôle</Label>
        {/* Le composant Select de Shadcn est un peu spécial et s'intègre avec `control` de react-hook-form */}
        <Select onValueChange={(value) => reset({ ...studentToEdit, ...register('role').onChange({ target: { value } }) })} defaultValue={studentToEdit.role}>
            <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="etudiant">Étudiant</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
        </Select>
        {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : "Mettre à jour"}
      </Button>
    </form>
  );
}
