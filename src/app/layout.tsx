import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Виртуальный ассистент для подготовки к экзаменам",
  description: "Персонализированное обучение с использованием ИИ-технологий",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
