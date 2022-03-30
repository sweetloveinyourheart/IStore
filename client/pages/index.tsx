import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/pages/Home.module.scss'
import Menu from '../components/menu/menu'
import Products from '../components/products/products'
import Bill from '../components/bill/bill'
import { getSession } from "next-auth/react"
import { useCallback, useState } from 'react'

const Home: NextPage = () => {
  const [category, setCategory] = useState<string>("")

  const getProductsByCategory = useCallback((category: string) => {
    setCategory(category)
  }, [])

  return (
    <>
      <Head>
        <title>Cửa hàng</title>
        <meta name="description" content="Amber Shop - TP.BMT" />
      </Head>

      <main className={styles['home']} style={{background: `url(/background.jpg)`}}>
        <Menu setCategory={getProductsByCategory} category={category} />
        <Products category={category} />
        <Bill />
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context)

    if (!session) throw new Error()

    return {
      props: {}
    }

  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: '/auth'
      }
    }
  }
}

export default Home
