export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="border-t py-6 md:py-8">
            <div className="container flex flex-col items-center justify-center gap-4 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground">
                    © {currentYear} Université 2iE. Tous droits réservés. Projet de développement d'application web 2025. 
                </p>
            </div>
        </footer>
    )
}