
import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ekskul, JAM_SESI } from "@/data/ekskul";
import { ambilAnggota } from "@/data/ambil";
import FormDaftar from "./FormDaftar";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const data = ekskul.find((item) => item.id === Number(id));

  return {
    title: data ? data.nama : "Ekskul tidak ditemukan",
  };
}

export default async function DetailEkskul({ params }: Props) {
  const { id } = await params;

  const data = ekskul.find(
    (item) => item.id === Number(id)
  );

  if (!data) {
    notFound();
  }

  const cookieStore = await cookies();

  const namaAwal = cookieStore.get("nama")?.value ?? "";
  const kelasAwal = cookieStore.get("kelas")?.value ?? "";

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Informasi ekskul */}
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            {data.kategori}
          </span>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            {data.nama}
          </h1>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Hari</p>
              <p className="font-semibold">{data.hari}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Sesi</p>
              <p className="font-semibold">
                Sesi {data.sesi} ({JAM_SESI[data.sesi]})
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Pembina</p>
              <p className="font-semibold">{data.pembina}</p>
            </div>
          </div>
        </section>

        {/* Formulir pendaftaran */}
        <FormDaftar
          ekskulId={data.id}
          namaAwal={namaAwal}
          kelasAwal={kelasAwal}
        />

        {/* Anggota terdaftar */}
        <Suspense
          fallback={
            <section className="mt-6 rounded-xl border bg-white p-6">
              <h2 className="text-xl font-bold">
                Anggota terdaftar
              </h2>

              <p className="mt-4 text-gray-500">
                Memuat anggota ...
              </p>
            </section>
          }
        >
          <DaftarAnggota
            id={data.id}
            kuota={data.kuota}
            namaCookie={namaAwal}
          />
        </Suspense>

      </div>
    </main>
  );
}

async function DaftarAnggota({
  id,
  kuota,
  namaCookie,
}: {
  id: number;
  kuota: number;
  namaCookie: string;
}) {
  const anggota = await ambilAnggota(id);

  return (
    <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">
        Anggota terdaftar
      </h2>

      <p className="mt-2 text-sm text-gray-600">
        {anggota.length} dari {kuota} tempat terisi
      </p>

      {anggota.length === 0 ? (
        <p className="mt-5 text-gray-500">
          Belum ada anggota.
        </p>
      ) : (
        <ul className="mt-5 divide-y">
          {anggota.map((item) => {
            const kamu =
              namaCookie.trim().toLowerCase() ===
              item.nama.trim().toLowerCase();

            return (
              <li
                key={item.nomor}
                className="flex items-center justify-between gap-3 py-4"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {item.nama}
                  </p>

                  <p className="text-sm text-gray-500">
                    {item.kelas}
                  </p>
                </div>

                {kamu && (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    Kamu
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
