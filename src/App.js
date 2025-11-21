// import React from "react";
import Container from "./components/Container";
import Trenball from "./pages/Trenball";
import Limbo from "./pages/Limbo";
import Navbar from "./components/Navbar";
import { useState } from "react";

const App = () => {
  const [active, setActive] = useState("trenball");

  return (
    <Container>
      <Navbar active={active} onClick={setActive} />
      {active === "trenball" && <Trenball />}
      {active === "limbo" && <Limbo />}
    </Container>
  );
};

export default App;
