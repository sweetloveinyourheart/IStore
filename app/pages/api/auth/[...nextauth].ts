import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { serverSideAPI } from "../../../utils/url"

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        // ...add more providers here
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)  
                const res = await fetch(serverSideAPI+"/auth/login", {
                    method: 'POST',
                    body: JSON.stringify({
                        username: credentials?.username,
                        password: credentials?.password
                    }),
                    headers: { "Content-Type": "application/json" }
                })
                const result = await res.json()     

                // If no error and we have user data, return it
                if (result.access_token) {
                    return {
                        accessToken: result.access_token
                    }
                }
                // Return null if user data could not be retrieved
                return null
            }
        })
    ],
    secret: 'tynx',
    jwt: {
        //@ts-ignore
        signingKey: {"kty":"oct","kid":"mngl9QMzbHOwlfn1uDb0uG6Kd7Bf1cw1gsWnwXRGLPo","alg":"HS512","k":"xWr2aLl3r3LGrwmpa6Rd_NKuZTcibYudIyHuJ4EjPEGqWZkaStN3CYE_sX2hMWbXJzlhfKLeRoSgibnz25LHbw"}
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) { 
                token.accessToken = user?.accessToken
            }

            return token
        },

        async session({ session, token }) {
            if (token) {
                session.accessToken = token.accessToken
            }
            return session
        },
    },
    pages: {
        signIn: '/auth',
        error: '/auth'
    }
})