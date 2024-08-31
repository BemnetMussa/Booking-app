import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function registerUser(e) {
        e.preventDefault();
        
        try {
            const response = await axios.post('/register', {
                name,
                email,
                password
            });
            console.log('User registered:', response.data);
            // You can also redirect the user or show a success message here
        } catch (error) {
            console.error('Error registering user:', error);
            // Handle the error by showing an error message to the user
        }
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto border" onSubmit={registerUser}>
                    <input
                        type="text"
                        placeholder="User Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already a member? <Link to={'/login'} className="underline text-black">Login now</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
