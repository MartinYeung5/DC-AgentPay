import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Sidebar } from "../../components/Sidebar";
import "./globals.css";

export const metadata = {
  title: "AI Smart Payment — Injective PaaS",
  description: "The payment highway for AI agents on Injective"
};

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
