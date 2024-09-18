import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import axios from 'axios';
import { BalanceSheetReport } from './types';
import { mockData } from './mocks/mockData';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', () => {
    // Mock axios to return a promise that never resolves
    mockedAxios.get.mockReturnValueOnce(new Promise(() => {}) as Promise<any>);

    render(<App />);

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test('renders error state', async () => {
    // Mock axios to return an error
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    render(<App />);

    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
  });

  test('renders report data correctly', async () => {
    // Mock Axios response to return mockData with the full structure
    mockedAxios.get.mockResolvedValueOnce({
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        url: ''
      }
    });

    render(<App />);

    // Check for Date and Section titles
    expect(await screen.findByText('Date: 18 September 2024')).toBeInTheDocument();
    expect(screen.getByText('Assets')).toBeInTheDocument();
    expect(screen.getByText('Bank')).toBeInTheDocument();
    expect(screen.getByText('Current Assets')).toBeInTheDocument();
    expect(screen.getByText('Fixed Assets')).toBeInTheDocument();
    expect(screen.getAllByText('Non-current Assets').length).toBeGreaterThan(0);
    expect(screen.getByText('Liabilities')).toBeInTheDocument();
    expect(screen.getByText('Current Liabilities')).toBeInTheDocument();
    expect(screen.getAllByText('Non-Current Liabilities').length).toBeGreaterThan(0);
    expect(screen.getByText('Equity')).toBeInTheDocument();
  });

  test('renders no data available message when there is no data', async () => {
    // Mock axios to return empty data
    const mockEmptyData: BalanceSheetReport = {
      Status: 'OK',
      Reports: []
    };

    mockedAxios.get.mockResolvedValueOnce({
      data: mockEmptyData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        url: ''
      }
    });

    render(<App />);

    // Check for "No data available" message
    expect(await screen.findByText(/No reports available/i)).toBeInTheDocument();
  });
});