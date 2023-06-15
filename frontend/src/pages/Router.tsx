import {
    createBrowserRouter,
    Navigate,
} from "react-router-dom";

import LoginPage from "pages/Authentication/Login";
import PublicRouter from "@imolla/layout/Public";
import AppLayout from "@imolla/layout/AppLayout";
import { lazy } from "react";

const DashboardPage = lazy(() => import("pages/dashboard"));
const UsersPage = lazy(() => import("pages/users"));
const EditUserPage = lazy(() => import("pages/users/EditUser"));
const SettingsPage = lazy(() => import("pages/settings"));
const ClientsPage = lazy(() => import("pages/clients"));
const EditClientPage = lazy(() => import("pages/clients/EditClient"));
const NewClientPage = lazy(() => import("pages/clients/New"));
const NewUserPage = lazy(() => import("pages/users/New"));
const Page404 = lazy(() => import("pages/Errors/Page404"));



const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            { index: true, element: <Navigate to="/dashboard" replace /> },
            { path: "dashboard", element: <DashboardPage /> },
            { path: "users", element: <UsersPage /> },
            { path: "users/add", element: <NewUserPage /> },
            { path: "users/edit/:id", element: <EditUserPage /> },
            { path: "settings", element: <SettingsPage /> },
            { path: "clients", element: <ClientsPage /> },
            { path: "clients/add", element: <NewClientPage /> },
            { path: "clients/edit/:id", element: <EditClientPage /> },
            { path: "*", element: <Page404 /> }
        ]
    },

    {
        element: <PublicRouter />,
        children: [
            {
                path: "login",
                element: <LoginPage />,
            }
        ],
    }
]);

export default router