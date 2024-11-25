import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import {
  cilLockLocked,
  cilUser,
  cilUserPlus,
  cilIndustry,
  cilEnvelopeClosed,
  cilScreenSmartphone,
} from '@coreui/icons';

// Import Logo
import ABCAllLogo from 'src/assets/images/logos/abcall-logo.png';

const s_apiUrl = 'https://backend-781163639586.us-central1.run.app/api/';

const Register = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]); // State to hold the companies list
  const [toastVisible, setToastVisible] = useState(false); // Toast visibility state
  const [toastMessage, setToastMessage] = useState(''); // Toast message state
  const [toastColor, setToastColor] = useState('danger'); // Toast color state

  // Fetch companies when component mounts
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(s_apiUrl + 'companies', {
          method: 'GET',
          redirect: 'follow',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch companies');
        }

        const result = await response.json();
        setCompanies(result); // Save companies to state
      } catch (error) {
        setToastMessage('Error fetching companies. Please try again.');
        setToastColor('danger');
        setToastVisible(true);
      }
    };

    fetchCompanies();
  }, []);

  const register = async () => {
    try {
      setLoading(true);
      setToastVisible(false);

      const s_username = document.getElementById('username').value;
      const s_role = document.getElementById('role').value;
      const s_company = document.getElementById('company_id').value;
      const s_password = document.getElementById('password').value;
      const s_confirmPassword = document.getElementById('confirmPassword').value;
      const s_name = document.getElementById('name').value;
      const s_lastName = document.getElementById('last_name').value;
      const s_email = document.getElementById('email').value;
      const s_phone = document.getElementById('phone').value;

      // Validate inputs
      if (
        !s_username ||
        !s_role ||
        !s_company ||
        !s_password ||
        !s_confirmPassword ||
        !s_email ||
        !s_lastName
      ) {
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
        name: s_name,
        last_name: s_lastName,
        phone: s_phone,
        email: s_email,
        role: s_role,
        company_id: s_company,
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
                  <h3>{t('Register')}</h3>
                  <p className="text-body-secondary">{t('Create your account')}</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput id="username" placeholder={t('Username')} autoComplete="username" />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput id="name" placeholder={t('Name')} autoComplete="name" />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      id="last_name"
                      placeholder={t('Last Name')}
                      autoComplete="last_name"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilEnvelopeClosed} />
                    </CInputGroupText>
                    <CFormInput id="email" placeholder={t('Email')} autoComplete="email" />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilScreenSmartphone} />
                    </CInputGroupText>
                    <CFormInput id="phone" placeholder={t('Phone')} autoComplete="phone" />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUserPlus} />
                    </CInputGroupText>
                    <CFormSelect id="role">
                      <option value="customer">{t('Customer')}</option>
                      <option value="analyst">{t('Analyst')}</option>
                    </CFormSelect>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilIndustry} />
                    </CInputGroupText>
                    <CFormSelect id="company_id">
                      <option value="">{t('Select a Company')}</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      id="password"
                      placeholder={t('Password')}
                      autoComplete={t('New password')}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      id="confirmPassword"
                      placeholder={t('Confirm Password')}
                      autoComplete={t('New password')}
                    />
                  </CInputGroup>
                  <CButton color="primary" onClick={register} disabled={loading}>
                    {loading ? <CSpinner size="sm" color="light" /> : t('Create Account')}
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>

            <CToaster
              push={
                toastVisible ? (
                  <CToast key={new Date().getTime()} autohide={false} visible={toastVisible} color={toastColor}>
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
