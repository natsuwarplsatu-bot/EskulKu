
"use client";

import { useActionState, useState } from "react";
import { daftarEkskul, type HasilDaftar } from "./action";

type Props = {
  ekskulId: number;
  namaAwal: string;
  kelasAwal: string;
};

export default function FormDaftar({
  ekskulId,
  namaAwal,
  kelasAwal,
}: Props) {
  const [state, formAction, pending] = useActionState(
    daftarEkskul,
    {
      berhasil: false,
      pesan: "",
      galat: {},
      isian: {
        nama: namaAwal,
        kelas: kelasAwal,
      },
    } satisfies HasilDaftar
  );

  const [nama, setNama] = useState(namaAwal);
  const [kelas, setKelas] = useState(kelasAwal);



  return (
    <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">
        Daftar Ekskul Ini
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Isi nama dan kelas untuk mendaftar ekstrakurikuler.
      </p>

      <form action={formAction} className="mt-5 space-y-4">
        <input
          type="hidden"
          name="ekskulId"
          value={ekskulId}
        />

        {/* Nama */}
        <div>
          <label
            htmlFor="nama"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Nama
          </label>

          <input
            id="nama"
            name="nama"
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            disabled={pending}
            placeholder="Masukkan nama lengkap"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
          />

          {state.galat.nama && (
            <p className="mt-1 text-sm text-red-600">
              {state.galat.nama}
            </p>
          )}
        </div>

        {/* Kelas */}
        <div>
          <label
            htmlFor="kelas"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Kelas
          </label>

          <input
            id="kelas"
            name="kelas"
            type="text"
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            disabled={pending}
            placeholder="Contoh: XI RPL 1"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
          />

          {state.galat.kelas && (
            <p className="mt-1 text-sm text-red-600">
              {state.galat.kelas}
            </p>
          )}
        </div>

        {/* Galat umum */}
        {state.galat.umum && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {state.galat.umum}
          </p>
        )}

        {/* Pesan berhasil */}
        {state.berhasil && (
          <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {state.pesan}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Memproses ..." : "Daftar Ekskul"}
        </button>
      </form>
    </section>
  );
}
