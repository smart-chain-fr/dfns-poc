import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect } from "react";
import { useRouter } from "next/router"
import logo from '../../public/logo.png'
import Button from '@mui/material/Button';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  let accessKey, item;
  const router = useRouter()

  useEffect(() => {
    accessKey = localStorage.getItem('access_key')
    if (accessKey==null) router.push('/login')
  }, [])

  return (
    <>
      <Head>
        <title>Dfns Demo App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>

      <Image
        src={logo}
        alt="logo"
        width={411} 
        height={200} 
        // blurDataURL="data:..." automatically provided
        // placeholder="blur" // Optional blur-up while loading
      />
      Your user has logged in and is ready to create a wallet...
      <Button variant="contained" onClick={() => {
        alert('clicked');
      }}>Create Wallet</Button>

      </main>
    </>
  )
}
