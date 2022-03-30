import { GetServerSideProps, NextPage } from "next"
import { getSession } from "next-auth/react"
import Head from "next/head"
import { useRouter } from "next/router"
import { BiX } from "react-icons/bi"
import Paper from "../../components/paper/paper"
import { Bill } from "../../types/bill"
import { serverSideAPI } from "../../utils/img"

interface BillPageProps {
    bill: Bill
}

const BillPage: NextPage<BillPageProps> = ({ bill }) => {

    const router = useRouter()

    return (
        <>
            <Head>
                <title> Phiếu thanh toán </title>
            </Head>
            <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'gray', minHeight: '100vh' }}>
                <div style={{ position: "absolute", padding: 12, top: 0, left: 0 }}>
                    <button
                        onClick={() => router.push("/manager")}
                        style={{ background: "#fff", cursor: "pointer", border: '1px solid #fff', display: 'flex', justifyContent: "center", alignItems: "center", borderRadius: '100%', width: 40, height: 40 }}
                    >
                        <BiX style={{ fontSize: 24, color: "#f30606" }} />
                    </button>
                </div>
                <Paper
                    width={320}
                    height={840}
                    bill={bill}
                />
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const { code } = context?.query

        const session = getSession(context)
        if (!session) return { redirect: { permanent: false, destination: '/manager' } }

        const res = await fetch(serverSideAPI + `/bill/getByCode/${code}`)
        const result = await res.json()

        if (result?.statusCode >= 400) throw new Error()

        return {
            props: {
                bill: result
            }
        }

    } catch (error) {
        return {
            redirect: {
                permanent: false,
                destination: '/manager'
            }
        }
    }
}

export default BillPage