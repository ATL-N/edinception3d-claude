// app/layout.js
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";

export const metadata = {
  title: "Tailornova Clone",
  description: "A clothing design platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
