import React, { useState, useEffect, useRef } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext';
import { Toast } from 'primereact/toast';
export default function Login() {
    const { isLoggedIn, login, logout } = useContext(AuthContext);
    const toast = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('login', {isLoggedIn});
        if (isLoggedIn) {
            navigate("/create-pool")
        }
    }, [isLoggedIn])

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSumbit = async (event) => {
        event.preventDefault();
        const res = await login(email, password);
        if(!res){
            toast.current.show({ severity: 'error', summary: 'Sign In info incorrect!', detail: `Name: Error`, life: 3000 });
        }
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
            <Toast ref={toast} />
            <div className="auth-inner">
                <form onSubmit={handleSumbit}>
                    <h3>Sign In</h3>
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
                    <div className="mb-3">
                        <div className="custom-control custom-checkbox">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                id="customCheck1"
                            />
                            <label className="custom-control-label" htmlFor="customCheck1">
                                Remember me
                            </label>
                        </div>
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                    <p className="forgot-password text-right">
                        create a new  <a href="/signup">account?</a>
                    </p>
                </form>
            </div>
        </div>
    )
}