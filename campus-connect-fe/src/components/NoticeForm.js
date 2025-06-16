import React, { useState /*, useEffect*/ } from 'react'; // Removed useEffect as it's no longer needed for noticeToEdit
import { postNotice /*, updateNotice*/ } from '../api/notices'; // Removed updateNotice import

// --- CORRECTED: DEPARTMENT_OPTIONS and YEAR_OPTIONS are now properly defined ---
const DEPARTMENT_OPTIONS = [
    { code: 'IT', display: 'Information Technology' },
    { code: 'CS', display: 'Computer Science' },
    { code: 'ECE', display: 'Electronics and Communication Engineering' },
    { code: 'EEE', display: 'Electrical and Electronics Engineering' },
    { code: 'CIVIL', display: 'Civil Engineering' },
    { code: 'MECH', display: 'Mechanical Engineering' },
];

const YEAR_OPTIONS = [
    { code: 'FE', display: 'First Year' },
    { code: 'SE', display: 'Second Year' },
    { code: 'TE', display: 'Third Year' },
    { code: 'BE', display: 'Final Year' },
    { code: 'PG', display: 'Postgraduate' },
];
// --- END CORRECTED SECTION ---

// Removed noticeToEdit prop since editing functionality is removed for notices
const NoticeForm = ({ onNoticePosted, onClose }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [department, setDepartment] = useState('IT'); // Default to IT
    const [year, setYear] = useState('FE'); // Default to First Year
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Removed useEffect for noticeToEdit, as editing is no longer a concern for this form
    // useEffect(() => { /* ... */ }, [noticeToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (!title.trim()) {
            setError('Notice title cannot be empty.');
            setLoading(false);
            return;
        }
        if (!content.trim()) {
            setError('Notice content cannot be empty.');
            setLoading(false);
            return;
        }

        try {
            const noticeData = { title, content, department, year };
            await postNotice(noticeData); // Only posting functionality remains
            setSuccess('Notice posted successfully!');

            // Clear form fields after successful post
            setTitle('');
            setContent('');
            setDepartment('IT'); // Reset to default
            setYear('FE'); // Reset to default

            if (onNoticePosted) {
                onNoticePosted(); // Callback to parent (e.g., to re-fetch notices)
            }
            if (onClose) {
                onClose(); // Close the form if it's in a modal/toggleable
            }
        } catch (err) {
            console.error('Error posting notice:', err);
            setError(err.response?.data?.message || 'Failed to post notice. Please check your input.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="custom-card">
            <div className="custom-card-header">
                <h3>Post New Notice</h3>
                {onClose && (
                    <button type="button" className="custom-close-button" onClick={onClose}>
                        &times;
                    </button>
                )}
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input
                            type="text"
                            className="custom-form-input"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="content" className="form-label">Content</label>
                        <textarea
                            className="custom-form-input"
                            id="content"
                            rows="3"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="department" className="form-label">Department</label>
                            <select
                                className="custom-form-select"
                                id="department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                required
                            >
                                {DEPARTMENT_OPTIONS.map(option => (
                                    <option key={option.code} value={option.code}>
                                        {option.display}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="year" className="form-label">Year</label>
                            <select
                                className="custom-form-select"
                                id="year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                required
                            >
                                {YEAR_OPTIONS.map(option => (
                                    <option key={option.code} value={option.code}>
                                        {option.display}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    {success && <div className="alert alert-success mt-3">{success}</div>}
                    <button type="submit" className="action-button mt-3" disabled={loading}>
                        {loading ? 'Posting...' : 'Post Notice'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NoticeForm;