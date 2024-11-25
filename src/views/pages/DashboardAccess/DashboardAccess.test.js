import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardAccess from './DashboardAccess';

// Mock de componentes de gráficos
jest.mock('@coreui/react-chartjs', () => ({
  CChartLine: () => <div data-testid="CChartLine" />,
  CChartBar: () => <div data-testid="CChartBar" />,
  CChartPie: () => <div data-testid="CChartPie" />,
}));

// Mock básico del fetch para evitar dependencias de red
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        data: {
          companies: [{ id: '1', name: 'Company A', users: [] }],
          incidents: [
            { id: '1', status: 'Closed', createdDate: '2024-01-01T00:00:00Z', modifiedDate: '2024-01-02T12:00:00Z', logs: [] },
          ],
          users: [{ id: '1', name: 'User A', username: 'usera' }],
        },
      }),
  })
);

describe('DashboardAccess Component', () => {
  it('renders the component and displays key elements', async () => {
    render(<DashboardAccess />);

    // Verificar que se renderizan los títulos clave
    expect(screen.getByText('Tableros de Control')).toBeInTheDocument();
    expect(await screen.findByText('Compañias Totales')).toBeInTheDocument();

    // Verificar que el tiempo promedio de resolución se muestra correctamente
    expect(await screen.findByText(/Tiempo Promedio de Resolución:/)).toBeInTheDocument();
  });

  it('renders mocked charts without crashing', async () => {
    render(<DashboardAccess />);

    // Verificar que los gráficos se renderizan como mocks
    expect(screen.getAllByTestId('CChartLine').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('CChartBar').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('CChartPie').length).toBeGreaterThan(0);
  });
});
