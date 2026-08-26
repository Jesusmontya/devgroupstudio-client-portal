import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata={title:'Dev Group Studio | Client Portal',description:'Secure client billing and service portal for Dev Group Studio.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}