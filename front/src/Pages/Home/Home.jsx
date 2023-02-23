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

                <h1 className="upper_content_title">Website_Name</h1>

                <p className="upper_content_description">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis, consequatur dolore consequuntur beatae reiciendis dignissimos sapiente asperiores suscipit quod rem tempora numquam nam pariatur assumenda nesciunt minus? Fugit, est voluptatem. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat dolorem sed maxime eligendi. Nisi numquam autem dolores atque obcaecati? Atque quasi dolorum nihil natus iste doloremque aspernatur praesentium error sit.
                </p>
            </div>
        </section>
    );
}

export default Home;