import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GlobalProviders } from "~/providers/global";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

const helveticaNeue = localFont({
  src: [
    { path: "./fonts/HelveticaNeueLTPro-Roman.7216551.woff2", weight: "400", style: "normal" },
    { path: "./fonts/HelveticaNeueLTPro-Bd.544b940.woff2", weight: "700", style: "normal" }
  ],
  variable: "--font-helvetica",
});

const ppEditorialNew = localFont({
  src: [
    { path: "./fonts/PPEditorialNew-Regular.2512cb3.woff2", weight: "400", style: "normal" },
    { path: "./fonts/PPEditorialNew-Italic.1d7842d.woff2", weight: "400", style: "italic" }
  ],
  variable: "--font-editorial",
});

const laBelleAurore = localFont({
  src: "./fonts/LaBelleAurore.07bd0fd.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-la-belle",
});

export const metadata: Metadata = {
  title: "Make My Form | Homepage",
  description: "Media Forwarding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${helveticaNeue.variable} ${ppEditorialNew.variable} ${laBelleAurore.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-[#FFFAF5] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-thumb]:rounded-full`}>
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
