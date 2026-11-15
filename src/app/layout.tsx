import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MGCSIILS - Student Management System",
  description:
    "Official Academic & Student Lifecycle Portal - Moderator Gladstone CSI Institute of Legal Studies (Affiliated to University of Kerala)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
