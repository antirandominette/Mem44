import { useNavigate  } from 'react-router-dom';

function LogIn() {
    const navigate = useNavigate();

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
                navigate('/forum', { state: { token: res.token }});
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="login">
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