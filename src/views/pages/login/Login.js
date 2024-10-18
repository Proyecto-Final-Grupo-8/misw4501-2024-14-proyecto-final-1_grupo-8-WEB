import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CCardImage,
  CSpinner,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';

// Import Logo
import ABCAllLogo from 'src/assets/images/logos/abcall-logo.png';

const s_apiUrl = 'https://backend-781163639586.us-central1.run.app/api/';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false); // Toast visibility state
  const [toastMessage, setToastMessage] = useState(''); // Toast message state

  if (sessionStorage.getItem('loginData')) {
    window.location.href = '/#/dashboard';
  }

  const login = async () => {
    try {
      setLoading(true);
      setToastVisible(false); // Hide toast before trying login

      // Get the input values
      const s_username = document.getElementById('username').value;
      const s_password = document.getElementById('password').value;

      // Build headers and request body
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        username: s_username,
        password: s_password,
      });

      // Set up request options
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      // Make the fetch request
      const o_response = await fetch(s_apiUrl + 'login', requestOptions);

      // Check if response is okay
      if (!o_response.ok) {
        throw new Error('Invalid credentials, please try again.');
      }

      // Assuming the response is JSON, parse it
      const result = await o_response.json();
      sessionStorage.setItem('loginData', JSON.stringify(result));
      window.location.href = '/#/dashboard';
    } catch (error) {
      // Show error toast if login fails
      setToastMessage('Login failed! Please check your credentials.');
      setToastVisible(true);
    } finally {
      setLoading(false); // Hide spinner after request completes
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="mx-4 p-4">
                <CCardImage
                  orientation="top"
                  src={ABCAllLogo}
                  style={{ width: 100, margin: '0 auto' }}
                />
                <CCardBody>
                  <CForm>
                    <h3>Login</h3>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput id="username" placeholder="Username" autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-1">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        id="password"
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CButton color="link" className="px-0 mb-4">
                      Forgot password?
                    </CButton>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          onClick={login}
                          color="primary"
                          className="px-4"
                          style={{ marginRight: '1.5rem' }}
                          disabled={loading}
                        >
                          {loading ? <CSpinner size="sm" color="light" /> : 'Login'}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>

            <CToaster
              push={
                toastVisible ? (
                  <CToast autohide={true} visible={toastVisible} color="danger">
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
                        <rect width="100%" height="100%" fill="#ff0000"></rect>
                      </svg>
                      <strong className="me-auto">Login Error</strong>
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

export default Login;
