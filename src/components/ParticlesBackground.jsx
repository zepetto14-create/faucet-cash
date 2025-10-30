import React from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesBackground() {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const handleClickSound = () => {
    const clickSound = new Audio("https://www.soundjay.com/button/beep-10.mp3");
    clickSound.volume = 0.4;
    clickSound.play();
  };

  return (
    <div className="absolute inset-0 -z-10" onClick={handleClickSound}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: { value: "transparent" },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: ["push", "bubble"] },
              resize: true,
            },
            modes: {
              repulse: { distance: 100, duration: 0.4 },
              push: { quantity: 5 },
              bubble: {
                distance: 200,
                size: 6,
                duration: 1,
                opacity: 0.8,
              },
            },
          },
          particles: {
            color: { value: ["#ffffff", "#00ffff", "#00ff88"] },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: "bounce",
              speed: 1,
            },
            number: {
              density: { enable: true, area: 800 },
              value: 60,
            },
            opacity: { value: 0.4 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 4 } },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
}
