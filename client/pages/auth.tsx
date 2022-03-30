import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { signIn, getSession } from "next-auth/react"
import styles from '../styles/pages/Auth.module.scss'

const AuthPage: NextPage = () => {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()

    useEffect(() => {
        if (router.query.error) {
            setError("Username or password is invalid. Please try again!")
        }
    }, [router.query])

    const onLogin = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        signIn("credentials", { username, password })
    }

    return (
        <>
            <Head>
                <title> Đăng nhập </title>
            </Head>
            <main className={styles.auth}>
                <div className={styles['login-area']}>
                    <div className={styles['login-title']}>
                        <div style={{ textAlign: "center" }} onClick={() => router.push("/")}>
                            <Image
                                src={'/logo.png'}
                                width={150}
                                height={150}
                                className="rounded-full"
                            />
                        </div>
                        <h1 className="text-2xl font-bold uppercase text-[#d12032] ml-4"> Đăng nhập </h1>
                    </div>
                    <form className={styles['login-form']} onSubmit={onLogin}>
                        <div className={styles['login-form__item']}>
                            {error
                                && <p className={styles['error-msg']}> {error} </p>
                            }
                            <input
                                type="text"
                                placeholder="Username"
                                onChange={e => setUsername(e.target.value)}
                                value={username}
                            />
                        </div>
                        <div className={styles['login-form__item']}>
                            <input
                                type="password"
                                placeholder="Password"
                                onChange={e => setPassword(e.target.value)}
                                value={password}
                            />
                        </div>
                        <div className={styles['login-form__item']}>
                            <button> Đăng nhập </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const session = await getSession(context)

        if (!session)
            return {
                props: {}
            }

        return {
            redirect: {
                permanent: false,
                destination: "/"
            }
        }

    } catch (error) {
        return {
            props: {}
        }
    }
}

export default AuthPage