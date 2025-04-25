export default function ReportForm() {
    return (
        <div className="relative z-10 -mt-40 px-4 pb-20">
            <div className="bg-tertiary dark:bg-tertiaryDark rounded-2xl shadow-xl max-w-4xl mx-auto p-8">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nama Anda</label>
                        <input type="text" className="w-full border border-gray-300 rounded-md p-2" placeholder="Nama lengkap" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" className="w-full border border-gray-300 rounded-md p-2" placeholder="you@email.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Nomor Telepon</label>
                        <input type="text" className="w-full border border-gray-300 rounded-md p-2" placeholder="08xxxxxxxxxx" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Lokasi Masalah</label>
                        <input type="text" className="w-full border border-gray-300 rounded-md p-2" placeholder="Nama jalan, RT/RW, dll" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Jenis Masalah</label>
                        <select className="w-full border border-gray-300 rounded-md p-2">
                            <option>Jalan rusak</option>
                            <option>Sampah menumpuk</option>
                            <option>PJU mati</option>
                            <option>Banjir</option>
                            <option>Lainnya</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Estimasi Waktu Terjadi</label>
                        <input type="text" className="w-full border border-gray-300 rounded-md p-2" placeholder="Contoh: sejak 3 hari lalu" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Deskripsi</label>
                        <textarea className="w-full border border-gray-300 rounded-md p-2 h-28" placeholder="Jelaskan masalah dengan detail..."></textarea>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Upload Foto</label>
                        <input type="file" className="w-full" />
                    </div>
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="bg-accent dark:bg-accentDark text-textDark px-6 py-2 rounded-md hover:bg-accent/80 hover:cursor-pointer transition"
                        >
                            Kirim Laporan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}