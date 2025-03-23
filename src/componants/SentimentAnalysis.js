import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Container, Spinner, Badge, Card } from "react-bootstrap";
import { ArrowUpCircle, ArrowDownCircle, DashCircle } from "react-bootstrap-icons";

const SentimentAnalysis = () => {
  const [sentiments, setSentiments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSentiments = async () => {
      try {
        const response = await axios.get("https://stocks-back-end.onrender.com/api/sentiments/");
        console.log(response.data)
        setSentiments(response.data.sentiments || []);
      } catch (error) {
        console.error("Error fetching sentiments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSentiments();
  }, []);

  const getSentimentBadge = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return (
          <Badge bg="success" className="px-3 py-2">
            <ArrowUpCircle size={16} className="me-1" /> Positive
          </Badge>
        );
      case "negative":
        return (
          <Badge bg="danger" className="px-3 py-2">
            <ArrowDownCircle size={16} className="me-1" /> Negative
          </Badge>
        );
      default:
        return (
          <Badge bg="secondary" className="px-3 py-2">
            <DashCircle size={16} className="me-1" /> Neutral
          </Badge>
        );
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">📊 Stock Sentiment Analysis</h2>

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
          <p>Analyzing sentiments...</p>
        </div>
      ) : sentiments.length === 0 ? (
        <p className="text-muted text-center">No sentiment data available.</p>
      ) : (
        <Card className="shadow-sm">
          <Card.Body>
            <Table responsive hover className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th>📌 Stock Symbol</th>
                  <th>📉 Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {sentiments.map(({ stock_symbol, sentiment_score,index }) => (
                  <tr key={index} >
                    <td className="fw-bold">{stock_symbol}</td>
                    <td>{getSentimentBadge(sentiment_score)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default SentimentAnalysis;
