// Example: src/pages/Auth/Signup.jsx (simplified)
import React, { useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom'; // If you use react-router

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState(''); // ⭐ Add state for phone
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    // const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await axios.post('http://localhost:5000/api/users/signup', {
                name,
                email,
                password,
                phone // ⭐ Include phone in the request body
            });
            setSuccess('Signup successful! Please log in.');
            // navigate('/login'); // Redirect to login page
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <div>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
                <label>Phone Number:</label> {/* ⭐ Add input for phone */}
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <button type="submit">Sign Up</button>
        </form>
    );
}

export default Signup;