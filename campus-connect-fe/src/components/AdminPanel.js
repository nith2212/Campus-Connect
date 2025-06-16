import React, { useState, useEffect, useCallback } from 'react'; // <-- UNCOMMENTED THIS LINE
import { getAllUsers, deleteUser, updateUserRole } from '../api/admin'; // <-- UNCOMMENTED THIS LINE

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.response?.data?.message || 'Failed to fetch users. Ensure you are logged in as an ADMIN.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                setLoading(true);
                await deleteUser(userId);
                alert('User deleted successfully!'); // Consider using a more integrated notification system
                fetchUsers(); // Refresh the list
            } catch (err) {
                console.error('Error deleting user:', err);
                setError(err.response?.data?.message || 'Failed to delete user.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleRoleUpdate = async (userId, currentRole) => {
        const newRole = prompt(`Enter new role for user ID ${userId} (STUDENT, FACULTY, ADMIN). Current role: ${currentRole}`);
        if (newRole && ['STUDENT', 'FACULTY', 'ADMIN'].includes(newRole.toUpperCase())) {
            try {
                setLoading(true);
                await updateUserRole(userId, newRole.toUpperCase());
                alert('User role updated successfully!'); // Consider using a more integrated notification system
                fetchUsers(); // Refresh the list
            } catch (err) {
                console.error('Error updating user role:', err);
                setError(err.response?.data?.message || 'Failed to update user role.');
            } finally {
                setLoading(false);
            }
        } else if (newRole !== null) { // User didn't click cancel, but entered invalid role
            alert('Invalid role. Please enter STUDENT, FACULTY, or ADMIN.');
        }
    };

    if (loading) return (
        <div className="content-wrapper">
            <p className="text-center mt-4">Loading users...</p>
        </div>
    );
    if (error) return (
        <div className="content-wrapper">
            <div className="alert alert-danger mt-4">{error}</div>
        </div>
    );

    return (
        <div className="content-wrapper">
            <div className="page-header">
                <h1>Admin Panel</h1>
                <p>Manage CampusConnect users and their roles.</p>
            </div>

            <div className="custom-card">
                <div className="custom-card-header">
                    <h3>User Management</h3>
                </div>
                <div className="card-body">
                    {users.length === 0 ? (
                        <p className="text-center">No users found.</p>
                    ) : (
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th> {/* Correctly displaying Name now */}
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th style={{ width: '250px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td> {/* Correctly displaying user.name */}
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <button
                                                className="secondary-action-button action-button-small me-2"
                                                onClick={() => handleRoleUpdate(user.id, user.role)}
                                            >
                                                Update Role
                                            </button>
                                            <button
                                                className="action-button action-button-small danger-button-bg"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;