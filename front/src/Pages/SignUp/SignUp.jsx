import React, { useState } from 'react';

function SignUp() {
    const [ result, setResult ] = useState([]);
    
    function handleSubmit(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const data = {
            email,
            password
        }

        fetch('http://13.37.164.181:4200/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => setResult(res))
        .catch(err => console.log(err))
    }

    return (
        <div className="SignUp">
            <h1>{ result.message }</h1>
            <form onSubmit={ handleSubmit }>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}

export default SignUp