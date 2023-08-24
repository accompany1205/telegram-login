import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
export default function SignUp() {
    const { isLoggedIn, register } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('login', {isLoggedIn});
        if (isLoggedIn) {
            navigate("/create-pool")
        }
    }, [isLoggedIn])

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSumbit = (event) => {
        event.preventDefault();
        register(email, password);
        // console.log();
        setEmail('');
        setPassword('');
    }
    const handleChange = (event) => {
        if(event.target.name === 'email'){
            setEmail(()=>event.target.value)
        }else{
            setPassword(()=>event.target.value);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={handleSumbit}>
                    <h3>Sign Up</h3>
                    <div className="mb-3">
                        <label>Email address</label>
                        <input
                            type="email"
                            name ="email"
                            className="form-control"
                            placeholder="Enter email"
                            value={email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                    <p className="forgot-password text-right">
                        already have an account?  <a href="/login">sign in</a>
                    </p>
                </form>
            </div>
        </div>
    )
}