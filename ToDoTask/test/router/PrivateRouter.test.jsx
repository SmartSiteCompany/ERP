import { render, screen } from "@testing-library/react";
import { AuthContext } from "../../src/auth";
import { PrivateRoute } from "../../src/router/PrivateRoute";
import { MemoryRouter } from "react-router";

describe('Pruebas en el <PrivateRouter/>', () => {

    test('Debe de mostrar el children si esta autenticado', () => {

        //hacemos un mock de locolSotorage para simular funciones, eventos  etc
        Storage.prototype.setItem = jest.fn();
    
            const initialValue = {
                logged: true,
                user: {
                    id: 'ABC',
                    name: 'Luis Cristobal',
                }
            }

            render(
                <AuthContext.Provider value={initialValue}> 
                {/* pensado para aplicaciones que no interactúan directamente con la URL del navegador
                 (por ejemplo, pruebas). Aquí se le define la ruta inicial como ['/Login'] */}
                    <MemoryRouter initialEntries={['/search?q=tarea']}>
                        <PrivateRoute>
                            <h1>Ruta Privada</h1>
                        </PrivateRoute>
                    </MemoryRouter>
                </AuthContext.Provider>
            )

            expect(screen.getByText('Ruta Privada')).toBeTruthy()
            expect(Storage.prototype.setItem).toHaveBeenCalledWith('lastPath','/search?q=batman')
    });
})