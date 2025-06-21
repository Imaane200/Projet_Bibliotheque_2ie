"use client";

import { Button } from "@/components/ui/button";
import { BookMarked } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, token, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <BookMarked className="h-6 w-6" />
          <span className="font-bold">Biblio 2iE</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground">Accueil</Link>
          <Link href="/livres" className="transition-colors hover:text-foreground/80 text-foreground/60">Livres</Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {token ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">
                  {user?.nom || "Mon Compte"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/dashboard">Tableau de bord</Link></DropdownMenuItem>
                {user?.role === 'admin' && (
                  <DropdownMenuItem asChild><Link href="/admin">Administration</Link></DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-500">
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <nav className="space-x-2">
              <Button asChild variant="ghost">
                <Link href="/connexion">Connexion</Link>
              </Button>
              <Button asChild>
                <Link href="/inscription">Inscription</Link>
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}