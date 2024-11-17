import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  CRow,
  CCol,
  CWidgetStatsA,
} from '@coreui/react';
import { getStyle } from '@coreui/utils';
import { CChartLine } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop } from '@coreui/icons';

const apiUrl = 'https://backend-781163639586.us-central1.run.app/api/';

const fetchGraphqlData = async () => {
  const query = `
    query MyQuery {
      companies {
        id
      }
      incidents {
        id
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

const WidgetsDropdown = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const widgetChartRef1 = useRef(null);
  const widgetChartRef2 = useRef(null);

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

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary');
          widgetChartRef1.current.update();
        });
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info');
          widgetChartRef2.current.update();
        });
      }
    });
  }, [widgetChartRef1, widgetChartRef2]);

  const totalLogs = data.incidents.reduce((sum, incident) => sum + incident.logs.length, 0);

  const handleNavigate = () => {
    navigate('/control');
  };

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={3}>
        <CWidgetStatsA
          color="primary"
          value={data.users.length}
          title={t('Usuarios Totales')}
          onClick={handleNavigate} // Redirección al hacer clic
          chart={
            <CChartLine
              ref={widgetChartRef1}
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'Dataset 1',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-primary'),
                    data: [65, 59, 84, 84, 51, 55, 40],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 30,
                    max: 89,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>

      <CCol sm={6} xl={3}>
        <CWidgetStatsA
          color="info"
          value={data.incidents.length}
          title={t('Incidentes Totales')}
          onClick={handleNavigate} // Redirección al hacer clic
          chart={
            <CChartLine
              ref={widgetChartRef2}
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'Dataset 2',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-info'),
                    data: [1, 18, 9, 17, 34, 22, 11],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: -9,
                    max: 39,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>

      <CCol sm={6} xl={3}>
        <CWidgetStatsA
          color="warning"
          value={data.companies.length}
          title={t('Compañias Totales')}
          onClick={handleNavigate} // Redirección al hacer clic
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'Dataset 3',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40],
                    fill: true,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>

      <CCol sm={6} xl={3}>
        <CWidgetStatsA
          color="danger"
          value={totalLogs}
          title={t('Logs Totales')}
          onClick={handleNavigate} // Redirección al hacer clic
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'Dataset 4',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [45, 65, 55, 70, 50, 40, 60],
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                  },
                },
              }}
            />
          }
        />
      </CCol>
    </CRow>
  );
};

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
};

export default WidgetsDropdown;
