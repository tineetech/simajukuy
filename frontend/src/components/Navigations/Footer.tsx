export default function Footer() {
  return (
    <footer className="bg-primary mx-6 px-5 rounded-4xl mb-10 text-white dark:text-textDark">
      <div className="container mx-auto py-10 px-6">
        <div className="justify-between flex flex-wrap gap-8">
          {/* Logo & Deskripsi */}
          <div className="w-100">
            <h2 className="text-2xl font-bold mb-3">Simajukuy</h2>
            <p className="text-sm leading-relaxed">
              Platform AI & komunitas untuk membantu masyarakat melaporkan masalah kota dan berbagi solusi demi lingkungan yang lebih baik.
            </p>
          </div>

          {/* Navigasi */}
          <div className="flex md:justify-center items-center space-x-6">
            <ul className="space-y-4 text-sm">
              <li><a href="/" className="hover:bg-primary hover:text-white rounded-full py-1 px-2.5 transition-all ease-in-out">Beranda</a></li>
              <li><a href="/lapor" className="hover:bg-primary hover:text-white rounded-full py-1 px-2.5 transition-all ease-in-out">Lapor Masalah</a></li>
              <li><a href="/komunitas" className="hover:bg-primary hover:text-white rounded-full py-1 px-2.5 transition-all ease-in-out">Komunitas</a></li>
            </ul>
            <ul className="space-y-4 text-sm">
              <li><a href="/artikel" className="hover:bg-primary hover:text-white rounded-full py-1 px-2.5 transition-all ease-in-out">Artikel</a></li>
              <li><a href="/login" className="hover:bg-primary hover:text-white rounded-full py-1 px-2.5 transition-all ease-in-out">Login</a></li>
              <li><a href="/register" className="hover:bg-primary hover:text-white rounded-full py-1 px-2.5 transition-all ease-in-out">Register</a></li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Kontak</h3>
            <ul className="text-sm space-y-2">
              <li>Email: simajukuy@gmail.com</li>
              <li>WhatsApp: +62 812 3456 7890</li>
              <li>Alamat: Jl. Kota Bersih No.1, Indonesia</li>
            </ul>
          </div>
        </div>

        {/* Garis & Copyright */}
        <div className="border-t border-gray-300 mt-10 pt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Simajukuy. Semua hak dilindungi.
        </div>
      </div>
    </footer>
  );
}
