import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CButton, CCard, CCardBody, CCardHeader, CModal, CModalBody, CModalFooter, CModalHeader,
  CModalTitle, CForm, CFormInput, CFormLabel, CFormTextarea, CToast, CToastBody,
  CToastHeader, CToaster
} from '@coreui/react';

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('danger');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiUrl = 'https://backend-781163639586.us-central1.run.app/api/';

  const getAccessToken = () => JSON.parse(sessionStorage.getItem('loginData'))?.access_token;

  const showToast = (message, color) => {
    setToastMessage(message);
    setToastColor(color);
    setToastVisible(true);
  };

  useEffect(() => {
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
      } catch (error) {
        console.error('Error fetching issues:', error);
        setError('Failed to fetch issues.');
      }
    };

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
      } catch (error) {
        console.error('Error fetching issue:', error);
        setError('Failed to fetch issue details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllIssues();
    fetchIssueById();
  }, [id]);

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

      const newIssue = await response.json(); // Asumimos que la respuesta incluye el ID en newIssue.incident
      showToast('Issue created successfully.', 'success');
      setModalVisible(false);
      setName('');
      setDescription('');

      // Redirigir al detalle del nuevo issue usando el ID de la respuesta
      navigate(`/issues/${newIssue.incident}`);
    } catch (error) {
      console.error('Error creating issue:', error);
      showToast('Failed to create issue.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!selectedIssue) return <p>Issue not found.</p>;

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {/* Sidebar with a list of all issues */}
      <div style={{ width: '20%', borderRight: '1px solid #ccc', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h4>My Issues</h4>
          <CButton color="primary" style={{ marginLeft: '1.5rem' }} onClick={() => setModalVisible(true)}>
            New
          </CButton>
        </div>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {issues.map((issue, index) => (
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
            <h2>{selectedIssue.description}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>Status: {selectedIssue.status}</span>
              <span>Source: {selectedIssue.source}</span>
              <span>Customer: {selectedIssue.customer}</span>
            </div>
          </CCardHeader>
          <CCardBody>
            <h5>Description</h5>
            <p>{selectedIssue.description}</p>
            {/* Add more detailed information if available */}
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
                aria-label="Issue Name"
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="issueDescription">Description</CFormLabel>
              <CFormTextarea
                id="issueDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter issue description"
                aria-label="Issue Description"
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
