import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiDollarSign,
  FiBarChart2,
} from "react-icons/fi";

function MainLayout({ children }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div>
          <h2>School ERP</h2>

          <nav>
            <NavLink to="/" className="nav-link">
              <FiHome /> Dashboard
            </NavLink>

            <NavLink to="/students" className="nav-link">
              <FiUsers /> Students
            </NavLink>

            <NavLink to="/teachers" className="nav-link">
              <FiBook /> Teachers
            </NavLink>

            <NavLink to="/fees" className="nav-link">
              <FiDollarSign /> Fees
            </NavLink>

            <NavLink to="/reports" className="nav-link">
              <FiBarChart2 /> Reports
            </NavLink>
          </nav>
        </div>

        <div className="admin-box">
          Administrator
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}

export default MainLayout;