
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ambilSemuaEkskul } from "@/data/ambil";
import {
  DAFTAR_KATEGORI,
  DAFTAR_HARI,
  JAM_SESI,
  pendaftar,
  type Kategori,
} from "@/data/ekskul";
import Loading from "./[id]/loading";

export const metadata: Metadata = {
  title: "Daftar Ekskul",
};

type Props = {
  searchParams: Promise<{
    kategori?: string | string[];
    hari?: string | string[];
  }>;
};

export default function DaftarEkskul({ searchParams }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <KontenEkskul searchParams={searchParams} />
    </Suspense>
  );
}

async function KontenEkskul({ searchParams }: Props) {
  const params = await searchParams;

  const kategoriQuery = Array.isArray(params.kategori)
    ? params.kategori[0]
    : params.kategori;

  const hariQuery = Array.isArray(params.hari)
    ? params.hari[0]
    : params.hari;

  const kategori: Kategori | "" = DAFTAR_KATEGORI.includes(
    kategoriQuery as Kategori
  )
    ? (kategoriQuery as Kategori)
    : "";

  const hari = DAFTAR_HARI.includes(hariQuery ?? "")
    ? hariQuery!
    : "";

  const semuaEkskul = await ambilSemuaEkskul();

  const hasil = semuaEkskul.filter((item) => {
    const cocokKategori = !kategori || item.kategori === kategori;
    const cocokHari = !hari || item.hari === hari;

    return cocokKategori && cocokHari;
  });

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900">
          Daftar Ekstrakurikuler
        </h1>

        <p className="mt-2 text-gray-600">
          Temukan ekstrakurikuler sesuai minat dan bakatmu.
        </p>

        <form
          action="/ekskul"
          method="GET"
          className="mt-8 flex flex-col gap-4 rounded-xl border bg-white p-5 sm:flex-row"
        >
          <div className="flex-1">
            <label
              htmlFor="kategori"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Kategori
            </label>

            <select
              id="kategori"
              name="kategori"
              defaultValue={kategori}
              className="w-full rounded-lg border border-gray-300 p-3"
            >
              <option value="">Semua kategori</option>

              {DAFTAR_KATEGORI.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label
              htmlFor="hari"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Hari
            </label>

            <select
              id="hari"
              name="hari"
              defaultValue={hari}
              className="w-full rounded-lg border border-gray-300 p-3"
            >
              <option value="">Semua hari</option>

              {DAFTAR_HARI.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 sm:w-auto"
            >
              Terapkan
            </button>
          </div>
        </form>

        <p className="mt-6 font-medium text-gray-700">
          {hasil.length} ekskul ditemukan
        </p>

        {hasil.length > 0 ? (
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hasil.map((item) => {
              const jumlahPendaftar = pendaftar.filter(
                (p) => p.ekskulId === item.id
              ).length;

              const sisaTempat = Math.max(
                item.kuota - jumlahPendaftar,
                0
              );

              return (
                <Link
                  key={item.id}
                  href={`/ekskul/${item.id}`}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    {item.kategori}
                  </span>

                  <h2 className="mt-4 text-xl font-bold text-gray-900">
                    {item.nama}
                  </h2>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p>Hari: {item.hari}</p>

                    <p>
                      Sesi {item.sesi}: {JAM_SESI[item.sesi]}
                    </p>

                    {sisaTempat > 0 ? (
                      <p className="font-medium text-green-600">
                        Sisa {sisaTempat} dari {item.kuota} tempat
                      </p>
                    ) : (
                      <p className="font-bold text-red-600">
                        Penuh
                      </p>
                    )}
                  </div>

                  <div className="mt-5 border-t pt-4 text-sm font-medium text-blue-600">
                    Lihat Detail →
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border bg-white p-10 text-center">
            <p className="text-gray-600">
              Tidak ada ekskul yang cocok.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
