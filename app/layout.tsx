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
        <script dangerouslySetInnerHTML={{__html: `(function(){try{var s=localStorage.getItem('settings');var settings={darkMode:false,highContrast:false,fontSize:'medium',voiceMode:true,notifications:true};if(s){try{Object.assign(settings,JSON.parse(s))}catch(e){}}else{var t=localStorage.getItem('theme');if(t==='dark'){settings.darkMode=true}else if(t==='light'){settings.darkMode=false}else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){settings.darkMode=true}}if(settings.darkMode){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}if(settings.highContrast){document.documentElement.classList.add('high-contrast')}else{document.documentElement.classList.remove('high-contrast')}document.body.className='font-'+settings.fontSize}catch(e){}})()`}} />
        <link rel="manifest" href="/manifest.json" />
        <link href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-display antialiased">
        
        {children}
      </body>
    </html>
  );
}
