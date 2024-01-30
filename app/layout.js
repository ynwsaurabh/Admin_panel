'use client'
import Navbar from '@/Component/Navbar'
import './globals.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathName = usePathname();
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/Images/Logo1.jpg" />
        <title>Admin Panel - Student Portal Management</title>
      </head>
      <body>
        {pathName !== '/verify/login' ?
          <Navbar />
          : null
        }
        {children}
        <ToastContainer />
      </body>
    </html>
  )
}
