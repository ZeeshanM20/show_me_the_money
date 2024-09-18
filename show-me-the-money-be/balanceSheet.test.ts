import request from 'supertest';
import { app } from './index'; // Adjust the path if necessary
import axios from 'axios';
import { mockData } from './mocks/mockData';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GET /api/balance-sheet', () => {
  it('should return balance sheet data when the request is successful', async () => {
    // Mock the axios response
    mockedAxios.get.mockResolvedValueOnce({
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        url: ''
      }
    });

    const response = await request(app).get('/api/balance-sheet');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData); 

    // Additional checks on the response body
    expect(response.body.Reports).toBeDefined();
    expect(response.body.Reports[0].Rows).toBeDefined();
    expect(response.body.Reports[0].Rows.some((row: { RowType: string; Cells: any[]; }) => row.RowType === 'Header' && row.Cells.some(cell => cell.Value === '18 September 2024'))).toBe(true);
    expect(response.body.Reports[0].Rows.some((row: { RowType: string; Title: string; }) => row.RowType === 'Section' && row.Title === 'Assets')).toBe(true);
  });

  it('should return 500 error when there is an error fetching data', async () => {
    // Mock axios to throw an error
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    const response = await request(app).get('/api/balance-sheet');

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error fetching Balance Sheet data');
  });
});