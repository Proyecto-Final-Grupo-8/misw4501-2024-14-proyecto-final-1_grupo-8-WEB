import React, { useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CCardImage,
  CFormSelect,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CSpinner,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser, cilUserPlus, cilIndustry } from '@coreui/icons';

// Import Logo
import ABCAllLogo from 'src/assets/images/logos/abcall-logo.png';

const s_apiUrl = 'https://backend-781163639586.us-central1.run.app/api/';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false); // Toast visibility state
  const [toastMessage, setToastMessage] = useState(''); // Toast message state
  const [toastColor, setToastColor] = useState('danger'); // Toast color state

  const register = async () => {
    try {
      setLoading(true);
      setToastVisible(false);

      const s_username = document.getElementById('username').value;
      const s_role = document.getElementById('role').value;
      const s_company = document.getElementById('company').value;
      const s_password = document.getElementById('password').value;
      const s_confirmPassword = document.getElementById('confirmPassword').value;

      // Validate inputs
      if (!s_username || !s_role || !s_company || !s_password || !s_confirmPassword) {
        setToastMessage('Please fill out all fields!');
        setToastColor('danger');
        setToastVisible(true);
        setLoading(false);
        return;
      }

      // Check if password and confirm password match
      if (s_password !== s_confirmPassword) {
        setToastMessage('Passwords do not match!');
        setToastColor('danger');
        setToastVisible(true);
        setLoading(false);
        return;
      }

      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        username: s_username,
        role: s_role,
        company: s_company,
        password: s_password,
      });

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      const o_response = await fetch(s_apiUrl + 'register', requestOptions);

      if (!o_response.ok) {
        throw new Error('Registration failed, please try again.');
      }

      const result = await o_response.json();
      console.log('Registration successful:', result);

      // Show success toast and redirect
      setToastMessage('Registration successful! Redirecting...');
      setToastColor('success');
      setToastVisible(true);

      setTimeout(() => {
        window.location.href = '/#/dashboard';
      }, 2000); // Redirect after 2 seconds to allow the toast to display
    } catch (error) {
      setToastMessage('Registration failed! Please try again.');
      setToastColor('danger');
      setToastVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4 p-4">
              <CCardImage
                orientation="top"
                src={ABCAllLogo}
                style={{ width: 100, margin: '0 auto' }}
              />
              <CCardBody className="p-4">
                <CForm>
                  <h3>Register</h3>
                  <p className="text-body-secondary">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      id="username"
                      placeholder="Username"
                      autoComplete="username"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUserPlus}/>
                    </CInputGroupText>
                    <CFormSelect id="role">
                      <option value="cliente">Cliente</option>
                      <option value="analista">Analista</option>
                    </CFormSelect>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilIndustry}/>
                    </CInputGroupText>
                    <CFormSelect id="company">
                      <option value="">Select a Company</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                    </CFormSelect>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      id="password"
                      placeholder="Password"
                      autoComplete="new-password"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                    />
                  </CInputGroup>
                  <CButton color="primary" onClick={register} disabled={loading}>
                    {loading ? <CSpinner size="sm" color="light" /> : 'Create Account'}
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>

            <CToaster
              push={
                toastVisible ? (
                  <CToast autohide={true} visible={toastVisible} color={toastColor}>
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
                        <rect width="100%" height="100%" fill={toastColor === 'success' ? '#28a745' : '#ff0000'}></rect>
                      </svg>
                      <strong className="me-auto">
                        {toastColor === 'success' ? 'Success' : 'Registration Error'}
                      </strong>
                      <small>Now</small>
                    </CToastHeader>
                    <CToastBody>{toastMessage}</CToastBody>
                  </CToast>
                ) : null
              }
              placement="bottom-end"
            />
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;
