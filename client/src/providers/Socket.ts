// import { ReactNode, createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";

export const socket = io("http://localhost:8001", { autoConnect: false });

// interface propTypes {
//   children: ReactNode;
// }

// interface ContextType {
//   socket: any;
// }

// const SocketContext = createContext<ContextType | null>(null);

// export const useSocket = () => {
//   return useContext(SocketContext);
// };

// export function SocketProvider({ children }: propTypes) {
//   const socket = useMemo(() => io("http://localhost:8001"), []);

//   return (
//     <SocketContext.Provider value={{ socket }}>
//       {children}
//     </SocketContext.Provider>
//   );
// }
