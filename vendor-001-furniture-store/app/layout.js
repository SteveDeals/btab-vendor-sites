import './globals.css';

export const metadata = {
  title: 'Vendor Store - BTAB Platform',
  description: 'Custom vendor store powered by BTAB',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}