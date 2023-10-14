import { ReactNode, createContext, useContext, useMemo } from "react";
import { io,Socket } from "socket.io-client";

interface propTypes {
  children: ReactNode;
}

type ContextType = {
  socket: Socket;
};

const SocketContext = createContext<ContextType | null>(null);

export const SocketProvider = ({ children }: propTypes) => {
  const socket = useMemo(() => io("http://localhost:8000"), []);

  return (
    <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const socket = useContext(SocketContext);
  if (!socket)
    throw new Error("useSocketContext must be used within SocketProvider");
  return socket;
};