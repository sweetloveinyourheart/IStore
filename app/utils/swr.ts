import { clientSideAPI } from "./url"

export const fetcher = async (url: string, accessToken?: string) => {
    try {
        const res = await fetch(clientSideAPI+url, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` } })
        const result = await res.json()

        if (result.statusCode >= 400) {
            throw new Error()
        }

        return result
    } catch (error: any) {
        throw new Error(error)
    }
}