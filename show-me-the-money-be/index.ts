import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 3002;

app.use(cors({
  origin: 'http://localhost:3001' 
}));

app.get('/api/balance-sheet', async (req, res) => {
  try {
    // const response = await axios.get('http://localhost:3000/api.xro/2.0/Reports/BalanceSheet');
    const response = await axios.get('http://xero-api:3000/api.xro/2.0/Reports/BalanceSheet');
    res.json(response.data);
  } catch (error) {
    console.log(error)
    res.status(500).send('Error fetching Balance Sheet data');
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export { app };