
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import VendorBundleEmail from '@/emails/vendor-bundle';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { to, vendorName, bundleUrl, documentCount } = await req.json();

    if (!to || !vendorName || !bundleUrl || !documentCount) {
      return NextResponse.json({ error: 'Data tidak lengkap.' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'SuratHub RSUD Otista <onboarding@resend.dev>',
      to: [to],
      subject: `Dokumen Pengadaan dari RSUD Oto Iskandar Di Nata`,
      react: VendorBundleEmail({
        vendorName,
        bundleUrl,
        documentCount,
      })
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email berhasil dikirim!', data }, { status: 200 });
  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
