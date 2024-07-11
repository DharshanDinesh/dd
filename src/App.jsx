import { Bill } from "./Components/Bill/Bill";
import { Container } from "./Components/Container/Container";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Dashboard } from "./Components/Dashboard/Dashboard";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Container />,
    children: [
      {
        path: "/",
        element: <>Home</>,
      },
      {
        path: "/bill",
        element: <Bill />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);
export function App() {
  return <RouterProvider router={router} />;
}
