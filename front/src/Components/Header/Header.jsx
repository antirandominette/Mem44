import { NavLink } from "react-router-dom";
import "./Header.css";

function Header() {
    const isConnected = sessionStorage.getItem('isConnected');

    return (
        <header className="header_container">
            <NavLink className="header_logo_container" to="/">
                Website_Logo
            </NavLink>
            <nav className="header_nav">
                {
                    isConnected && 
                    <>
                        <NavLink className="nav_item" to="/forum">Forum</NavLink>
                        <NavLink className="nav_item" to="/community">Community</NavLink>
                    </>
                }
                {
                    !isConnected &&
                    <>
                        <NavLink className="nav_item" to="/signup">Sign Up</NavLink>
                        <NavLink className="nav_item" to="/login">Login</NavLink>
                    </>
                    
                }
            </nav>
        </header>
    );
}

export default Header;