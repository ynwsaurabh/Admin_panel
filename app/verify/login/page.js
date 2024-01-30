'use client'
import React, { useState } from 'react'
import { IconContext } from "react-icons";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { getAuth,onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css'
import FirebaseConfig from '@/Component/Config';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


const login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRevealPwd, setIsRevealPwd] = useState(false);
    const router = useRouter();
    const handleCLick = () => setIsRevealPwd(!isRevealPwd);
    // const handleForgot = () => setIsRevealPwd(!isRevealPwd);
    const app =FirebaseConfig();
    const auth = getAuth(app);
      onAuthStateChanged(auth, (user) => {
        if (user) {
          router.replace('/Profile')
        }
      });
    const handleSubmit = (e) => {
        e.preventDefault();
        const auth = getAuth(app);
        try {
            signInWithEmailAndPassword(auth, email, password).then(() => {
                toast.success('Login Success')
                router.replace('/Notice')
            })
        } catch (err) {
              toast.error('Invalid email or password')
        }
    };


    return (
        <>
            <div>
                <img className="logoimg" src='/Images/Logo1.jpg' alt="website-logo" loading="lazy" />
                <h2 className="logoheading">Admin Panel</h2>
            </div>
            <div className="loginContainer">
                <img className='landingImg' rel="preload" src='/Images/login.jpg' alt="Login" loading="lazy" />
                <div className="loginInfo">
                    <h1>LOGIN</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="emailContainer">
                            <input
                                required
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                            />
                        </div>
                        <div className="pwdContainer">
                            <input
                                required
                                type={isRevealPwd ? "text" : "password"}
                                name="pwd"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                            <IconContext.Provider value={{ className: "revealpwd" }}>
                                <span onClick={handleCLick}>
                                    {isRevealPwd ? (<FaRegEye />) : (<FaRegEyeSlash />)}
                                </span>
                            </IconContext.Provider>
                        </div>
                        <div className="secondary-login">
                            {/* <span onClick={handleForgot}>Forgot password?</span> */}
                            <span></span>
                            <div>
                                <button type="submit" className="btn">Login</button>
                            </div>
                        </div>
                        {/* <p className="not-register">Don't have an account? <Link to={"/verify/signup"} className="links-color"> Register</Link> </p> */}
                    </form>
                </div>
            </div>
        </>
    )
}

export default login