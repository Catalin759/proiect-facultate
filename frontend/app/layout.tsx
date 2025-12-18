import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "Proiect Facultate",
  description: "Aplicație full-stack pentru management proiecte",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body className="bg-gray-100">
        <Header />
        {children}
      </body>
    </html>
  );
}
