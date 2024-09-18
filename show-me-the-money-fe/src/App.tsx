import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BalanceSheetReport, Report } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get<BalanceSheetReport>('http://localhost:3002/api/balance-sheet');
        if (result.data.Reports && result.data.Reports.length > 0) {
          setData(result.data.Reports[0]);
        } else {
          setError('No reports available');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error fetching balance sheet data');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center text-blue-600 text-lg font-medium">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 text-lg font-medium">{error}</p>;
  }

  // Extract header dates and skip the first empty value
  const headerDates = (data?.Rows.find(row => row.RowType === 'Header')?.Cells?.map(cell => cell.Value) || []).slice(1);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Balance Sheet Report</h1>

      {data ? (
        <>
          <p className="text-sm text-gray-400 mb-6 text-center">Date: {data.ReportDate}</p>

          {headerDates.length > 0 && (
            <div className="overflow-x-auto mb-8">
              {data.Rows.reduce((sections, row) => {
                if (row.RowType === 'Section') {
                  // If section title is empty, use the title of the last section
                  const sectionTitle = row.Title || (sections.length > 0 ? sections[sections.length - 1].title : '');
                  sections.push({
                    title: sectionTitle,
                    rows: row.Rows || []
                  });
                } else if (sections.length > 0) {
                  sections[sections.length - 1].rows.push(row);
                }
                return sections;
              }, [] as { title: string, rows: typeof data.Rows }[]) 
              .map((section, sectionIndex) => (
                <div key={sectionIndex} className="bg-white p-6 mb-8 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">{section.title}</h2>
                  
                  {section.rows.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                        <thead>
                          <tr className="bg-blue-100">
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                              Description
                            </th>
                            {headerDates.map((date, index) => (
                              <th
                                key={index}
                                className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200"
                              >
                                {date}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.rows.map((row, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className={`${
                                row.RowType === 'SummaryRow'
                                  ? 'font-bold'
                                  : rowIndex % 2 === 0
                                  ? 'bg-gray-50'
                                  : 'bg-white'
                              } hover:bg-gray-100 transition duration-150 ease-in-out`}
                            >
                              {row.Cells?.map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="px-6 py-4 text-sm text-gray-600 border-b border-gray-200"
                                >
                                  {cell.Value}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 text-lg">No data available for this section</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500 text-lg">No data available</p>
      )}
    </div>
  );
};

export default App;