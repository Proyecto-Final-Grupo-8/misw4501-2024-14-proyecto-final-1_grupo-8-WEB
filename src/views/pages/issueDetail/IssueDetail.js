import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CButton, CCard, CCardBody, CCardHeader,
  CForm, CFormTextarea, CToast, CToastBody,
  CToastHeader, CToaster, CModal, CModalBody, CModalFooter, CModalHeader,
  CModalTitle, CFormInput, CFormLabel
} from '@coreui/react';

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [logs, setLogs] = useState([]);
  const [newLogDetails, setNewLogDetails] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('danger');
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [customer, setCustomer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiUrl = 'https://backend-781163639586.us-central1.run.app/api/';

  const getAccessToken = () => JSON.parse(sessionStorage.getItem('loginData'))?.access_token;

  const showToast = (message, color) => {
    setToastMessage(message);
    setToastColor(color);
    setToastVisible(true);
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${apiUrl}incident/${id}/logs`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }

      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Failed to fetch logs.');
    }
  };

  const fetchAllIssues = async () => {
    try {
      const response = await fetch(`${apiUrl}incidents`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch issues');
      }

      const data = await response.json();
      setIssues(data);
      setFilteredIssues(data);
    } catch (error) {
      console.error('Error fetching issues:', error);
      setError('Failed to fetch issues.');
    }
  };

  useEffect(() => {
    const fetchIssueById = async () => {
      try {
        const response = await fetch(`${apiUrl}incident/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${getAccessToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch issue details');
        }

        const data = await response.json();
        setSelectedIssue(data);
        setDescription(data.description);
        setStatus(data.status);
        setCustomer(data.customer); // Set the customer state
      } catch (error) {
        console.error('Error fetching issue:', error);
        setError('Failed to fetch issue details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllIssues();
    fetchIssueById();
    fetchLogs();
  }, [id]);

  useEffect(() => {
    filterIssuesByDate();
  }, [dateFilter, issues]);

  const filterIssuesByDate = () => {
    const today = new Date();
    let filtered = issues;

    switch (dateFilter) {
      case 'today':
        filtered = issues.filter(issue => {
          const issueDate = new Date(issue.created_date);
          return issueDate.toDateString() === today.toDateString();
        });
        break;
      case 'this-month':
        filtered = issues.filter(issue => {
          const issueDate = new Date(issue.created_date);
          return issueDate.getMonth() === today.getMonth() && issueDate.getFullYear() === today.getFullYear();
        });
        break;
      case 'last-month':
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        filtered = issues.filter(issue => {
          const issueDate = new Date(issue.created_date);
          return issueDate.getMonth() === lastMonth.getMonth() && issueDate.getFullYear() === lastMonth.getFullYear();
        });
        break;
      default:
        filtered = issues;
    }

    setFilteredIssues(filtered);
  };

  const handleAddLog = async () => {
    if (!newLogDetails) {
      showToast('Please enter log details.', 'danger');
      return;
    }

    const payload = { details: newLogDetails };

    try {
      const response = await fetch(`${apiUrl}incident/${id}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to add log');

      setNewLogDetails('');
      await fetchLogs(); // Refresh logs after adding
    } catch (error) {
      console.error('Error adding log:', error);
      showToast('Failed to add log.', 'danger');
    }
  };

  const handleSaveIssue = async () => {
    setIsSubmitting(true);
    if (!name || !description) {
      showToast('Please fill in all fields before saving.', 'danger');
      setIsSubmitting(false);
      return;
    }

    const payload = { source: 'web', description };

    try {
      const response = await fetch(`${apiUrl}incident`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to create issue');

      const newIssue = await response.json();
      showToast('Issue created successfully.', 'success');
      setModalVisible(false);
      setName('');
      setDescription('');
      navigate(`/issues/${newIssue.incident}`);
    } catch (error) {
      console.error('Error creating issue:', error);
      showToast('Failed to create issue.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateIssue = async () => {
    const payload = {
      description,
      status,
    };

    try {
      const response = await fetch(`${apiUrl}incident/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to update issue');

      showToast('Issue updated successfully.', 'success');
    } catch (error) {
      console.error('Error updating issue:', error);
      showToast('Failed to update issue.', 'danger');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!selectedIssue) return <p>Issue not found.</p>;

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {/* Sidebar with a list of all issues */}
      <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h4>My Issues</h4>
          <CButton color="primary" onClick={() => setModalVisible(true)}>
            New
          </CButton>
        </div>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{ width: '150px', marginBottom: '1rem' }}
        >
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="this-month">This Month</option>
          <option value="last-month">Last Month</option>
        </select>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {filteredIssues.map((issue, index) => (
            <li
              key={issue.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid #ddd',
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>{index + 1}.</span>
              <Link
                to={`/issues/${issue.id}`}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: id === issue.id ? 'blue' : 'black',
                }}
              >
                {issue.description}
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
          <CButton color="secondary" style={{ marginTop: '1rem' }}>Back to Issues</CButton>
        </Link>
      </div>

      {/* Main detail section */}
      <div style={{ width: '75%', padding: '1rem' }}>
        <CCard>
          <CCardHeader>
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
              <div>
                <label htmlFor="status">Status:</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ marginLeft: '1rem' }}
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div>
                <label>Customer:</label> <span>{customer}</span>
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <label htmlFor="description">Description:</label>
            <CFormTextarea
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />
            <CButton color="success" onClick={handleUpdateIssue}>
              Save Changes
            </CButton>
            <h5 style={{ marginTop: '1rem' }}>Comments</h5>
            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
              {logs.length > 0 ? logs.map(log => (
                <div key={log.id} style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.9rem', color: '#555' }}>
                    <strong>{log.user_name}</strong> ({log.user_role}) - <small>{new Date(log.created_date).toLocaleString()}</small>
                  </div>
                  <div style={{ background: '#f1f1f1', padding: '0.5rem', borderRadius: '5px' }}>
                    {log.details}
                  </div>
                </div>
              )) : <p>No comments available.</p>}
            </div>
            <h5 style={{ marginTop: '1rem' }}>Add Comment</h5>
            <CForm>
              <CFormTextarea
                value={newLogDetails}
                onChange={(e) => setNewLogDetails(e.target.value)}
                placeholder="Enter your comment"
                rows="3"
              />
              <CButton color="primary" style={{ marginTop: '0.5rem' }} onClick={handleAddLog}>
                Add Comment
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </div>

      {/* Modal for creating a new issue */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>New Issue</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="issueName">Name</CFormLabel>
              <CFormInput
                type="text"
                id="issueName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter issue name"
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="issueDescription">Description</CFormLabel>
              <CFormTextarea
                id="issueDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter issue description"
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSaveIssue} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </CButton>
        </CModalFooter>
      </CModal>

      <CToaster
        push={
          toastVisible ? (
            <CToast key={new Date().getTime()} autohide={true} visible={toastVisible} color={toastColor}>
              <CToastHeader closeButton>
                <strong className="me-auto">{toastColor === 'danger' ? 'Error' : 'Success'}</strong>
                <small>Now</small>
              </CToastHeader>
              <CToastBody>{toastMessage}</CToastBody>
            </CToast>
          ) : null
        }
        placement="bottom-end"
      />
    </div>
  );
};

export default IssueDetail;
