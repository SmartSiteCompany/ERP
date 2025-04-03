import { TodoApp } from "../../ToDoList/index"
import { TodoList } from "../../ToDoList/index"


export const TaskPage = () => {
  return (
    <>
        <h1 className=' mt-5'> TaskPage </h1>
        {/* <TodoApp/> */}
        <TodoList/>
    </>
  )
}
