import React from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const navigate = useNavigate();

    const regUser = async (user) => {
        try {
            const userDet = await fetch(`/api/users/${user.uid}`);
            if (userDet.status === 404){
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userID: user.uid,
                        name: user.displayName,
                        aura: 0, // Include the payment reference ID in the request
                    }),
                });
                await response.json();
            }
            console.log('User signed in');
            
        }catch{

        }
    };

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                regUser(result.user);
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
