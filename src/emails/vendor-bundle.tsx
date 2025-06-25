
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface VendorBundleEmailProps {
  vendorName: string;
  bundleUrl: string;
  documentCount: number;
}

export const VendorBundleEmail = ({
  vendorName,
  bundleUrl,
  documentCount,
}: VendorBundleEmailProps) => (
  <Html>
    <Head />
    <Preview>Dokumen Pengadaan dari RSUD Oto Iskandar Di Nata</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/LOGO_KABUPATEN_BANDUNG.svg/1200px-LOGO_KABUPATEN_BANDUNG.svg.png`}
          width="48"
          height="48"
          alt="Logo RSUD"
          style={logo}
        />
        <Heading style={heading}>Pemberitahuan Dokumen Pengadaan</Heading>
        <Section style={box}>
          <Text style={paragraph}>Yth. Bapak/Ibu {vendorName},</Text>
          <Text style={paragraph}>
            Bersama ini kami kirimkan {documentCount} dokumen terkait proses pengadaan barang/jasa
            dari RSUD Oto Iskandar Di Nata. Silakan klik tombol di bawah ini untuk melihat
            dan mengunduh bundle dokumen.
          </Text>
          <Button style={button} href={bundleUrl}>
            Lihat Bundle Dokumen
          </Button>
          <Text style={paragraph}>
            Jika tombol di atas tidak berfungsi, Anda dapat menyalin dan menempelkan tautan berikut di browser Anda:
          </Text>
          <Text style={link}>{bundleUrl}</Text>
          <Text style={paragraph}>
            Terima kasih atas perhatian dan kerja sama Anda.
          </Text>
          <Text style={paragraph}>
            Hormat kami,
            <br />
            Tim Pengadaan RSUD Oto Iskandar Di Nata
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default VendorBundleEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  border: '1px solid #e6e6e6',
};

const logo = {
  margin: '0 auto',
};

const box = {
  padding: '0 48px',
};

const heading = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
};

const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

const link = {
  color: '#007bff',
  fontSize: '14px',
  wordBreak: 'break-all' as const,
}

const button = {
  backgroundColor: '#007bff',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px',
};
