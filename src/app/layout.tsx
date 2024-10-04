import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Local font definitions
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for the site
export const metadata: Metadata = {
  title: "Hashnode Blogs API",
  description: "This side project takes your Hashnode host URL and returns all the blogs you have.",
  
  // Open Graph metadata for social sharing (Facebook, LinkedIn, etc.)
  openGraph: {
    title: "Hashnode Blogs API",
    description: "This side project takes your Hashnode host URL and returns all the blogs you have.",
    url: "https://hashnode-blog-finder.vercel.app", // Your site URL
    images: [
      {
        url: "/thumbnail.png", // Public image URL (path inside public folder)
        width: 800, // Width of the image
        height: 600, // Height of the image
        alt: "Hashnode Blogs API Preview", // Alt text for the image
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image", // Ensures large image preview on Twitter
    title: "Hashnode Blogs API",
    description: "This side project takes your Hashnode host URL and returns all the blogs you have.",
    images: [
      {
        url: "/thumbnail.png", // Public image URL (path inside public folder)
        alt: "Hashnode Blogs API Preview", // Alt text for the image
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
