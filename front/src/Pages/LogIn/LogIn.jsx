import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header/Header';

function LogIn() {
    const navigate = useNavigate();
    const isConnected = false;

    function handleSubmit(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch("http://13.37.164.181:4200/api/auth/login", {
            method: "POST",
            headers: {  
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(res => {
                localStorage.setItem('token', res.token);
                localStorage.setItem('userId', res.userId);
                isConnected ? localStorage.setItem('isConnected', false) : localStorage.setItem('isConnected', true);
                navigate('/forum');
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="login">
            <Header />
            
            <div className="login__container">
                <h1>Sign in</h1>
                <form onSubmit={ handleSubmit }>
                    <h5>E-mail</h5>
                    <input type="email" name="email" id="email" />
                    <h5>Password</h5>
                    <input type="password" name="password" id="password" />
                    <button type="submit" className="login__signInButton">Sign In</button>
                </form>
            </div>
        </div>
    )
}

export default LogIn;