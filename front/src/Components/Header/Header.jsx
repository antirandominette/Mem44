import { NavLink } from "react-router-dom";
import "./Header.css"

function Header() {
    return (
        <header className="header_container">
            <NavLink className="header_logo" to="/">Website_Logo</NavLink>
            <nav className="header_nav">
                <NavLink className="nav_item" to="/forum">Forum</NavLink>
                <NavLink className="nav_item" to="/community">Community</NavLink>
            </nav>
        </header>
    );
}

export default Header;