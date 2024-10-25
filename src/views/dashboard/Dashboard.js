import React, { useState } from 'react';
import WidgetsDropdown from '../widgets/WidgetsDropdown';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CForm, CFormInput, CFormLabel, CFormTextarea, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';

const Dashboard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [issues, setIssues] = useState([]);

  const handleSaveIssue = () => {
    const newIssue = { name, description };
    setIssues([...issues, newIssue]);
    setModalVisible(false);
    setName('');
    setDescription('');
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
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Description</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {issues.map((issue, index) => (
            <CTableRow key={index}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>{issue.name}</CTableDataCell>
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
          <CButton color="primary" onClick={handleSaveIssue}>Save changes</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Dashboard;
