// --- app/admin/layout.tsx ---

"use client";

import { useAuthStore } from "@/stores/authStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, BookUser, Library, BookCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  // Ce premier useEffect est toujours appelé, il est correct.
  // Il nous sert à savoir quand on est bien sur le navigateur du client.
  useEffect(() => {
    setIsClient(true);
  }, []);

  
  // Ce deuxième useEffect est  à l'extérieur de toute condition.
  // Il sera donc appelé à chaque rendu, dans le même ordre.
  useEffect(() => {
    // La logique conditionnelle est à l'intérieur, ce qui est autorisé.
    // On n'agit que si on est sur le client et que l'utilisateur n'est pas un admin.
    if (isClient && (!token || user?.role !== 'admin')) {
      router.push('/');
    }
  }, [isClient, token, user, router]); // Il se redéclenche si l'un de ces états change

  // --- Logique d'affichage ---
  // Si nous ne sommes pas encore sur le client OU si l'utilisateur n'est pas un admin,
  // on affiche un message de chargement/d'attente.
  // Cela empêche d'afficher brièvement le contenu admin avant la redirection.
  if (!isClient || !token || user?.role !== 'admin') {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="flex items-center"><ShieldAlert className="mr-2"/> Accès Restreint</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Vérification des permissions en cours...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Si toutes les vérifications sont passées, on affiche le tableau de bord.
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Tableau de Bord Administrateur</h1>
      </div>
      
      <nav className="flex items-center space-x-1 sm:space-x-4 border-b mb-8 overflow-x-auto">
        <Link 
          href="/admin/livres" 
          className={cn(
            "flex items-center space-x-2 px-3 py-2 border-b-2 text-sm sm:text-base whitespace-nowrap",
            pathname.startsWith('/admin/livres') 
              ? "border-primary text-primary font-semibold" 
              : "border-transparent text-muted-foreground hover:text-primary"
          )}
        >
          <Library className="h-5 w-5" />
          <span>Gestion des Livres</span>
        </Link>
        <Link 
          href="/admin/etudiants" 
          className={cn(
            "flex items-center space-x-2 px-3 py-2 border-b-2 text-sm sm:text-base whitespace-nowrap",
            pathname.startsWith('/admin/etudiants') 
              ? "border-primary text-primary font-semibold" 
              : "border-transparent text-muted-foreground hover:text-primary"
          )}
        >
          <BookUser className="h-5 w-5" />
          <span>Gestion des Étudiants</span>
        </Link>
        <Link 
          href="/admin/emprunts" 
          className={cn(
            "flex items-center space-x-2 px-3 py-2 border-b-2 text-sm sm:text-base whitespace-nowrap",
            pathname.startsWith('/admin/emprunts') 
              ? "border-primary text-primary font-semibold" 
              : "border-transparent text-muted-foreground hover:text-primary"
          )}
        >
          <BookCheck className="h-5 w-5" />
          <span>Gestion des Emprunts</span>
        </Link>
      </nav>
      
      {children}
    </div>
  );
}
