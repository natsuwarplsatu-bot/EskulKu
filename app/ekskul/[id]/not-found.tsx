
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold text-gray-900">
        404
      </h1>

      <h2 className="mt-3 text-xl font-semibold">
        Ekskul tidak ditemukan
      </h2>

      <p className="mt-2 text-gray-500">
        Ekstrakurikuler yang kamu cari tidak tersedia.
      </p>

      <Link
        href="/ekskul"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        Kembali ke Daftar Ekskul
      </Link>
    </main>
  );
}
