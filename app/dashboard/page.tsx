// --- app/dashboard/page.tsx ---

"use client";

import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpenCheck } from "lucide-react";

// On définit un type pour nos emprunts
interface Emprunt {
    id: number;
    date_emprunt: string;
    date_retour_prevue: string;
    titre: string;
    auteur: string;
}

export default function DashboardPage() {
    const { user, token } = useAuthStore();
    const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            const fetchBorrows = async () => {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/emprunts/my-borrows`, config);
                    setEmprunts(response.data);
                } catch (error) {
                    toast.error("Impossible de charger vos emprunts.");
                } finally {
                    setLoading(false);
                }
            };
            fetchBorrows();
        }
    }, [token]);

    if (loading) {
        return <div>Chargement de votre tableau de bord...</div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Bienvenue, {user?.nom} !</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <BookOpenCheck className="mr-2" />
                        Mes Emprunts en Cours
                    </CardTitle>
                    <CardDescription>
                        Voici la liste des livres que vous avez actuellement en votre possession.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Titre</TableHead>
                                <TableHead>Auteur</TableHead>
                                <TableHead>Date d'emprunt</TableHead>
                                <TableHead>Date de retour prévue</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {emprunts.length > 0 ? (
                                emprunts.map((emprunt) => (
                                    <TableRow key={emprunt.id}>
                                        <TableCell className="font-medium">{emprunt.titre}</TableCell>
                                        <TableCell>{emprunt.auteur}</TableCell>
                                        <TableCell>{new Date(emprunt.date_emprunt).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(emprunt.date_retour_prevue).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        Vous n'avez aucun livre emprunté pour le moment.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
