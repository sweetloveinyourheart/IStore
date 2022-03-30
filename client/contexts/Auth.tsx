import { signOut, useSession } from "next-auth/react";
import { FunctionComponent, useEffect } from "react";
import useSWR from "swr";
import { clientSideAPI } from "../utils/img";
import { fetcher } from "../utils/swr";

const AuthGuard: FunctionComponent = ({ children }) => {

    const { data: session } = useSession()
    const { data: user, error } = useSWR(session?.accessToken ? [clientSideAPI + '/auth/validate', session?.accessToken] : null, fetcher)

    useEffect(() => {
        if (!user && error) {
            signOut()
        }

    }, [user])

    return (
        <>
            {children}
        </>
    );
}

export default AuthGuard;