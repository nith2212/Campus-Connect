// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';

// Import existing Event components
import EventList from './components/EventList';
import CreateEvent from './components/CreateEvent';

// Import Notice components
import NoticeList from './components/NoticeList';
import NoticeForm from './components/NoticeForm';

// Import Resource components
import ResourceList from './components/ResourceList';
import ResourceUploadForm from './components/ResourceUploadForm';

// Import NEW Admin component
import AdminPanel from './components/AdminPanel';

// Import global CSS (make sure to create this file)
import './index.css';

// --- Helper function to capitalize the first letter of a string ---
const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    // Ensure the rest of the string is lowercase for consistent capitalization
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// --- Navbar Component ---
const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // To highlight active link

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            {/* Left section of the Navbar: Brand and Role display */}
            <div className="navbar-left-section">
                <Link to="/" className="navbar-brand">CampusConnect</Link>
                {/* Display role prominently if authenticated */}
                {isAuthenticated && user?.role && (
                    <span className="user-role-indicator">
                        {capitalizeFirstLetter(user.role)} Access
                    </span>
                )}
            </div>

            {/* Right section of the Navbar: Nav items, user name, and logout */}
            <ul className="navbar-nav">
                {isAuthenticated ? (
                    <>
                        <li className="nav-item">
                            <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/events" className={`nav-link ${location.pathname === '/events' ? 'active' : ''}`}>Events</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/notices" className={`nav-link ${location.pathname === '/notices' ? 'active' : ''}`}>Notices</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/resources" className={`nav-link ${location.pathname === '/resources' ? 'active' : ''}`}>Resources</Link>
                        </li>
                        {user?.role === 'ADMIN' && (
                            <li className="nav-item">
                                <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>Admin</Link>
                            </li>
                        )}
                        {user?.role === 'FACULTY' && (
                            <li className="nav-item">
                                <Link to="/faculty" className={`nav-link ${location.pathname === '/faculty' ? 'active' : ''}`}>Faculty Tools</Link>
                            </li>
                        )}
                        <li className="nav-item">
                            {/* Display capitalized user name */}
                            <span className="navbar-text">Hi, {capitalizeFirstLetter(user?.name)}</span>
                        </li>
                        <li className="nav-item">
                            <button onClick={handleLogout} className="navbar-button">Logout</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li className="nav-item">
                            <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/register" className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}>Register</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

// --- Dashboard Component ---
const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="content-wrapper">
            {/* New structure for the welcome card */}
            <div className="welcome-card">
                <p className="welcome-text">WELCOME TO</p>
                <div className="campus-connect-highlight">
                    Campus Connect
                </div>
                {/* Display capitalized user name, role is now in Navbar */}
                <p className="user-details">{capitalizeFirstLetter(user?.name)}!</p>
            </div>
        </div>
    );
};

// --- Faculty Page Component ---
const FacultyPage = () => {
    return (
        <div className="content-wrapper">
            <div className="page-header">
                <h1>Faculty Tools</h1>
                <p>Manage events, notices, and resources for the campus community.</p>
            </div>
            <nav className="page-nav">
                <ul className="page-nav-list">
                    <li className="page-nav-item"><Link className="page-nav-link" to="/events/create">Create New Event</Link></li>
                    <li className="page-nav-item"><Link className="page-nav-link" to="/notices/create">Post New Notice</Link></li>
                    <li className="page-nav-item">
                        <Link className="page-nav-link" to="/resources/upload">Upload New Resource</Link>
                    </li>
                </ul>
            </nav>
            <div className="page-actions">
                <Link to="/dashboard" className="secondary-action-button">Back to Home</Link>
            </div>
        </div>
    );
};

// --- Unauthorized Component ---
const Unauthorized = () => (
    <div className="content-wrapper">
        <div className="unauthorized-container">
            <h1>Unauthorized Access</h1>
            <p>You do not have permission to view this page.</p>
            <Link to="/" className="action-button">Go Home</Link>
        </div>
    </div>
);

// --- HomePage Component ---
const HomePage = () => {
    const { isAuthenticated } = useAuth();
    return (
        <div className="content-wrapper">
            <div className="unauthorized-container">
                <h1>Welcome to CampusConnect!</h1>
                <p className="lead">Your hub for campus events, notices, and resources.</p>
                <div className="page-actions">
                    {isAuthenticated ? (
                        <Link to="/dashboard" className="action-button">Go to Home</Link>
                    ) : (
                        <>
                            <Link to="/login" className="action-button">Login</Link>
                            <Link to="/register" className="action-button secondary-action-button">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <div className="app-container">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />

                        {/* Protected Routes for any authenticated user */}
                        <Route element={<PrivateRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/events" element={<EventList />} />
                            <Route path="/notices" element={<NoticeList />} />
                            <Route path="/resources" element={<ResourceList />} />
                        </Route>

                        {/* Role-specific Protected Routes */}
                        <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
                            <Route path="/admin" element={<AdminPanel />} />
                        </Route>
                        <Route element={<PrivateRoute allowedRoles={['FACULTY']} />}>
                            <Route path="/faculty" element={<FacultyPage />} />
                            <Route path="/events/create" element={<CreateEvent />} />
                            <Route path="/notices/create" element={<NoticeForm />} />
                            <Route path="/resources/upload" element={<ResourceUploadForm />} />
                        </Route>

                        {/* Catch all for 404 */}
                        <Route path="*" element={
                            <div className="content-wrapper">
                                <div className="not-found-container">
                                    <h1>404 Not Found</h1>
                                    <p>The page you are looking for does not exist.</p>
                                    <Link to="/" className="action-button">Go Home</Link>
                                </div>
                            </div>
                        } />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;