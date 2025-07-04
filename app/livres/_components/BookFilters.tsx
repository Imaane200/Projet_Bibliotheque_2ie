"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';


const genres = ["Roman", "Science-Fiction", "Histoire", "Biographie", "Technique"];

export function BookFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string, field: 'titre' | 'auteur') => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(field, term);
    } else {
      params.delete(field);
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleGenreChange = (genre: string) => {
    const params = new URLSearchParams(searchParams);
    if (genre && genre !== "all") {
      params.set('genre', genre);
    } else {
      params.delete('genre');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
      <Input
        placeholder="Filtrer par titre..."
        onChange={(e) => handleSearch(e.target.value, 'titre')}
        defaultValue={searchParams.get('titre')?.toString()}
      />
      <Input
        placeholder="Filtrer par auteur..."
        onChange={(e) => handleSearch(e.target.value, 'auteur')}
        defaultValue={searchParams.get('auteur')?.toString()}
      />
      <Select onValueChange={handleGenreChange} defaultValue={searchParams.get('genre')?.toString() || 'all'}>
        <SelectTrigger>
          <SelectValue placeholder="Filtrer par genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les genres</SelectItem>
          {genres.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}