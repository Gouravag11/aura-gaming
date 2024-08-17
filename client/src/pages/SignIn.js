import React from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const navigate = useNavigate();

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result.user);
                navigate('/');
            })
            .catch((error) => {
                console.error("Error during sign-in:", error);
            });
    };

    return (
        <div className="sign-in-page">
            <h2>Sign In to Aura Gaming</h2>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
    );
};

export default SignIn;
