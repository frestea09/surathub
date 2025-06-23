
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const initialUsersData = [
  {
    id: "dir-01",
    nip: "196711022002121001",
    nama: "dr. H. Yani Sumpena Muchtar, SH, MH.Kes",
    jabatan: "Direktur",
    status: "Aktif",
    password: "password-direktur",
  },
  {
    id: "ppk-01",
    nip: "198408272008011005",
    nama: "Saep Trian Prasetia.S.Si.Apt",
    jabatan: "Pejabat Pembuat Komitmen",
    status: "Aktif",
    password: "password-ppk",
  },
  {
    id: "ppbj-01",
    nip: "197711042005042013",
    nama: "Deti Hapitri, A.Md.Gz",
    jabatan: "Pejabat Pengadaan Barang Jasa",
    status: "Aktif",
    password: "password-ppbj",
  },
  {
    id: "admin-01",
    nip: "admin",
    nama: "Admin Utama",
    jabatan: "Administrator Sistem",
    status: "Aktif",
    password: "password-admin",
  },
  {
    id: "keu-01",
    nip: "198001012005012002",
    nama: "Jane Doe",
    jabatan: "Kepala Bagian Keuangan",
    status: "Aktif",
    password: "password-keuangan",
  },
  {
    id: "umum-01",
    nip: "198203152006041001",
    nama: "Budi Darmawan",
    jabatan: "Kepala Bagian Umum",
    status: "Non-Aktif",
    password: "password-umum",
  },
   {
    id: "yanmed-01",
    nip: "197505202003122001",
    nama: "Dr. Anisa Fitriani, Sp.A",
    jabatan: "Kepala Bidang Pelayanan Medik",
    status: "Aktif",
    password: "password-yanmed",
  },
  {
    id: "staf-01",
    nip: "199501012020121001",
    nama: "Andi Wijaya",
    jabatan: "Tim Kerja Bidang Umum & Kepegawaian",
    status: "Aktif",
    password: "password-staf",
  },
];

async function main() {
  console.log(`Start seeding ...`)
  for (const u of initialUsersData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
