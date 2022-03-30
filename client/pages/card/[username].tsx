import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { serverSideAPI } from '../../utils/img';
import styles from '../../styles/pages/Card.module.scss'
import { BiCheckCircle, BiXCircle } from 'react-icons/bi';
import { getSession } from 'next-auth/react';

interface CardPageProps {
    success: boolean
}

const CardPage: NextPage<CardPageProps> = ({ success }) => {

    return (
        <>
            <Head>
                <title> Thẻ thành viên </title>
            </Head>
            <main className={styles.card}>
                {success
                    ? (
                        <div className={styles['mention']}>
                            <div className={styles['mention__icon']+" "+styles['mention__icon--success']}>
                                <BiCheckCircle />
                            </div>
                            <h1> Nạp voucher thành công ! </h1>
                        </div>
                    )
                    : (
                        <div className={styles['mention']}>
                            <div className={styles['mention__icon']+" "+styles['mention__icon--failed']}>
                                <BiXCircle />
                            </div>
                            <h1> Nạp voucher thất bại ! </h1>
                        </div>
                    )
                }
            </main>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const { username } = context.query
        const session = await getSession(context)

        if(!session) throw new Error()

        const res = await fetch(serverSideAPI + `/voucher/apply/${username}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.accessToken}`
            }
        })
        const data = await res.json()

        if (data?.statusCode >= 400) throw new Error()

        return {
            props: {
                success: true
            }
        }

    } catch (error) {
        return {
            props: {
                success: false
            }
        }
    }
}

export default CardPage