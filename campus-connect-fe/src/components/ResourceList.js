// src/components/ResourceList.js
import React, { useState, useEffect, useCallback } from 'react';
import { getResourcesBySubject } from '../api/resources';
import { useAuth } from '../context/AuthContext'; // Using useAuth for user role
import ResourceUploadForm from './ResourceUploadForm'; // We'll create this next

const SUBJECT_OPTIONS = [
    { code: 'Physics', display: 'Physics' },
    { code: 'Chemistry', display: 'Chemistry' },
    { code: 'Math', display: 'Math' },
    { code: 'Biology', display: 'Biology' },
    { code: 'Computer Science', display: 'Computer Science' },
    { code: 'Other', display: 'Other' }, // Added 'Other' for flexibility
];

const ResourceList = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subject, setSubject] = useState('Physics'); // Default subject
    const [showUploadForm, setShowUploadForm] = useState(false); // State for toggling form

    const { user } = useAuth(); // Get user from AuthContext
    const userRole = user?.role; // Get the current user's role

    const fetchResources = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getResourcesBySubject(subject);
            setResources(data);
        } catch (err) {
            console.error('Error fetching resources:', err);
            setError('Failed to fetch resources. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [subject]);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    const handleFormSuccess = () => {
        setShowUploadForm(false); // Hide form after successful upload
        fetchResources(); // Refresh the list of resources
    };

    if (loading) return <div className="text-center mt-4"><p>Loading resources...</p></div>;
    if (error) return <div className="text-center mt-4"><div className="alert alert-danger">{error}</div></div>;

    return (
        <div> {/* No external container here; content-wrapper handles layout */}
            <div className="page-header"> {/* Applying page-header style */}
                <h1>Resources</h1>
                <p>Browse and upload academic resources by subject.</p>
            </div>

            {/* Filter and Upload Button Section */}
            <div className="custom-card filter-section-card"> {/* Using custom-card for consistency */}
                <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                    <div className="mb-3 mb-md-0 d-flex align-items-center">
                        <label htmlFor="subjectSelect" className="form-label me-2 mb-0">Subject:</label>
                        <select
                            id="subjectSelect"
                            className="custom-form-select" // Using custom-form-select
                            style={{ width: 'auto' }} // Keep inline style for explicit width control
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        >
                            {SUBJECT_OPTIONS.map(option => (
                                <option key={option.code} value={option.code}>
                                    {option.display}
                                </option>
                            ))}
                        </select>
                    </div>

                    {userRole === 'FACULTY' && ( // Only show "Upload Resource" button if user is FACULTY
                        <button
                            className="action-button" // Using action-button for theme consistency
                            onClick={() => setShowUploadForm(!showUploadForm)}
                        >
                            {showUploadForm ? 'Hide Upload Form' : 'Upload New Resource'}
                        </button>
                    )}
                </div>
            </div>

            {showUploadForm && (
                <div className="resource-upload-section-card"> {/* Wrap form in a styled div */}
                    <ResourceUploadForm onResourceUploaded={handleFormSuccess} />
                </div>
            )}

            {!loading && resources.length === 0 && <p className="text-center mt-4">No resources found for {subject}.</p>}

            {!loading && resources.length > 0 && (
                <div className="resource-list-grid"> {/* Grid for resources */}
                    {resources.map((resource) => (
                        <div key={resource.id} className="resource-item-card custom-card"> {/* New class for resource items */}
                            <div className="card-body">
                                <h5 className="resource-title">{resource.title}</h5>
                                <p className="mb-1">
                                    <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" className="resource-file-link">
                                        {resource.fileUrl}
                                    </a>
                                </p>
                                <div className="resource-meta">
                                    <small className="text-muted">Subject: <span className="info-badge-small">{resource.subject}</span></small>
                                    <small className="text-muted">Uploaded by: {resource.uploadedBy}</small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResourceList;