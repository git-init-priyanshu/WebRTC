import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import Home from "./pages/Home";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Home />} />
    </Route>
  )
);
export default function App() {
  return (
    <>
      <RouterProvider router={router} />
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
