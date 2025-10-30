import React from "react";
import Faucet from "./components/Faucet";
import ParticlesBackground from "./components/ParticlesBackground";
import "./index.css";

function App() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <ParticlesBackground />
      <Faucet />
    </div>
  );
}

export default App;
