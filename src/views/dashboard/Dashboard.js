import React, { useState, useEffect } from 'react';
import WidgetsDropdown from '../widgets/WidgetsDropdown';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CForm, CFormInput, CFormLabel, CFormTextarea, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToast, CToastBody, CToastHeader, CToaster } from '@coreui/react';

const Dashboard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [issues, setIssues] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('danger');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const s_apiUrl = 'https://backend-781163639586.us-central1.run.app/api/';

  useEffect(() => {
    const fetchIssues = async () => {
      const loginData = JSON.parse(sessionStorage.getItem('loginData'));
      const accessToken = loginData?.access_token;

      if (accessToken) {
        try {
          const response = await fetch(s_apiUrl + 'incidents', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch issues');
          }

          const data = await response.json();
          setIssues(data);
        } catch (error) {
          console.error('Error fetching issues:', error);
          setToastMessage('Failed to fetch issues.');
          setToastColor('danger');
          setToastVisible(true);
        }
      } else {
        console.error('Access token not found');
        setToastMessage('Access token not found.');
        setToastColor('danger');
        setToastVisible(true);
      }
    };

    fetchIssues();
  }, []);

  const handleSaveIssue = async () => {
    setIsSubmitting(true);

    if (!name || !description) {
      setToastMessage('Please fill in all fields before saving.');
      setToastColor('danger');
      setToastVisible(true);
      setIsSubmitting(false);
      return;
    }

    const newIssue = { name, description };
    setIssues([...issues, newIssue]);
    setModalVisible(false);
    setName('');
    setDescription('');
    setIsSubmitting(false);

    // Construct JSON payload
    const payload = {
      source: 'web',
      description: description,
    };

    // Get access token from session storage
    const loginData = JSON.parse(sessionStorage.getItem('loginData'));
    const accessToken = loginData?.access_token;

    if (accessToken) {
      try {
        // Send POST request using fetch
        const response = await fetch(s_apiUrl + 'incident', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to send issue');
        }

        // Show success toast
        setToastMessage('Issue created successfully.');
        setToastColor('success');
        setToastVisible(true);
      } catch (error) {
        console.error('Error sending issue:', error);
        setToastMessage('Failed to create issue.');
        setToastColor('danger');
        setToastVisible(true);
      }
    } else {
      console.error('Access token not found');
      setToastMessage('Access token not found.');
      setToastColor('danger');
      setToastVisible(true);
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
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
            <CTableHeaderCell scope="col">Description</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {issues.map((issue, index) => (
            <CTableRow key={issue.id}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>{issue.status}</CTableDataCell>
              <CTableDataCell>{issue.description}</CTableDataCell>
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
            Save changes
          </CButton>
        </CModalFooter>
      </CModal>
      <CToaster
        push={
          toastVisible ? (
            <CToast key={new Date().getTime()} autohide={true} visible={toastVisible} color={toastColor}>
              <CToastHeader closeButton>
                <svg
                  className="rounded me-2"
                  width="20"
                  height="20"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid slice"
                  focusable="false"
                  role="img"
                >
                  <rect width="100%" height="100%" fill={toastColor === 'danger' ? '#ff0000' : '#00ff00'}></rect>
                </svg>
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
