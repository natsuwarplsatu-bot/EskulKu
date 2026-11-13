
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { ekskul, pendaftar, JAM_SESI } from "@/data/ekskul";
import { batalkanPendaftaran } from "./action";

export const metadata: Metadata = {
  title: "Ekskul Saya",
};

export default function SayaPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-800">
      <div className="mx-auto max-w-3xl">
        <Suspense
          fallback={
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              Memuat ekskul kamu...
            </div>
          }
        >
          <KontenSaya />
        </Suspense>
      </div>
    </main>
  );
}

async function KontenSaya() {
  const cookieStore = await cookies();

  const nama = cookieStore.get("nama")?.value;
  const kelas = cookieStore.get("kelas")?.value;

  if (!nama || !kelas) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
        <h1 className="mb-4 text-3xl font-bold text-slate-800">
          Ekskul Saya
        </h1>

        <p className="mb-6 text-slate-500">
          Kamu belum mendaftar apa pun.
        </p>

        <Link
          href="/ekskul"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Lihat Daftar Ekskul
        </Link>
      </section>
    );
  }

  const normalisasi = (teks: string) => teks.trim().toLowerCase();

  const ekskulSaya = pendaftar
    .filter(
      (item) =>
        normalisasi(item.nama) === normalisasi(nama) &&
        normalisasi(item.kelas) === normalisasi(kelas)
    )
    .map((item) => ({
      ...item,
      dataEkskul: ekskul.find((e) => e.id === item.ekskulId),
    }))
    .filter((item) => item.dataEkskul !== undefined);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="mb-6 text-3xl font-bold text-slate-800">
        Ekskul Saya
      </h1>

      <div className="mb-8 rounded-xl bg-blue-50 p-5">
        <p className="text-lg font-bold text-slate-800">{nama}</p>
        <p className="mt-1 text-sm text-slate-600">
          {kelas} · {ekskulSaya.length} ekskul diikuti
        </p>
      </div>

      {ekskulSaya.length === 0 ? (
        <div className="py-6 text-center">
          <p className="mb-5 text-slate-500">
            Belum ada ekskul yang diikuti.
          </p>
          <Link
            href="/ekskul"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Lihat Daftar Ekskul
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {ekskulSaya.map((item) => {
            const data = item.dataEkskul!;

            return (
              <article
                key={item.nomor}
                className="rounded-xl border border-slate-200 p-5 transition hover:border-blue-300"
              >
                <h2 className="text-xl font-bold text-slate-800">
                  <Link
                    href={`/ekskul/${data.id}`}
                    className="hover:text-blue-600"
                  >
                    {data.nama}
                  </Link>
                </h2>

                <div className="mt-3 space-y-1 text-sm text-slate-600">
                  <p>Hari: {data.hari}</p>
                  <p>
                    Sesi {data.sesi} ({JAM_SESI[data.sesi]})
                  </p>
                </div>

                <form action={batalkanPendaftaran} className="mt-5">
                  <input
                    type="hidden"
                    name="nomor"
                    value={item.nomor}
                  />
                  <input
                    type="hidden"
                    name="ekskulId"
                    value={data.id}
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    Batalkan
                  </button>
                </form>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-8 border-t border-slate-200 pt-5">
        <Link
          href="/ekskul"
          className="font-medium text-blue-600 hover:underline"
        >
          ← Kembali ke daftar ekskul
        </Link>
      </div>
    </section>
  );
}
