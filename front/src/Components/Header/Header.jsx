import { NavLink } from "react-router-dom";
import "./Header.css";

function Header() {
    function handleHeaderNavContent() {
        const isConnected = localStorage.getItem('isConnected');
        let headerContent;

        if (isConnected === 'true') {
            headerContent = 
                <>
                    <NavLink className="nav_item" to="/forum">Forum</NavLink>
                    <NavLink className="nav_item" to="/community">Community</NavLink>
                </>
        }
        else {
            headerContent = 
                <>
                    <NavLink className="nav_item" to="/signup">Sign Up</NavLink>
                    <NavLink className="nav_item" to="/login">Login</NavLink>
                </>;
        }

        return headerContent;
    }

    return (
        <header className="header_container">
            <NavLink className="header_logo_container" to="/">
                Website_Logo
            </NavLink>
            <nav className="header_nav">
                {
                    handleHeaderNavContent()
                }
            </nav>
        </header>
    );
}

export default Header;