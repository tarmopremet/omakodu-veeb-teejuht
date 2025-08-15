import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, Menu, X, User, Heart, Plus } from "lucide-react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">RendiEst</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Avaleht
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Otsi kinnisvara
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Üürileandjakele
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Abi
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-foreground">
              <Heart className="w-4 h-4 mr-2" />
              Lemmikud
            </Button>
            <Button variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              Logi sisse
            </Button>
            <Button size="sm" className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Lisa kuulutus
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur-md">
            <nav className="py-4 space-y-2">
              <a href="#" className="block px-4 py-2 text-foreground hover:bg-accent rounded-md">
                Avaleht
              </a>
              <a href="#" className="block px-4 py-2 text-foreground hover:bg-accent rounded-md">
                Otsi kinnisvara
              </a>
              <a href="#" className="block px-4 py-2 text-foreground hover:bg-accent rounded-md">
                Üürileandjakele
              </a>
              <a href="#" className="block px-4 py-2 text-foreground hover:bg-accent rounded-md">
                Abi
              </a>
              
              <div className="px-4 pt-4 space-y-2 border-t">
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Logi sisse
                </Button>
                <Button className="w-full justify-start bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Lisa kuulutus
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};