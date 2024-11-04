import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WidgetsDropdown from '../widgets/WidgetsDropdown';
import {
  CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle,
  CForm, CFormInput, CFormLabel, CFormTextarea,
  CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
  CToast, CToastBody, CToastHeader, CToaster,
} from '@coreui/react';

const Dashboard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');
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
      setFilteredIssues(data);
    } catch (error) {
      console.error('Error fetching issues:', error);
      showToast('Failed to fetch issues.', 'danger');
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

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
      await fetchIssues();
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2>Issues</h2>
          <CButton
            color="primary"
            className="px-4"
            onClick={() => setModalVisible(true)}
            style={{ marginLeft: '1.5rem' }}
          >
            New
          </CButton>
        </div>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{ width: '200px' }}
        >
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="this-month">This Month</option>
          <option value="last-month">Last Month</option>
        </select>
      </div>
      <CTable className="mt-4">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Description</CTableHeaderCell>
            <CTableHeaderCell>Created Date</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredIssues.map((issue, index) => (
            <CTableRow key={issue.id}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>{issue.status}</CTableDataCell>
              <CTableDataCell>{issue.description}</CTableDataCell>
              <CTableDataCell>{new Date(issue.created_date).toLocaleDateString()}</CTableDataCell>
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
    </>
  );
};

export default Dashboard;
