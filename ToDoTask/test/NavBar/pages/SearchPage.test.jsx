import { screen } from "@testing-library/dom"
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { SearchPage } from "../../../src/NavBar/pages/SearchPage";




const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUseNavigate,
}));



describe('Pruebas en <SearchPage />', () => {


    beforeEach(() => jest.clearAllMocks() );

    
    test('debe de mostrarse correactamente con valores por defecto', () => {
        
        const { container } =render(
            <MemoryRouter>
                <SearchPage />
            </MemoryRouter>
        );
        expect( container ).toMatchSnapshot();
        
    });

    test('debe de mostrar a Batman y el input con el valor del queryString', () => {
        
        render(
            <MemoryRouter initialEntries={['/search?q=Demo']}>
                <SearchPage />
            </MemoryRouter>
        );
        
        const input = screen.getByRole('textbox');
        expect( input.value ).toBe('Demo');
        
        const img = screen.getByRole('img');
        expect( img.src ).toContain('/assets/heroes/cliente.jpg');

        const alert = screen.getByLabelText('alert-danger');
        expect( alert.style.display ).toBe('none');
        
    });

    test('debe de mostrar un error si no se encuentra el cliente (DEMO123)', () => {
        
        render(
            <MemoryRouter initialEntries={['/search?q=cliente1']}>
                <SearchPage />
            </MemoryRouter>
        );

        const alert = screen.getByLabelText('alert-danger');
        expect( alert.style.display ).toBe('');
        

    });

    test('debe de llamar el navigate a la pantalla nueva', () => {
        
        const inputValue = 'Ruben';

        render(
            <MemoryRouter initialEntries={['/search']}>
                <SearchPage />
            </MemoryRouter>
        );

        const input = screen.getByRole('textbox');
        fireEvent.change( input, { target: { name: 'searchText', value: inputValue }})
        
        
        const form = screen.getByRole('form');
        fireEvent.submit( form );
        
        expect( mockedUseNavigate ).toHaveBeenCalledWith(`?q=${ inputValue }`)

    });


});