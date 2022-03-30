import React, { FunctionComponent, useContext } from 'react'
import io from 'socket.io-client'
import { socketEndpoint } from '../utils/img'

const SocketContext = React.createContext<any>(null)

export function useSocket() {
    return useContext(SocketContext)
}

export const SocketProvider: FunctionComponent = ({ children }) => {
    const socket = io(socketEndpoint)

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}