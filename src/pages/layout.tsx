import { Inter } from "next/font/google";
// import { PaletteMode } from '@mui/material'
import React, { useState} from "react";
import { ThemeProvider } from "@emotion/react";
import theme from '../theme';



const inter = Inter({ subsets: ["latin"] });

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
