import { getByRole, getByText, render, screen } from "@testing-library/react"
import { MultipleCustomHook } from "../../src/03-examples/MultipleCustomHook"
import { useFetch } from "../../src/hook/useFetch"

jest.mock('../../src/hook/useFetch')

describe('hacer las pruebas del coponente MultilpleCustomHook', () => {

  test('Debe de mostrar el componente completo', () => {

    // Un mock permite simular el comportamiento de una función real durante las pruebas,
    //  evitando depender de implementaciones externas (como llamadas reales a una API). Ahora,
    //  vamos a desglosarlo:

    //El método mockReturnValue (de Jest) establece un valor de retorno simulado para la función/hook useFetch
    useFetch.mockReturnValue({ 
      //null simula que no hay datos disponibles
      data: null,
      isLoading: true,
      hasError: null
    })
    // Para hacer pruebas de un componente solo se importa el render
    render( <MultipleCustomHook/> );
    expect( screen.getByText('Informacion del Pokemon'))
    expect( screen.getByText('Cargando'))
    expect( screen.getByText('Anterior'))
    expect( screen.getByText('Siguiente'))
    // El getByText es si esta el texto en nuestro componente

    //Busca un elemento en el DOM que sea de tipo button y tenga el texto o accesible nombre "Siguiente".
    const nextButon = screen.getByRole("button",{name: 'Siguiente'})
    expect( nextButon.disabled).toBeFalsy()
    // screen.debug();
  })

  test('Debe de llamar la funcion de incremenatar', () => {


  })
})