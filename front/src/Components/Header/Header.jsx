import { NavLink } from "react-router-dom";
import { ReactComponent as HeaderLogo } from "../../Assets/frontline_header_lo.svg";
import { useEffect } from "react";

import "./Header.css";

function Header() {
    useEffect(() => {
        const logoPaths = document.querySelectorAll("path");
        const logoLetters = document.querySelectorAll("g");

        logoPaths.forEach((path) => {
            if (path.getAttribute("fill") === "#000000") {
                path.style.fill = "#acb5a3";
            }
        });

        logoLetters.forEach((letter) => {
            if (letter.getAttribute("fill") === "#000000") {
                letter.style.fill = "#acb5a3";
            }
        }
        );
    }, []);

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
                <HeaderLogo />
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