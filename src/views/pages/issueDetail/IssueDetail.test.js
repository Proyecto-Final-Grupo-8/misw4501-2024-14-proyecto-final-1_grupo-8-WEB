import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import IssueDetail from './IssueDetail';

// Mock de fetch
global.fetch = jest.fn();

const mockIssue = {
  id: '123',
  description: 'Test issue',
  status: 'Open',
  source: 'Web',
  customer: 'Customer A',
};

const mockIssuesList = [
  { id: '123', description: 'Test issue' },
  { id: '456', description: 'Another issue' },
];

const mockLogs = [
  {
    id: 'log1',
    created_date: '2024-11-03T23:29:46Z',
    details: 'Registro Log',
    user_name: 'username2',
    user_role: 'analyst',
  },
];

beforeEach(() => {
  fetch.mockClear();
});

describe('IssueDetail Component', () => {
  it('renders issue details after fetch', async () => {
    // Configurar mocks de fetch para la lista de issues, detalles del issue y logs
    fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockIssuesList),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockIssue),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockLogs),
        })
      );

    await act(async () => {
      render(
        <BrowserRouter>
          <IssueDetail />
        </BrowserRouter>
      );
    });

    // Verificar que al menos uno de los elementos con el texto se encuentra en el documento
    await waitFor(() => {
      const elements = screen.getAllByText(/Test issue/i);
      expect(elements.length).toBeGreaterThan(0); // Verifica que hay múltiples elementos con el texto
    });
  });
});
