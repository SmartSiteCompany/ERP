
import { NavBar, TaskPage, HomePage, CalendarPage, TodoApp } from "../index"
import { Routes, Route, Navigate } from "react-router-dom"


export const MainPage = () => {
  return (
    <>
        <NavBar/>
        
            <Routes>
                <Route path="/TodoApp" element={<TodoApp />} />
                <Route path="/CalendarPage" element={<CalendarPage/>} />
                <Route path="/HomePage" element={<HomePage/> } />
                <Route path="/TaskPage" element={<TaskPage/>} /> 
                <Route paths="/*" element={<Navigate to="/#"/> } />       
            </Routes>
    </>
  )
}
