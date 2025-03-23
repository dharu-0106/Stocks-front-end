import React from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import SentimentAnalysis from "./componants/SentimentAnalysis";
import Backtesting from "./componants/Backtesting";
import Watchlist from "./componants/Watchlist";

function App() {
  return (
    <Container>
      <h1 className="text-center my-4">📊 Stock Market Dashboard</h1>
      <Watchlist  />
      <SentimentAnalysis/>
      <Backtesting/>
    </Container>
  );
}

export default App;
