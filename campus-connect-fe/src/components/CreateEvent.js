// src/components/CreateEvent.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../api/events';
import { useAuth } from '../context/AuthContext';
// Import a CSS module for CreateEvent specific styles or global styles if applicable
// For consistency, we'll keep styles in a styles object, but a CSS module is often better practice for components.

const CreateEvent = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(''); // YYYY-MM-DD format
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { isFaculty, isAuthenticated } = useAuth(); // Check role
    const navigate = useNavigate();

    // Redirect if not faculty or not authenticated
    // Using a more robust PrivateRoute mechanism is recommended, but keeping current logic for direct porting
    if (!isAuthenticated || !isFaculty) {
        // Using navigate instead of returning a paragraph for better UX
        navigate('/unauthorized', { replace: true });
        return null; // Return null to prevent rendering the form briefly
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setSuccessMessage('');
        setLoading(true);

        if (!title || !description || !date) {
            setFormError('All fields are required.');
            setLoading(false);
            return;
        }

        try {
            // Backend expects 'YYYY-MM-DD' for LocalDate
            await createEvent({ title, description, date });
            setSuccessMessage('Event created successfully!');
            setTitle('');
            setDescription('');
            setDate('');
            // Optionally redirect after a short delay
            setTimeout(() => navigate('/events'), 2000);
        } catch (err) {
            // Check if err.response.data.message exists for backend error messages
            const errorMessage = err.response?.data?.message || err.message || 'Failed to create event. Please try again.';
            setFormError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        // Apply global content-wrapper for consistent page layout
        <div className="content-wrapper">
            <div style={styles.container}>
                <h2 style={styles.heading}>Create New Event</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label htmlFor="title" style={styles.label}>Title:</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="description" style={styles.label}>Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            style={styles.textarea}
                            rows="5"
                        ></textarea>
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="date" style={styles.label}>Date:</label>
                        <input
                            type="date" // HTML5 date input for easy date selection
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    {formError && <p style={styles.errorText}>{formError}</p>}
                    {successMessage && <p style={styles.successText}>{successMessage}</p>}
                    {loading && <p style={styles.loadingText}>Creating event...</p>}
                    <button type="submit" disabled={loading} className="action-button">
                        Create Event
                    </button>
                </form>
                <p style={styles.backLinkContainer}>
                    {/* Using Link for navigation */}
                    <a href="/events" className="secondary-action-button">Back to Events List</a>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '50px auto', // Centering with auto margins
        padding: '30px',
        border: '1px solid #e0e0e0', // Light border
        borderRadius: '10px',
        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)', // Subtle shadow
        backgroundColor: '#ffffff', // White background for card
        fontFamily: 'Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif', // Consistent font
        color: '#424242', // Dark text
        boxSizing: 'border-box', // Include padding in width
    },
    heading: {
        textAlign: 'center',
        color: '#673ab7', // Deep Lavender
        marginBottom: '30px',
        fontSize: '2.2em', // Larger heading
        fontWeight: '600',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '500', // Slightly lighter bold
        color: '#757575', // Medium gray for labels
        fontSize: '0.95em',
    },
    input: {
        width: '100%',
        padding: '12px 15px', // More padding
        border: '1px solid #bdbdbd', // Slightly darker grey border
        borderRadius: '6px', // Slightly more rounded
        fontSize: '1em',
        boxSizing: 'border-box', // Include padding in width
        transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    },
    textarea: {
        width: '100%',
        padding: '12px 15px',
        border: '1px solid #bdbdbd',
        borderRadius: '6px',
        fontSize: '1em',
        boxSizing: 'border-box',
        resize: 'vertical',
        transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    },
    // Focus states for input and textarea
    input: { // Re-using input styles as they are the same
        // existing input styles
        '&:focus': {
            borderColor: '#9575cd', // Lighter Lavender focus
            outline: '0',
            boxShadow: '0 0 0 0.2rem rgba(103, 58, 183, 0.25)', // Subtle lavender glow
        }
    },
    textarea: { // Re-using textarea styles as they are the same
        // existing textarea styles
        '&:focus': {
            borderColor: '#9575cd',
            outline: '0',
            boxShadow: '0 0 0 0.2rem rgba(103, 58, 183, 0.25)',
        }
    },
    // Buttons are now using global 'action-button' and 'secondary-action-button' classes from index.css
    // so no need for button styles here
    errorText: {
        color: '#ef5350', // Soft Red for errors
        textAlign: 'center',
        marginTop: '15px',
        fontSize: '0.9em',
        fontWeight: '500',
    },
    successText: {
        color: '#4CAF50', // A standard green for success
        textAlign: 'center',
        marginTop: '15px',
        fontSize: '0.9em',
        fontWeight: '500',
    },
    loadingText: {
        color: '#673ab7', // Deep Lavender
        textAlign: 'center',
        marginTop: '15px',
        fontSize: '0.9em',
        fontWeight: '500',
    },
    // Note: unauthorizedMessage will be handled by PrivateRoute navigating to /unauthorized
    backLinkContainer: {
        textAlign: 'center',
        marginTop: '30px',
    },
    // The 'secondary-action-button' class will handle styling for the link
    // No specific backLink styles needed as it's now a button
};

export default CreateEvent;