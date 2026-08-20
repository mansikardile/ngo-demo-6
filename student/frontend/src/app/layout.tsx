import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/lib/query-provider';
import GoogleAuthProvider from '@/lib/google-auth-provider';

export const metadata: Metadata = {
  title: 'Katalyst | Empowering Young Women in STEM',
  description:
    'Join Katalyst to unlock STEM scholarships, 1:1 mentorship from global tech leaders, skill labs, and career opportunities.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        <GoogleAuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
