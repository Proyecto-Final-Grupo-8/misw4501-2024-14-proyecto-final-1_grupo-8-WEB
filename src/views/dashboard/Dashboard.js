import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WidgetsDropdown from '../widgets/WidgetsDropdown';
import {
  CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle,
  CForm, CFormInput, CFormLabel, CFormTextarea,
  CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
  CToast, CToastBody, CToastHeader, CToaster
} from '@coreui/react';

const Dashboard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [issues, setIssues] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('danger');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiUrl = 'https://backend-781163639586.us-central1.run.app/api/';

  // Helper function for session token retrieval
  const getAccessToken = () => JSON.parse(sessionStorage.getItem('loginData'))?.access_token;

  // Helper function to show toast
  const showToast = (message, color) => {
    setToastMessage(message);
    setToastColor(color);
    setToastVisible(true);
  };

  // Function to fetch issues
  const fetchIssues = async () => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      showToast('Access token not found.', 'danger');
      return;
    }
    try {
      const response = await fetch(`${apiUrl}incidents`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error('Failed to fetch issues');
      const data = await response.json();
      setIssues(data);
    } catch (error) {
      console.error('Error fetching issues:', error);
      showToast('Failed to fetch issues.', 'danger');
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleSaveIssue = async () => {
    setIsSubmitting(true);
    if (!name || !description) {
      showToast('Please fill in all fields before saving.', 'danger');
      setIsSubmitting(false);
      return;
    }

    const accessToken = getAccessToken();
    if (!accessToken) {
      showToast('Access token not found.', 'danger');
      setIsSubmitting(false);
      return;
    }

    const payload = { source: 'web', description };
    try {
      const response = await fetch(`${apiUrl}incident`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to send issue');
      showToast('Issue created successfully.', 'success');
      await fetchIssues(); // Refresh issues list
      setModalVisible(false);
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error sending issue:', error);
      showToast('Failed to create issue.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2>Issues</h2>
        <CButton
          color="primary"
          className="px-4"
          style={{ marginLeft: '1.5rem' }}
          onClick={() => setModalVisible(true)}
        >
          New
        </CButton>
      </div>
      <CTable className="mt-4">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Description</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {issues.map((issue, index) => (
            <CTableRow key={issue.id}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>{issue.status}</CTableDataCell>
              <CTableDataCell>{issue.description}</CTableDataCell>
              <CTableDataCell>
                <Link to={`/issues/${issue.id}`}>
                  <CButton color="info">View Detail</CButton>
                </Link>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
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
    </>
  );
};

export default Dashboard;
