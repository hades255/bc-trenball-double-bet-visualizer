import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Container from "./components/Container";
import Trenball from "./components/Trenball";
import Limbo from "./components/Limbo";

const App = () => {
  return (
    <Container>
      <Router>
        <Routes>
          <Route path="/trenball" element={<Trenball />} />
          <Route path="/limbo" element={<Limbo />} />
        </Routes>
      </Router>
    </Container>
  );
};

export default App;
