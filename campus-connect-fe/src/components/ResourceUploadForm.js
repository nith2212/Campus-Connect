// src/components/ResourceUploadForm.js
import React, { useState } from 'react';
import { uploadResource } from '../api/resources';

const ResourceUploadForm = ({ onResourceUploaded }) => {
    const [title, setTitle] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [subject, setSubject] = useState('Physics'); // Default subject
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await uploadResource({ title, fileUrl, subject });
            setSuccess('Resource uploaded successfully!');
            setTitle('');
            setFileUrl('');
            if (onResourceUploaded) {
                onResourceUploaded(); // Callback to refresh resource list
            }
        } catch (err) {
            console.error('Error uploading resource:', err);
            setError(err.response?.data || 'Failed to upload resource. Please check your input.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card my-4">
            <div className="card-header">
                <h3>Upload New Resource</h3>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fileUrl" className="form-label">File URL (or Path)</label>
                        <input
                            type="text"
                            className="form-control"
                            id="fileUrl"
                            value={fileUrl}
                            onChange={(e) => setFileUrl(e.target.value)}
                            required
                        />
                         <small className="form-text text-muted">For now, just paste a link or a dummy path like `/files/myfile.pdf`.</small>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="subject" className="form-label">Subject</label>
                        <select
                            className="form-select"
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        >
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Math">Math</option>
                            <option value="Biology">Biology</option>
                            <option value="Computer Science">Computer Science</option>
                            {/* Add other subjects as needed, matching backend data */}
                        </select>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload Resource'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResourceUploadForm;