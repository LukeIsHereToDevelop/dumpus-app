import { PageProps } from "~/types";
import "./globals.css";
import { Rubik } from "next/font/google";
import { dir } from "i18next";
import { locales } from "~/i18n/settings";
import LocaleSwitcher from "~/i18n/LocaleSwitcher";
import Providers from "./providers";
import LoadingScreen from "./LoadingScreen";
import "~/i18n/client";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const rubik = Rubik({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
  params: { locale },
}: PageProps<
  {},
  {
    children: React.ReactNode;
  }
>) {
  return (
    <Providers>
      <html
        lang={locale}
        dir={dir(locale)}
        className={`${rubik.className} h-full bg-gray-950 text-gray-400`}
      >
        <body className="flex min-h-full flex-col">
          <LoadingScreen>{children}</LoadingScreen>
          {/* <LocaleSwitcher locale={locale} /> */}
        </body>
      </html>
    </Providers>
  );
}
