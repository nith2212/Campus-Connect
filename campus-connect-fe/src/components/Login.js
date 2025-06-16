import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// Import the CSS Module
import styles from './AuthForms.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');
    const { login, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(''); // Clear previous form errors
        if (!email || !password) {
            setFormError('Please enter both email and password.');
            return;
        }

        const success = await login({ email, password });
        if (success) {
            navigate('/dashboard'); // Redirect to dashboard or home page on success
        } else {
            // Error message will be handled by the AuthContext 'error' state
            setFormError(error || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Login to CampusConnect</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
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
                {formError && <p className={styles.errorText}>{formError}</p>}
                {loading && <p className={styles.loadingText}>Logging in...</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className={`${styles.button} ${styles.loginButton}`}
                >
                    Login
                </button>
            </form>
            <p className={styles.linkText}>
                Don't have an account? <span onClick={() => navigate('/register')} className={`${styles.authLink} ${styles.registerLink}`}>Register here</span>
            </p>
        </div>
    );
};

export default Login;