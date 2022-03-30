import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styles from '../styles/Auth.module.scss'
import { signIn, getSession } from "next-auth/react"

const AuthenticationPage: NextPage = () => {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()

    useEffect(() => {
        if (router.query.error) {
            setError("Username or password is invalid. Please try again!")
        }
    }, [router.query])

    const onLogin = (e: React.FormEvent<HTMLFormElement>) => {
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
                    <form onSubmit={onLogin} className={styles['login-form']}>
                       
                        <div className={styles['login-form__head']}>
                            Đăng nhập vào IStore
                        </div>
                        {error
                            && <p className={styles['error-msg']}> {error} </p>
                        }
                        <div className={styles['form-item']}>
                            <div className={styles['form-item__label']}>Username</div>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="username"
                            />
                        </div>
                        <div className={styles['form-item']}>
                            <div className={styles['form-item__label']}>Password</div>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="password"
                            />
                        </div>
                       
                        <div className={styles['form-item']}>
                            <div className={styles['form-item__submit']}>
                                <button type='submit'> Đăng nhập </button>
                            </div>
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

export default AuthenticationPage