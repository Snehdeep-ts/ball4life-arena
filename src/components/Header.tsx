import { Instagram, Phone, MessageCircle } from 'lucide-react'

export default function Header() {
  return (
    <div className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-6">
          <div className="text-center mb-6">
            <h1 className="animate-header-title">
              <span className="inline-block font-extrabold text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 font-orbitron tracking-wide">
                BALL 4 LIFE
              </span>
              <span className="block text-2xl md:text-3xl text-stone-400 font-light mt-2 tracking-widest animate-header-subtitle">
                ARENA
              </span>
            </h1>
          </div>
          
          <div className="flex justify-center gap-6 animate-header-links">
            <a 
              href="https://www.instagram.com/ball4lifearena/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-300 text-pink-400 hover:scale-105"
            >
              <Instagram size={20} /> 
              <span className="hidden sm:inline">Follow us</span>
            </a>
            <a 
              href="https://wa.me/918923014103"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-300 text-green-400 hover:scale-105"
            >
              <MessageCircle size={20} /> 
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <a 
              href="tel:+918923014103"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-300 text-blue-400 hover:scale-105"
            >
              <Phone size={20} /> 
              <span className="hidden sm:inline">Call us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}