// --- app/livres/_components/BorrowButton.tsx ---

"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BorrowButtonProps {
    bookId: number;
    isAvailable: boolean;
}

export function BorrowButton({ bookId, isAvailable }: BorrowButtonProps) {
    const { token, user } = useAuthStore();
    const router = useRouter();

    const handleBorrow = async () => {
        if (!token) {
            toast.error("Veuillez vous connecter pour emprunter un livre.");
            router.push('/connexion');
            return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/emprunts`, { livreId: bookId }, config);
            toast.success("Livre emprunté avec succès !");
            router.refresh(); // On rafraîchit la page pour voir le nouveau statut
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Une erreur est survenue.";
            toast.error("Erreur lors de l'emprunt", { description: errorMessage });
        }
    };

    return (
        <Button onClick={handleBorrow} disabled={!isAvailable || !token}>
            {isAvailable ? "Emprunter ce livre" : "Indisponible"}
        </Button>
    );
}
