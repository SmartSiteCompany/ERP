
import { useContext } from 'react'
import { AuthContext } from '../auth'
import { Navigate, useLocation } from 'react-router'

    
    export const PrivateRoute = ({ children }) => {

        const { logged } = useContext( AuthContext );
        const { pathname, search } = useLocation();
        
        const lastPath = pathname + search;
        localStorage.setItem('lastPath', lastPath ); //qui se guarda la ultima pagina que use
        
        //si estoy autentificado muestro el children si no lo envia al login
        return (logged) ? children : <Navigate to="/loginPage" />
    }