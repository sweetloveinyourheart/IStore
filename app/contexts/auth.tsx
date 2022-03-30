import { signOut, useSession } from "next-auth/react";
import { createContext, FunctionComponent, useContext } from "react";
import useSWR from "swr";
import { fetcher } from "../utils/swr";
import { UserInterface } from "../types/user";

const AuthContext = createContext<UserInterface | undefined>(undefined)

export function useAuth() {
    return useContext(AuthContext)
}

const AuthGuard: FunctionComponent = ({ children }) => {

    const { data: session } = useSession()
    const { data: user, error } = useSWR<UserInterface>(session?.accessToken ? ['/user/profile', session?.accessToken] : null, fetcher)

    if(!user && error) {
        signOut()
    }

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthGuard;