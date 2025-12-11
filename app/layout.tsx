import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OgaTicha - Accessible Learning Platform",
  description: "An accessible education platform for students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-display antialiased">
        {children}
      </body>
    </html>
  );
}
