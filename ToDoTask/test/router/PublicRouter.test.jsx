import { render, screen } from "@testing-library/react"
import { PublicRoute } from "../../src/router/PublicRouter"
import { AuthContext } from "../../src/auth"
import { MemoryRouter, Route, Routes } from "react-router";

describe('Pruebas en el <publicRouter/>', () => {
    
    test('Debe de mostrar el children si no esta autenticado', () => {

        const initialValue = {
            logged: false,
        }

        render(
            <AuthContext.Provider value={initialValue}>
                <PublicRoute>
                    <h1>Ruta Publica</h1>
                </PublicRoute>
            </AuthContext.Provider>
        );
        expect(screen.getByText('Ruta Publica')).toBeTruthy()
    });

    test('Debe de navegar si esta auntenticado', () => {

        const initialValue = {
            logged: true,
            user: {
                id : '123ABC',
                name: 'Paco Looud',
            }
        }

        render(
            // compartir datos de autenticación entre los componentes sin necesidad de pasarlos
            <AuthContext.Provider value={initialValue}>
                {/* Es la ruta en la que me encuentro */}
                {/* Aquí se le define la ruta inicial como ['/Login'] */}
                <MemoryRouter initialEntries={['/Login']}>
                    {/* Ruta publica parecida a como se muestra en los routers, si esta autenticado no lo deja y lo envia a marvel*/}
                    <Routes>
                        <Route path="Login" element={

                            <PublicRoute>
                                <h1>Ruta Publica</h1>
                            </PublicRoute>
                        }/>
                        <Route path="inicio" element={<h1>Pagina Marvel</h1>}/>
                    </Routes>
                </MemoryRouter>
            </AuthContext.Provider>
        );
        expect(screen.getByText('Pagina inicio')).toBeTruthy()
    });
});