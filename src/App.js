import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Container from "./components/Container";
import Trenball from "./pages/Trenball";
import Limbo from "./pages/Limbo";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <Container>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trenball" element={<Trenball />} />
          <Route path="/limbo" element={<Limbo />} />
        </Routes>
      </Router>
    </Container>
  );
};

export default App;
