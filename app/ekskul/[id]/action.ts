
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  ekskul,
  pendaftar,
  tambahPendaftar,
} from "@/data/ekskul";

export type HasilDaftar = {
  berhasil: boolean;
  pesan: string;
  galat: {
    nama?: string;
    kelas?: string;
    umum?: string;
  };
  isian: {
    nama: string;
    kelas: string;
  };
};

export async function daftarEkskul(
  prevState: HasilDaftar,
  formData: FormData
): Promise<HasilDaftar> {
  const nama = String(formData.get("nama") ?? "").trim();
  const kelas = String(formData.get("kelas") ?? "").trim();
  const id = Number(formData.get("ekskulId"));

  const isian = { nama, kelas };
  const galat: HasilDaftar["galat"] = {};

  // 1. Validasi nama dan kelas
  const jumlahHuruf = (nama.match(/\p{L}/gu) ?? []).length;

  if (jumlahHuruf < 3) {
    galat.nama = "Nama minimal 3 huruf.";
  }

  if (kelas.length < 3) {
    galat.kelas = "Kelas minimal 3 karakter.";
  }

  if (galat.nama || galat.kelas) {
    return {
      berhasil: false,
      pesan: "",
      galat,
      isian,
    };
  }

  // 2. Memeriksa ID ekskul
  const data = ekskul.find((item) => item.id === id);

  if (!Number.isInteger(id) || !data) {
    return {
      berhasil: false,
      pesan: "",
      galat: {
        umum: "Ekstrakurikuler tidak ditemukan.",
      },
      isian,
    };
  }

  const normalisasi = (value: string) =>
    value.trim().toLocaleLowerCase("id-ID");

  const namaNormal = normalisasi(nama);
  const kelasNormal = normalisasi(kelas);

  // 3. Memeriksa pendaftaran ganda
  const sudahTerdaftar = pendaftar.some(
    (item) =>
      item.ekskulId === id &&
      normalisasi(item.nama) === namaNormal &&
      normalisasi(item.kelas) === kelasNormal
  );

  if (sudahTerdaftar) {
    return {
      berhasil: false,
      pesan: "",
      galat: {
        umum: `${nama} (${kelas}) sudah terdaftar di ${data.nama}.`,
      },
      isian,
    };
  }

  // 4. Memeriksa kuota
  const jumlahAnggota = pendaftar.filter(
    (item) => item.ekskulId === id
  ).length;

  if (jumlahAnggota >= data.kuota) {
    return {
      berhasil: false,
      pesan: "",
      galat: {
        umum: `Kuota ${data.nama} sudah penuh (${data.kuota} orang).`,
      },
      isian,
    };
  }

  // 5. Memeriksa jadwal bentrok
  const anggotaBentrok = pendaftar.find((item) => {
    if (
      normalisasi(item.nama) !== namaNormal ||
      normalisasi(item.kelas) !== kelasNormal
    ) {
      return false;
    }

    const ekskulLama = ekskul.find(
      (e) => e.id === item.ekskulId
    );

    return (
      ekskulLama !== undefined &&
      ekskulLama.id !== id &&
      ekskulLama.hari === data.hari &&
      ekskulLama.sesi === data.sesi
    );
  });

  if (anggotaBentrok) {
    const ekskulLama = ekskul.find(
      (item) => item.id === anggotaBentrok.ekskulId
    )!;

    return {
      berhasil: false,
      pesan: "",
      galat: {
        umum: `Jadwal bentrok dengan ${ekskulLama.nama} (${ekskulLama.hari}, sesi ${ekskulLama.sesi}).`,
      },
      isian,
    };
  }

  // 6. Menambahkan pendaftar
  const nomor = tambahPendaftar({
    ekskulId: id,
    nama,
    kelas,
  });

  // 7. Menyimpan nama dan kelas ke cookie
  const cookieStore = await cookies();

  const opsiCookie = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };

  cookieStore.set("nama", nama, opsiCookie);
  cookieStore.set("kelas", kelas, opsiCookie);

  // 8. Memperbarui halaman terkait
  revalidatePath("/ekskul");
  revalidatePath(`/ekskul/${id}`);

  return {
    berhasil: true,
    pesan: `Pendaftaran #${nomor} berhasil: ${data.nama}, ${data.hari}, sesi ${data.sesi} (${data.sesi === 1 ? "15.00-16.30" : "16.30-18.00"}).`,
    galat: {},
    isian,
  };
}
