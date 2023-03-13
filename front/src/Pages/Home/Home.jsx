import "./Home.css"
import Header from "../../Components/Header/Header";
import { ReactComponent as Logo } from "../../Assets/logo.svg";
import { useEffect } from "react";

function Home() {
    useEffect(() => {
        const logoRedPaths = document.querySelectorAll("path");

        logoRedPaths.forEach((path) => {
            if (path.getAttribute("fill") === "#ffffff") {
                path.style.fill = "#9aa6a7";
            }
        });
    }, []);

    return (
        <section className="home_section">
            <Header />
            <div className="upper_content">
                <Logo />

                <h1 className="upper_content_title">Memoir '44 - Frontline</h1>

                <p className="upper_content_description">
                Welcome to Memoir '44 - Frontline, the online community for Memoir '44 fans! Here, you can share your campaigns, chat with other players in real time, and organize events. We are dedicated to providing a user-friendly platform for Memoir '44 players, offering features such as discussion forums, live chat, event calendars and more. Whether you're a Memoir '44 veteran or a new player, we hope you'll find a vibrant community here to engage with fellow passionate gamers. Join us today and discover all that Memoir '44 - Frontline has to offer!
                </p>
            </div>
        </section>
    );
}

export default Home;