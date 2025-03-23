import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Container, Form, Row, Col, Spinner, InputGroup } from "react-bootstrap";
import { PlusCircle, Trash } from "react-bootstrap-icons";

const Watchlist = ({ userId }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        let response;
        if (userId) {
          response = await axios.get(`https://stocks-back-end.onrender.com/api/watchlist/${userId}/`);
          setWatchlist(response.data.watchlist || []);
        } else {
          response = await axios.get("https://stocks-back-end.onrender.com/api/watchlist/all/");
          setWatchlist(response.data.watchlist || []);
        }
      } catch (error) {
        console.error("Error fetching watchlist", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  });

  const addStock = async () => {
    if (!stock.trim()) return;
    try {
      const response = await axios.post("https://stocks-back-end.onrender.com/api/watchlist/add/", {
        user_id: userId,
        stock
      });
      setWatchlist(response.data.watchlist);
      setStock(""); 
    } catch (error) {
      console.error("Error adding stock", error);
    }
  };

  const removeStock = async (stockToRemove) => {
    try {
      const response = await axios.post("https://stocks-back-end.onrender.com/api/watchlist/remove/", {
        user_id: userId,
        stock: stockToRemove
      });
      setWatchlist(response.data.watchlist);
    } catch (error) {
      console.error("Error removing stock", error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">📈 My Watchlist</h2>

      {userId && (
        <Row className="mb-3 justify-content-center">
          <Col md={6}>
            <InputGroup>
              <Form.Control
                type="text"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Enter stock symbol (e.g., AAPL)"
              />
              <Button variant="success" onClick={addStock} disabled={!stock.trim()}>
                <PlusCircle size={20} /> Add
              </Button>
            </InputGroup>
          </Col>
        </Row>
      )}

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
          <p>Loading your watchlist...</p>
        </div>
      ) : watchlist.length > 0 ? (
        <Row className="g-3">
          {watchlist.map((item, index) => (
            <Col md={4} sm={6} xs={12} key={index}>
              <Card className="shadow-sm">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <Card.Title className="mb-0" >
                    {userId ? item : ` ${item.stocks.join(", ")}`}
                  </Card.Title>
                  {userId && (
                    <Button variant="outline-danger" size="sm" onClick={() => removeStock(item)}>
                      <Trash size={18} />
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-muted text-center">No stocks in your watchlist.</p>
      )}
    </Container>
  );
};

export default Watchlist;
