
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import VendorBundleEmail from '@/emails/vendor-bundle';
import * as React from 'react';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Kunci API Resend (RESEND_API_KEY) tidak diatur di environment variables.' },
        { status: 500 }
      );
    }
    const resend = new Resend(apiKey);

    const { to, vendorName, bundleUrl, documentCount } = await req.json();

    if (!to || !vendorName || !bundleUrl || !documentCount) {
      return NextResponse.json({ error: 'Data tidak lengkap.' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'SuratHub RSUD Otista <onboarding@resend.dev>',
      to: [to],
      subject: `Dokumen Pengadaan dari RSUD Oto Iskandar Di Nata`,
      react: <VendorBundleEmail
        vendorName={vendorName}
        bundleUrl={bundleUrl}
        documentCount={documentCount}
      />
    });

    if (error) {
      console.error("Resend API Error:", error);
      const errorMessage = error.message.includes('from address is not verified') 
          ? 'Alamat email pengirim (onboarding@resend.dev) belum diverifikasi di akun Resend Anda.'
          : error.message;
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email berhasil dikirim!', data }, { status: 200 });
  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
