import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Container, Spinner, Alert, Card, Table, Badge } from "react-bootstrap";

const Backtesting = () => {
  const [backtestingResults, setBacktestingResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBacktestingData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/backtesting/");
        setBacktestingResults(response.data.backtesting_results || []);
      } catch (error) {
        console.error("Error fetching backtesting data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBacktestingData();
  }, []);

  // Format data for the chart
  const getChartData = () => {
    let combinedData = [];
    backtestingResults.forEach(({ stock, historical_data }) => {
      historical_data.forEach(({ date, price }) => {
        combinedData.push({ date, stock, price });
      });
    });
    return combinedData;
  };

  // Define colors for different stocks
  const stockColors = {
    AAPL: "#8884d8",
    TSLA: "#82ca9d",
    GOOGL: "#ff7300",
    MSFT: "#ffbb28",
    AMZN: "#d884d8",
    NFLX: "#ca829d",
    NVDA: "#34c9eb",
    META: "#eb4034",
    IBM: "#0088FE",
    Default: "#000",
  };

  // Function to get a profit/loss badge
  const getProfitBadge = (profit_loss) => {
    return (
      <Badge bg={profit_loss >= 0 ? "success" : "danger"} className="px-3 py-2">
        {profit_loss >= 0 ? `📈 +${profit_loss}%` : `📉 ${profit_loss}%`}
      </Badge>
    );
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">📉 Backtesting Results</h2>

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
          <p>Fetching backtesting data...</p>
        </div>
      ) : backtestingResults.length === 0 ? (
        <Alert variant="warning" className="text-center">
          No backtesting data available.
        </Alert>
      ) : (
        <>
          {/* Backtesting Strategy Summary Table */}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">📊 Strategy Performance Summary</h5>
              <Table striped bordered hover responsive>
                <thead className="table-dark">
                  <tr>
                    <th>📌 Strategy</th>
                    <th>📉 Stock</th>
                    <th>📊 Profit/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {backtestingResults.map(({ strategy, stock, profit_loss }) => (
                    <tr key={stock}>
                      <td>{strategy}</td>
                      <td className="fw-bold">{stock}</td>
                      <td>{getProfitBadge(profit_loss)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Line Chart for Historical Data */}
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">📈 Price Movement Over Time</h5>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={getChartData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {backtestingResults.map(({ stock }) => (
                    <Line
                      key={stock}
                      type="monotone"
                      dataKey="price"
                      stroke={stockColors[stock] || stockColors.Default}
                      name={stock}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default Backtesting;
