export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Lyrica.ai. Built with Next.js and powered by OpenRouter AI.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a 
              href="https://openrouter.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              OpenRouter API
            </a>
            <span>•</span>
            <a 
              href="https://nextjs.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Next.js
            </a>
            <span>•</span>
            <a 
              href="https://tailwindcss.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Tailwind CSS
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
