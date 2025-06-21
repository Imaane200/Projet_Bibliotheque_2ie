import { BookList } from "./_components/BookList";
import { BookFilters } from "./_components/BookFilters";
import { Suspense } from "react";

// searchParams est automatiquement passé par Next.js
export default function LivresPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const titre = typeof searchParams.titre === "string" ? searchParams.titre : undefined;
  const auteur = typeof searchParams.auteur === "string" ? searchParams.auteur : undefined;
  const genre = typeof searchParams.genre === "string" ? searchParams.genre : undefined;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Catalogue des Livres</h1>
        <p className="text-muted-foreground">
          Explorez notre collection et trouvez votre prochaine lecture.
        </p>
      </div>

      <BookFilters />
      
      <div className="mt-8">
        {/* Suspense permet d'afficher un fallback en attendant que les données arrivent */}
        <Suspense fallback={<p>Chargement des livres...</p>}>
          <BookList key={`${titre}-${auteur}-${genre}`} titre={titre} auteur={auteur} genre={genre} />
        </Suspense>
      </div>
    </div>
  );
}