import { Link, NavLink } from "react-router-dom"
 
export const NavBar = () => {
  return (
    
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark rounded-3 fixed-top">
  <div className="container-fluid ">
    <Link className="navbar-brand" to="#">Poryect Manager</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav">
        
        <NavLink 
        className={({ isActive }) => `nav-link ${isActive ? "active" : "" } ` }
        to="/HomePage"
        >
            HomePage
        </NavLink>

        <NavLink
        className={({ isActive }) => `nav-link ${isActive ? "active" : "" } ` }
        to="/TaskPage"
        >
            TaskPage
        </NavLink>

        <NavLink
        className={({ isActive }) => `nav-link ${isActive ? "active" : "" }`}
        to="/TodoApp"
        >
        TodoApp
        </NavLink>

        <NavLink
        className={({ isActive }) => `nav-link ${isActive ? "active" : "" } ` }
        to="/CalendarPage"
        >
            CalendarPage
        </NavLink>

      </ul>
    </div>
  </div>
</nav>
  )
}