import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AuthContext } from "../../src/auth";
import { AppRouter } from "../../src/router/AppRouter";

describe('Pruebas en <AppRouter />', () => {
    
    test('debe de mostrar el Login si no está autenticado', () => {
        
        
        const contextValue = {
            logged: false,
        };

        render(
            <MemoryRouter initialEntries={['/inicio']}>
                <AuthContext.Provider value={contextValue}>
                    <AppRouter/>
                </AuthContext.Provider>
            </MemoryRouter>
        );

        // Verificar que al menos un elemento con 'LoginPage' exista
        expect(screen.getByText('LoginPage')).toBeTruthy();
    });

    const contextValue = {
        logged: true,
        user: {
            id: 'ABC',
            name: 'Harry'
        }
    };

    render(
        <MemoryRouter initialEntries={['/inicio']}>
            <AuthContext.Provider value={contextValue}>
                <AppRouter/>
            </AuthContext.Provider>
        </MemoryRouter>
    );

    // Verificar que al menos un elemento con marvel exista lamenos una vez
    expect(screen.getAllByText('inicio')).toBeGreaterThanOrEqual(1);
});