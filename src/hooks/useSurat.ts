
"use client";

import useSWR from 'swr';
import { Surat, fetchAllSurat } from '@/data/surat';

const SURAT_KEY = '/api/surat';

// SWR fetcher function must be an async function or return a promise.
const fetcher = async () => {
    return fetchAllSurat();
}

export function useSurat() {
  const { data, error, isLoading, mutate } = useSWR<Surat[]>(SURAT_KEY, fetcher, {
    // Optional: Konfigurasi SWR
    // revalidateOnFocus: false, // Nonaktifkan revalidasi saat window fokus
    // refreshInterval: 60000, // Revalidasi setiap 60 detik
  });

  return {
    surat: data,
    isLoading,
    error,
    mutate,
  };
}
