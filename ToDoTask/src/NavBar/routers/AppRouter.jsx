// import { Route, Routes } from "react-router"
// import { MainPage } from '../heroes';
// import { LoginPage } from "../auth";
// import { PrivateRoute } from "./PrivateRoute";
// import { PublicRoute } from "./PublicRouter";

export const AppRouter = () => {
    return (
        <>
            <Routes>
                <Route path="LoginPage" element={
                    <PublicRoute>
                        <LoginPage/>
                    </PublicRoute>
                } />
                    


                <Route path="/*" element={

                    <PrivateRoute>
                        <HeroRouters/>
                    </PrivateRoute>
                } />

            </Routes>
        </>
    )
}

                //Definir una ruta que tenga nuestro componente */}