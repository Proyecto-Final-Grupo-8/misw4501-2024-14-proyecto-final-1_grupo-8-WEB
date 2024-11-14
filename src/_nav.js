import React from 'react';
import CIcon from '@coreui/icons-react';
import { useTranslation } from 'react-i18next';
import { cilUserPlus, cilMobile } from '@coreui/icons';
import { CNavItem, CNavTitle } from '@coreui/react';

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
  },
  {
    component: CNavTitle,
    name: 'Gestion',
  },
  {
    component: CNavItem,
    name: 'Crear Usuario',
    to: '/register',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Tableros',
    to: '/',
    icon: <CIcon icon={cilMobile} customClassName="nav-icon" />
  }
];

export default _nav;
