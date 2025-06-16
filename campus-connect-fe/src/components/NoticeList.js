import React, { useState, useEffect, useCallback } from 'react';
import { getNoticesByDepartmentAndYear } from '../api/notices';
import { useAuth } from '../context/AuthContext';
import NoticeForm from './NoticeForm'; // Make sure this import is correct

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

const NoticeList = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDepartmentCode, setSelectedDepartmentCode] = useState('---');
    const [selectedYearCode, setSelectedYearCode] = useState('---');

    // --- NEW STATE FOR TOGGLING NOTICE FORM ---
    const [showPostNoticeForm, setShowPostNoticeForm] = useState(false);
    // --- END NEW STATE ---

    const { user } = useAuth();
    const userRole = user?.role;

    const getDepartmentDisplayName = (code) => {
        const option = DEPARTMENT_OPTIONS.find(opt => opt.code === code);
        return option ? option.display : code;
    };

    const getYearDisplayName = (code) => {
        const option = YEAR_OPTIONS.find(opt => opt.code === code);
        return option ? option.display : code;
    };

    const fetchNotices = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const departmentParam = selectedDepartmentCode === '---' ? null : selectedDepartmentCode;
            const yearParam = selectedYearCode === '---' ? null : selectedYearCode;
            const data = await getNoticesByDepartmentAndYear(departmentParam, yearParam);
            setNotices(data);
        } catch (err) {
            console.error('Error fetching notices:', err);
            setError('Failed to fetch notices. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [selectedDepartmentCode, selectedYearCode]);

    useEffect(() => {
        fetchNotices();
    }, [fetchNotices]);

    const handleDepartmentChange = (e) => {
        setSelectedDepartmentCode(e.target.value);
    };

    const handleYearChange = (e) => {
        setSelectedYearCode(e.target.value);
    };

    // --- UPDATED: handleNoticeFormClose now for posting new notice ---
    const handleNoticeFormClose = () => {
        setShowPostNoticeForm(false); // Hide the form
        fetchNotices(); // Re-fetch notices to show the newly posted one
    };
    // --- END UPDATED ---


    if (loading) return <div className="text-center mt-4"><p>Loading notices...</p></div>;
    if (error) return <div className="text-center mt-4"><div className="alert alert-danger">{error}</div></div>;

    return (
        <div>
            <h2 className="page-title-notices">Notices</h2>

            {/* --- NEW: Post New Notice Button and Conditional Form Rendering --- */}
            {userRole === 'FACULTY' && (
                <div className="text-end mb-4"> {/* Added some margin-bottom for spacing */}
                    <button
                        className="action-button"
                        onClick={() => setShowPostNoticeForm(!showPostNoticeForm)}
                    >
                        {showPostNoticeForm ? 'Hide Notice Form' : 'Post New Notice'}
                    </button>
                </div>
            )}

            {showPostNoticeForm && (
                <div className="notice-form-section-card mb-4"> {/* Added margin-bottom */}
                    <NoticeForm
                        onNoticePosted={handleNoticeFormClose} // Callback after post
                        onClose={handleNoticeFormClose} // Callback to hide the form
                    />
                </div>
            )}
            {/* --- END NEW SECTION --- */}

            <div className="card custom-card filter-section-card">
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="departmentFilter" className="form-label">Filter by Department:</label>
                            <select
                                id="departmentFilter"
                                className="form-select custom-form-select"
                                value={selectedDepartmentCode}
                                onChange={handleDepartmentChange}
                            >
                                <option value="---">---</option>
                                {DEPARTMENT_OPTIONS.map(option => (
                                    <option key={option.code} value={option.code}>
                                        {option.display}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="yearFilter" className="form-label">Filter by Year:</label>
                            <select
                                id="yearFilter"
                                className="form-select custom-form-select"
                                value={selectedYearCode}
                                onChange={handleYearChange}
                            >
                                <option value="---">---</option>
                                {YEAR_OPTIONS.map(option => (
                                    <option key={option.code} value={option.code}>
                                        {option.display}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {notices.length === 0 ? (
                <div className="alert alert-info text-center mt-4">
                    <p>No notices found for the selected criteria.</p>
                </div>
            ) : (
                <div className="notice-list-grid">
                    {notices.map((notice) => (
                        <div key={notice.id} className="notice-card custom-card">
                            <div className="card-body">
                                <h5 className="card-title notice-title-bold">{notice.title}</h5>
                                <p className="card-text"><strong>Department:</strong> {getDepartmentDisplayName(notice.department)}</p>
                                <p className="card-text"><strong>Year:</strong> {getYearDisplayName(notice.year)}</p>
                                <p className="card-text notice-content">{notice.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NoticeList;