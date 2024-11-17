import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CRow,
  CCol,
  CWidgetStatsA,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react';
import { CChartLine, CChartBar } from '@coreui/react-chartjs';
import { cilArrowTop } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const apiUrl = 'https://backend-781163639586.us-central1.run.app/api/';

const fetchGraphqlData = async () => {
  const query = `
    query MyQuery {
      companies {
        id
        name
        users {
          id
        }
      }
      incidents {
        id
        customer {
          id
        }
        logs {
          id
        }
      }
      users {
        id
      }
    }
  `;

  const response = await fetch(`${apiUrl}graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL error: ${response.status}`);
  }

  const { data } = await response.json();
  return data;
};

const DashboardAccess = () => {
  const { t } = useTranslation();
  const [data, setData] = useState({
    companies: [],
    incidents: [],
    users: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchGraphqlData();
        setData(result);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchData();
  }, []);

  // Cálculos de métricas clave
  const totalCompanies = data.companies.length;
  const totalUsers = data.users.length;
  const totalIncidents = data.incidents.length;
  const totalLogs = data.incidents.reduce(
    (sum, incident) => sum + incident.logs.length,
    0
  );

  // Datos para el Tablero 2: Actividad por Empresa
  const activityByCompany = {
    labels: data.companies.map((company) => company.name),
    datasets: [
      {
        label: 'Usuarios',
        backgroundColor: '#36A2EB',
        data: data.companies.map((company) => company.users.length),
      },
      {
        label: 'Incidentes',
        backgroundColor: '#FF6384',
        data: data.companies.map((company) =>
          data.incidents.filter((incident) =>
            company.users.some((user) => user.id === incident.customer?.id)
          ).length
        ),
      },
    ],
  };

  return (
    <>
      <h1>Tableros de Control</h1>

      {/* Tablero 1: Resumen General */}
      <CCard className="mb-4">
        <CCardHeader>
          <b>Resumen General</b>
        </CCardHeader>
        <CCardBody>
          <CRow>
            {/* Total de Empresas */}
            <CCol sm={6} lg={3}>
              <CWidgetStatsA
                color="primary"
                value={`${totalCompanies}`}
                title={t('Compañias Totales')}
                chart={
                  <CChartLine
                    style={{ height: '70px' }}
                    data={{
                      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                      datasets: [
                        {
                          label: 'Activity',
                          backgroundColor: 'transparent',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: [10, 15, 9, 20, 14, 12, 17],
                        },
                      ],
                    }}
                    options={{
                      plugins: { legend: { display: false } },
                      maintainAspectRatio: false,
                      scales: {
                        x: { display: false },
                        y: { display: false },
                      },
                    }}
                  />
                }
              />
            </CCol>

            {/* Total de Usuarios */}
            <CCol sm={6} lg={3}>
              <CWidgetStatsA
                color="info"
                value={`${totalUsers}`}
                title={t('Usuarios Totales')}
                chart={
                  <CChartLine
                    style={{ height: '70px' }}
                    data={{
                      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                      datasets: [
                        {
                          label: 'Activity',
                          backgroundColor: 'transparent',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: [5, 10, 8, 12, 14, 15, 20],
                        },
                      ],
                    }}
                    options={{
                      plugins: { legend: { display: false } },
                      maintainAspectRatio: false,
                      scales: {
                        x: { display: false },
                        y: { display: false },
                      },
                    }}
                  />
                }
              />
            </CCol>

            {/* Total de Incidentes */}
            <CCol sm={6} lg={3}>
              <CWidgetStatsA
                color="warning"
                value={`${totalIncidents}`}
                title={t('Incidentes Totales')}
                chart={
                  <CChartLine
                    style={{ height: '70px' }}
                    data={{
                      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                      datasets: [
                        {
                          label: 'Activity',
                          backgroundColor: 'transparent',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: [7, 12, 15, 9, 10, 13, 11],
                        },
                      ],
                    }}
                    options={{
                      plugins: { legend: { display: false } },
                      maintainAspectRatio: false,
                      scales: {
                        x: { display: false },
                        y: { display: false },
                      },
                    }}
                  />
                }
              />
            </CCol>

            {/* Total de Logs */}
            <CCol sm={6} lg={3}>
              <CWidgetStatsA
                color="danger"
                value={`${totalLogs}`}
                title={t('Logs Totales')}
                chart={
                  <CChartLine
                    style={{ height: '70px' }}
                    data={{
                      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                      datasets: [
                        {
                          label: 'Activity',
                          backgroundColor: 'transparent',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: [4, 9, 7, 12, 10, 8, 15],
                        },
                      ],
                    }}
                    options={{
                      plugins: { legend: { display: false } },
                      maintainAspectRatio: false,
                      scales: {
                        x: { display: false },
                        y: { display: false },
                      },
                    }}
                  />
                }
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Tablero 2: Actividad por Empresa */}
      <CCard className="mb-4">
        <CCardHeader>
          <b>Actividad por Empresa</b>
        </CCardHeader>
        <CCardBody>
          <CChartBar
            data={activityByCompany}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Empresas',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Cantidad',
                  },
                  beginAtZero: true,
                },
              },
            }}
          />
        </CCardBody>
      </CCard>
    </>
  );
};

export default DashboardAccess;
