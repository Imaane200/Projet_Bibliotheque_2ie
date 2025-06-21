import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Search, UserPlus } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
        Bienvenue sur la plateforme de la Bibliothèque
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Recherchez, réservez et empruntez vos livres en toute simplicité.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button asChild size="lg">
          <Link href="/livres">
            <Search className="mr-2 h-5 w-5" /> Explorer les livres
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
           <Link href="/inscription">
            <UserPlus className="mr-2 h-5 w-5" /> Créer un compte
          </Link>
        </Button>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3 w-full">
         <Card>
            <CardHeader>
                <Book className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Catalogue Riche</CardTitle>
                <CardDescription>Accédez à des milliers d'ouvrages, articles et revues académiques.</CardDescription>
            </CardHeader>
        </Card>
         <Card>
            <CardHeader>
                 <Search className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Recherche Facile</CardTitle>
                <CardDescription>Trouvez exactement ce que vous cherchez avec nos filtres puissants.</CardDescription>
            </CardHeader>
        </Card>
         <Card>
            <CardHeader>
                 <UserPlus className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Gestion Personnalisée</CardTitle>
                <CardDescription>Gérez vos emprunts, vos réservations et votre historique en un seul clic.</CardDescription>
            </CardHeader>
        </Card>
      </div>
    </div>
  );
}