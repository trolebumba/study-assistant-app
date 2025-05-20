import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Виртуальный ассистент для подготовки к экзаменам",
  description: "Персонализированное обучение с использованием ИИ-технологий",
  // Добавляем метаданные для SEO
  keywords: "образование, подготовка к экзаменам, ИИ, искусственный интеллект, обучение, тесты",
  authors: [{ name: "Study Assistant Team" }],
  openGraph: {
    title: "Виртуальный ассистент для подготовки к экзаменам",
    description: "Персонализированное обучение с использованием ИИ-технологий",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        {/* Добавляем мета-теги для SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4F46E5" />
        <link rel="canonical" href="https://study-assistant-app.vercel.app" />
      </head>
      <body className="antialiased">
        <QueryProvider>
          <main id="main-content">
            {children}
          </main>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
