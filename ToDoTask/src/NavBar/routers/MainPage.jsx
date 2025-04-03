
import { NavBar, TaskPage, HomePage, CalendarPage, TodoApp, SearchPage, UsuarioPage } from "../index"
import { Routes, Route, Navigate } from "react-router-dom"


export const MainPage = () => {
  return (
    <>
        <NavBar/>
        
            <Routes>
                <Route path="hacer" element={<TodoApp />} />
                <Route path="calendario" element={<CalendarPage/>} />
                <Route path="inicio" element={<HomePage/> } />
                <Route path="tareas" element={<TaskPage/>} />
                <Route path="Usuario/:id" element={<UsuarioPage/>} />
                <Route path="buscar" element={<SearchPage/> }  />
                <Route paths="/*" element={<Navigate to="/#"/> } />       
            </Routes>
    </>
  )
}
