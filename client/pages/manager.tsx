import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { BiCreditCardAlt, BiCustomize, BiLabel, BiLogOutCircle, BiRocket, BiSpa, BiTable, BiUserCircle } from "react-icons/bi"
import CategoryManager from "../components/manager/category/categoryManager"
import OverView from "../components/manager/overview/overview"
import ProductManager from "../components/manager/product/productManager"
import ShopVoucher from "../components/manager/shopVoucher/shopVoucher"
import styles from '../styles/pages/Manager.module.scss'
import { getSession, signOut } from "next-auth/react"
import User from "../components/manager/user/users"
import Voucher from "../components/manager/voucher/voucher"
import ShopTable from "../components/manager/shopTable/shopTable"

const ManagerPage: NextPage = () => {
    const [menu, setMenu] = useState<number>(0)

    const { query, push } = useRouter()

    useEffect(() => {
        const { state } = query
        if (state) {
            setMenu(Number(state))
        } else {
            setMenu(0)
        }
    }, [query])

    const renderView = () => {
        switch (menu) {
            case 0:
                return <OverView />
            case 1:
                return <ShopVoucher />
            case 2:
                return <ProductManager />
            case 3:
                return <CategoryManager />
            case 4:
                return <User />
            case 5:
                return <Voucher />
            case 6:
                return <ShopTable />

            default:
                return <OverView />
        }
    }

    return (
        <>
            <Head>
                <title> Trang quản trị </title>
            </Head>
            <header className={styles["header"]}>
                <div className={styles['image']}>
                    <Image
                        src={"/logo.png"}
                        width={40}
                        height={40}
                        alt="#"
                        onClick={() => push('/')}
                    />
                </div>
                <div className={styles['account']}>
                    <div>
                        <div className={styles['account__name']}> Administrator </div>
                        <div className={styles['account__role']}> Manager </div>
                    </div>
                    <div className={styles['account__logout']}>
                        <button onClick={() => signOut()}>
                            <BiLogOutCircle />
                        </button>
                    </div>
                </div>
            </header>
            <main className={styles["manager"]}>
                <div className={styles["menu"]}>
                    <h5> Shop </h5>
                    <div
                        className={styles['menu__item'] + " " + (menu === 0 ? styles['menu__item--active'] : "")}
                        onClick={() => push('/manager')}
                    >
                        <BiRocket />
                        <span> Tổng Quan </span>
                    </div>
                    <div
                        className={styles['menu__item'] + " " + (menu === 1 ? styles['menu__item--active'] : "")}
                        onClick={() => push('/manager?state=1')}
                    >
                        <BiLabel />
                        <span> Voucher </span>
                    </div>
                    <div
                        className={styles['menu__item'] + " " + (menu === 2 ? styles['menu__item--active'] : "")}
                        onClick={() => push('/manager?state=2')}
                    >
                        <BiSpa />
                        <span> Sản phẩm </span>
                    </div>
                    <div
                        className={styles['menu__item'] + " " + (menu === 3 ? styles['menu__item--active'] : "")}
                        onClick={() => push('/manager?state=3')}
                    >
                        <BiCustomize />
                        <span> Danh mục </span>
                    </div> 
                    <div
                        className={styles['menu__item'] + " " + (menu === 6 ? styles['menu__item--active'] : "")}
                        onClick={() => push('/manager?state=6')}
                    >
                        <BiTable />
                        <span> Bàn </span>
                    </div>
                    <h5> Tài khoản </h5>
                    <div
                        className={styles['menu__item'] + " " + (menu === 4 ? styles['menu__item--active'] : "")}
                        onClick={() => push('/manager?state=4')}
                    >
                        <BiUserCircle />
                        <span> Tài khoản </span>
                    </div>
                    <div
                        className={styles['menu__item'] + " " + (menu === 5 ? styles['menu__item--active'] : "")}
                        onClick={() => push('/manager?state=5')}
                    >
                        <BiCreditCardAlt />
                        <span> Thẻ quà tặng </span>
                    </div>
                </div>
                <div className={styles['view']}>
                    {renderView()}
                </div>
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

export default ManagerPage