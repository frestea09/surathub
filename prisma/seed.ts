
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const initialUsersData = [
  {
    nip: "196711022002121001",
    nama: "dr. H. Yani Sumpena Muchtar, SH, MH.Kes",
    jabatan: "Direktur",
    status: "Aktif",
    password: "password-direktur",
  },
  {
    nip: "198408272008011005",
    nama: "Saep Trian Prasetia.S.Si.Apt",
    jabatan: "Pejabat Pembuat Komitmen",
    status: "Aktif",
    password: "password-ppk",
  },
  {
    nip: "197711042005042013",
    nama: "Deti Hapitri, A.Md.Gz",
    jabatan: "Pejabat Pengadaan Barang Jasa",
    status: "Aktif",
    password: "password-ppbj",
  },
  {
    nip: "admin",
    nama: "Admin Utama",
    jabatan: "Administrator Sistem",
    status: "Aktif",
    password: "password-admin",
  },
  {
    nip: "198001012005012002",
    nama: "Jane Doe",
    jabatan: "Kepala Bagian Keuangan",
    status: "Aktif",
    password: "password-keuangan",
  },
  {
    nip: "198203152006041001",
    nama: "Budi Darmawan",
    jabatan: "Kepala Bagian Umum",
    status: "Non-Aktif",
    password: "password-umum",
  },
   {
    nip: "197505202003122001",
    nama: "Dr. Anisa Fitriani, Sp.A",
    jabatan: "Kepala Bidang Pelayanan Medik",
    status: "Aktif",
    password: "password-yanmed",
  },
  {
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
