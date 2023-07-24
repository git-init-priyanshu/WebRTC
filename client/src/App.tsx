import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import Home from "./pages/Home";
import Room from "./pages/Room";
// import { SocketProvider } from "./providers/Socket";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Home />} />
      <Route path="/room/:roomId" element={<Room />} />
    </Route>
  )
);
export default function App() {
  return (
    <>
      {/* <SocketProvider> */}
      <RouterProvider router={router} />
      {/* </SocketProvider> */}
    </>
  );
}

function Root() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
