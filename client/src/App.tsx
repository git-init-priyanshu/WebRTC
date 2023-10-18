import { useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import { useSocketContext } from "./providers/SocketProvider";
import Home from "./pages/Home";
import Room from "./pages/Room";

export interface dataInterface {
  emailId: string;
  roomId: string;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Home />} />
      <Route path="/room/:roomId" element={<Room />} />
    </Route>
  )
);
export default function App() {
  const { socket } = useSocketContext();

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [socket]);
  return <RouterProvider router={router} />;
}

function Root() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
