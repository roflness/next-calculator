import { Inter } from "next/font/google";
import { PaletteMode } from '@mui/material'
import React, { useState} from "react";
import { ThemeProvider } from "@emotion/react";
import theme from '/src/theme.ts';



const inter = Inter({ subsets: ["latin"] });
const [mode, setMode] = useState<PaletteMode>('light')

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
        
      </body>
    </html>
  );
}
