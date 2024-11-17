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
import { CChartLine, CChartBar, CChartPie } from '@coreui/react-chartjs';

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
        status
        source
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

  // Datos para el Tablero 3: Incidentes por Estado
  const incidentsByStatus = data.incidents.reduce((acc, incident) => {
    acc[incident.status] = (acc[incident.status] || 0) + 1;
    return acc;
  }, {});

  const incidentsByStatusData = {
    labels: Object.keys(incidentsByStatus),
    datasets: [
      {
        data: Object.values(incidentsByStatus),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  const incidentSources = data.incidents && data.incidents.length > 0
    ? data.incidents.reduce((acc, incident) => {
      acc[incident.source] = (acc[incident.source] || 0) + 1;
      return acc;
    }, {})
    : {};

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

      {/* Tablero 3: Incidentes por Estado */}
      <CCard className="mb-4">
        <CCardHeader>
          <b>Incidentes por Estado</b>
        </CCardHeader>
        <CCardBody>
          <div style={{ maxWidth: '300px', margin: '0 auto' }}>
            <CChartPie
              data={incidentsByStatusData}
              options={{
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }}
            />
          </div>
        </CCardBody>
      </CCard>
      {/* Tablero 4: Logs por Incidente */}
      <CCard className="mb-4">
        <CCardHeader>
          <b>Logs por Incidente</b>
        </CCardHeader>
        <CCardBody>
          <CChartBar
            data={{
              labels: data.incidents.map((incident) => `${incident.id.slice(0, 3)}...`),
              datasets: [
                {
                  label: 'Número de Logs',
                  backgroundColor: '#007bff',
                  data: data.incidents.map((incident) => incident.logs.length),
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const incident = data.incidents[tooltipItem.dataIndex];
                      return `ID: ${incident.id} - Logs: ${incident.logs.length}`;
                    },
                  },
                },
              },
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Incidentes',
                  },
                  ticks: {
                    autoSkip: false,
                    maxRotation: 45,
                    minRotation: 0,
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Cantidad de Logs',
                  },
                  beginAtZero: true,
                },
              },
            }}
          />
        </CCardBody>
      </CCard>
      {/* Tablero 6: Origen de Incidentes */}
      <CCard className="mb-4">
        <CCardHeader>
          <b>Origen de Incidentes</b>
        </CCardHeader>
        <CCardBody>
          <div style={{ maxWidth: '300px', margin: '0 auto' }}>
            <CChartPie
              data={{
                labels: Object.keys(incidentSources),
                datasets: [
                  {
                    data: Object.values(incidentSources),
                    backgroundColor: [
                      '#FF6384', // Rojo
                      '#36A2EB', // Azul
                      '#FFCE56', // Amarillo
                      '#4BC0C0', // Verde
                      '#9966FF', // Púrpura
                    ],
                    hoverBackgroundColor: [
                      '#FF6384',
                      '#36A2EB',
                      '#FFCE56',
                      '#4BC0C0',
                      '#9966FF',
                    ],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }}
            />
          </div>
        </CCardBody>
      </CCard>
    </>
  );
};

export default DashboardAccess;
