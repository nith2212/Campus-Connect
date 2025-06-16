import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// Import the CSS Module
import styles from './AuthForms.module.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT'); // Default role
    const [formError, setFormError] = useState('');
    const { register, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(''); // Clear previous form errors
        if (!name || !email || !password || !role) {
            setFormError('All fields are required.');
            return;
        }
        if (password.length < 6) { // Basic client-side validation
            setFormError('Password must be at least 6 characters long.');
            return;
        }

        const success = await register({ name, email, password, role });
        if (success) {
            navigate('/dashboard'); // Redirect to dashboard or home page on success
        } else {
            // Error message will be handled by the AuthContext 'error' state
            setFormError(error || "Registration failed. User might already exist or invalid data.");
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Register for CampusConnect</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="role" className={styles.label}>Role:</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        className={styles.select}
                    >
                        <option value="STUDENT">Student</option>
                        <option value="FACULTY">Faculty</option>
                        {/* Consider carefully exposing ADMIN registration */}
                        {/* <option value="ADMIN">Admin</option> */}
                    </select>
                </div>
                {formError && <p className={styles.errorText}>{formError}</p>}
                {loading && <p className={styles.loadingText}>Registering...</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className={`${styles.button} ${styles.registerButton}`}
                >
                    Register
                </button>
            </form>
            <p className={styles.linkText}>
                Already have an account? <span onClick={() => navigate('/login')} className={`${styles.authLink} ${styles.loginLink}`}>Login here</span>
            </p>
        </div>
    );
};

export default Register;