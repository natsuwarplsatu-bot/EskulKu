
import { ekskul, pendaftar, type Pendaftar } from "./ekskul";

function jeda(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function ambilSemuaEkskul() {
  await jeda(1000);
  return ekskul;
}

export async function ambilAnggota(id: number): Promise<Pendaftar[]> {
  await jeda(1500);

  return pendaftar.filter(
    (anggota) => anggota.ekskulId === id
  );
}
