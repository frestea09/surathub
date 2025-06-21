import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';
import type {Pathnames} from 'next-intl/navigation';

export const locales = ['id', 'en'] as const;
export const localePrefix = 'always';

export const pathnames = {
  '/': '/',
  '/dashboard': '/dashboard',
  '/admin': '/admin',
  '/buat-bastb': '/buat-bastb',
  '/buat-berita-acara': '/buat-berita-acara',
  '/buat-surat': '/buat-surat',
  '/buat-surat-pesanan': '/buat-surat-pesanan',
  '/buat-surat-pesanan-final': '/buat-surat-pesanan-final',
  '/notifikasi': '/notifikasi',
  '/pengaturan': '/pengaturan',
  '/profil': '/profil',
  '/register': '/register',
  '/surat-keluar': '/surat-keluar',
  '/surat-masuk': '/surat-masuk',
} satisfies Pathnames<typeof locales>;


export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({
    locales,
    pathnames,
    localePrefix
  });