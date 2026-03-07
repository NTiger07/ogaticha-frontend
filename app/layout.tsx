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
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{localStorage.setItem('theme','light');var s=localStorage.getItem('settings');if(s){try{var p=JSON.parse(s);p.darkMode=false;localStorage.setItem('settings',JSON.stringify(p));}catch(e){} }document.documentElement.classList.remove('dark');}catch(e){} })()` }} />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-display antialiased bg-[#f8f8f5]">

        {children}
      </body>
    </html>
  );
}
