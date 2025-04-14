import Header from "@/components/shared/header";
import Footer from "@/components/footer";
import { ThemeProvider } from "next-themes"; // Import ThemeProvider
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning={true}>
      <body className="flex h-screen flex-col bg-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange={true}
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
