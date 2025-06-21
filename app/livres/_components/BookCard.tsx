import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Book } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-0 relative h-48">
        <Image
          src={book.image_url || "/placeholder-book.svg"} // prévoir une image par défaut
          alt={`Couverture de ${book.titre}`}
          fill
          style={{ objectFit: "cover" }}
        />
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <Badge variant="secondary" className="mb-2">{book.genre}</Badge>
        <h3 className="font-bold text-lg leading-tight">{book.titre}</h3>
        <p className="text-sm text-muted-foreground">{book.auteur}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
          <Button asChild className="w-full">
            <Link href={`/livres/${book.id}`}>Voir les détails</Link>
          </Button>
      </CardFooter>
    </Card>
  );
}