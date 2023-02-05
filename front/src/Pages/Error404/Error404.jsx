import Header from "../../Components/Header/Header";

function Error404() {
    return (
        <div className="error404">
            <Header />
            <h1>404</h1>
            <p>Page not found</p>
        </div>
    );
}

export default Error404;