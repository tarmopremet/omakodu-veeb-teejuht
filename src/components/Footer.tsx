import { Mail, Phone, Facebook, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Kontaktid</h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-lg">Rendiise OÜ</p>
                <p className="text-gray-300">Reg. nr: 10646588</p>
                <p className="text-gray-300">KMKR nr: EE100645776</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-blue-400" />
                <a href="mailto:info@rendiise.ee" className="text-blue-400 hover:text-blue-300">
                  info@rendiise.ee
                </a>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-blue-400" />
                <a href="tel:+3725027355" className="text-blue-400 hover:text-blue-300">
                  +372 502 7355
                </a>
              </div>
            </div>
          </div>
          
          {/* Legal Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Tingimused</h3>
            <div className="space-y-2">
              <a href="/privaatsustingimused" className="text-gray-300 hover:text-white block">
                Privaatsustingimused
              </a>
              <a href="/kasutustingimused" className="text-gray-300 hover:text-white block">
                Kasutustingimused
              </a>
              <a href="/rendieeskiri" className="text-gray-300 hover:text-white block">
                Rendieeskiri
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4">Jälgi meid</h3>
            <div className="space-y-3">
              <a 
                href="https://www.facebook.com/rendiise" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5 text-blue-400" />
                <span>Facebook</span>
              </a>
              
              <a 
                href="https://www.instagram.com/rendiise" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5 text-pink-400" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Rendiise OÜ. Kõik õigused kaitstud.
          </p>
        </div>
      </div>
    </footer>
  );
};