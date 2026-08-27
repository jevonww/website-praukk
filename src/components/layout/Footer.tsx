import { Store, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#22c55e] rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                Tahu<span className="text-[#4ade80]">Bakso</span>
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Tahu Bakso berkualitas dengan bahan segar dan halal. Enak, kenyal, dan bergizi.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Menu</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-[#4ade80] transition-colors">Beranda</Link></li>
              <li><Link href="/produk" className="hover:text-[#4ade80] transition-colors">Produk</Link></li>
              <li><Link href="/keranjang" className="hover:text-[#4ade80] transition-colors">Keranjang</Link></li>
              <li><Link href="/pesanan" className="hover:text-[#4ade80] transition-colors">Pesanan</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Kontak</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#4ade80]" />
                0812-3456-7890
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#4ade80]" />
                halo@tahubakso.id
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#4ade80]" />
                Jakarta, Indonesia
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Jam Operasional</h3>
            <ul className="space-y-2 text-sm">
              <li>Senin - Sabtu: 08:00 - 20:00</li>
              <li>Minggu: 09:00 - 17:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} TahuBakso. Hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
