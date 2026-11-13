
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  ekskul,
  pendaftar,
  hapusPendaftar,
} from "@/data/ekskul";

export async function batalkanPendaftaran(formData: FormData) {
  const nomor = Number(formData.get("nomor"));
  const ekskulId = Number(formData.get("ekskulId"));

  const cookieStore = await cookies();
  const nama = cookieStore.get("nama")?.value;
  const kelas = cookieStore.get("kelas")?.value;

  if (!nama || !kelas) return;

  if (
    !Number.isInteger(nomor) ||
    !Number.isInteger(ekskulId)
  ) return;

  const normalisasi = (value: string) =>
    value.trim().toLowerCase();

  const data = ekskul.find(
    (item) => item.id === ekskulId
  );

  if (!data) return;

  const pendaftaran = pendaftar.find(
    (item) =>
      item.nomor === nomor &&
      item.ekskulId === ekskulId &&
      normalisasi(item.nama) === normalisasi(nama) &&
      normalisasi(item.kelas) === normalisasi(kelas)
  );

  if (!pendaftaran) return;

  const berhasil = hapusPendaftar(nomor);

  if (!berhasil) return;

  revalidatePath("/saya");
  revalidatePath("/ekskul");
  revalidatePath(`/ekskul/${ekskulId}`);
}
