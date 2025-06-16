// src/components/EventList.js
import React, { useEffect, useState } from 'react';
import { getAllEvents } from '../api/events';
import { useAuth } from '../context/AuthContext'; // To potentially show/hide create button
import { Link } from 'react-router-dom'; // Import Link for proper navigation

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, isFaculty } = useAuth(); // Get auth state

    useEffect(() => {
        const fetchEvents = async () => {
            if (!isAuthenticated) {
                // If not authenticated, don't try to fetch.
                // PrivateRoute handles redirection, but good to have safeguard here.
                setLoading(false);
                return;
            }
            try {
                const data = await getAllEvents();
                setEvents(data);
            } catch (err) {
                // Check if err.response.data.message exists for backend error messages
                const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch events.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [isAuthenticated]); // Re-fetch if authentication status changes

    if (loading) {
        return (
            <div className="content-wrapper">
                <div style={styles.container}>
                    <p style={styles.loadingText}>Loading events...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="content-wrapper">
                <div style={styles.container}>
                    <p style={styles.errorText}>Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="content-wrapper">
            <div style={styles.container}>
                <h2 style={styles.heading}>All Events</h2>
                {isFaculty && ( // Show create event link only if user is Faculty
                    <p style={styles.createEventLinkContainer}>
                        {/* Use Link component for client-side routing */}
                        <Link to="/events/create" className="action-button">
                            + Create New Event
                        </Link>
                    </p>
                )}
                {events.length === 0 ? (
                    <p style={styles.noEventsText}>No events available yet.</p>
                ) : (
                    <div style={styles.eventGrid}>
                        {events.map((event) => (
                            <div key={event.id} style={styles.card}
                                 // Add interactive hover effects
                                 onMouseEnter={e => e.currentTarget.style.transform = styles.cardHover.transform}
                                 onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <h3 style={styles.cardTitle}>{event.title}</h3>
                                <p style={styles.cardDescription}>{event.description}</p>
                                <p style={styles.cardDate}>Date: {event.date}</p>
                                <p style={styles.cardCreatedBy}>Created by: {event.createdBy}</p>
                                {/* In a real app, you might add a "Register for Event" button here */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '900px',
        margin: '50px auto',
        padding: '30px',
        border: '1px solid #e0e0e0', // Light border
        borderRadius: '10px',
        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)', // Subtle shadow
        backgroundColor: '#ffffff', // White background
        fontFamily: 'Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif', // Consistent font
        color: '#424242', // Dark text
        boxSizing: 'border-box',
    },
    heading: {
        textAlign: 'center',
        color: '#673ab7', // Deep Lavender
        marginBottom: '30px',
        fontSize: '2.2em',
        fontWeight: '600',
    },
    createEventLinkContainer: {
        textAlign: 'right',
        marginBottom: '20px',
    },
    // createEventLink is now handled by the global 'action-button' class
    eventGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '25px',
    },
    card: {
        backgroundColor: '#fdfdff', // Slightly off-white for cards
        border: '1px solid #d1c4e9', // Light lavender border
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer', // Indicate it's interactive
    },
    cardHover: { // For JavaScript-based hover effect
        transform: 'translateY(-5px)',
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
    },
    cardTitle: {
        color: '#673ab7', // Deep Lavender
        fontSize: '1.5em', // Adjust size for readability
        marginBottom: '10px',
        borderBottom: '1px solid #ede7f6', // Very light lavender border
        paddingBottom: '10px',
        fontWeight: '600',
    },
    cardDescription: {
        fontSize: '1em',
        lineHeight: '1.6',
        color: '#555', // Medium-dark gray
        marginBottom: '10px',
    },
    cardDate: {
        fontSize: '0.9em',
        color: '#757575', // Medium Gray
        fontWeight: 'bold',
        marginTop: 'auto', // Pushes to the bottom
    },
    cardCreatedBy: {
        fontSize: '0.85em',
        color: '#757575', // Medium Gray
        fontStyle: 'italic',
        marginTop: '5px',
    },
    noEventsText: {
        textAlign: 'center',
        color: '#888',
        fontSize: '1.1em',
        padding: '50px',
    },
    errorText: {
        color: '#ef5350', // Soft Red for errors
        textAlign: 'center',
        fontSize: '1.1em',
        padding: '50px',
    },
    loadingText: {
        color: '#673ab7', // Deep Lavender
        textAlign: 'center',
        fontSize: '1.1em',
        padding: '50px',
    }
};

export default EventList;