import { confetti } from "tsparticles-confetti";
import { tsParticles } from "tsparticles-engine";
import { loadConfettiPreset } from "tsparticles-preset-confetti";
import { wait } from "@hapi/hoek";

export default function useConfetti() {
  const triggerConfetti = async () => {
    loadConfettiPreset(tsParticles);
    confetti("tsparticles", {
      count: 300,
      position: {
        x: 100,
        y: 50,
      },
      angle: 120,
      spread: 60,
      startVelocity: 100,
      drift: 0.1,
      ticks: 200,
      colors: ["#FF3058"],
      shapes: ["square", "circle", "triangle"],
      scalar: 2,
      zIndex: 100,
      disableForReducedMotion: false,
    });

    await wait(500);

    confetti("tsparticles", {
      count: 300,
      position: {
        x: 0,
        y: 50,
      },
      angle: 60,
      spread: 40,
      startVelocity: 100,
      drift: 0.1,
      ticks: 200,
      colors: ["#008AFF"],
      shapes: ["square", "circle", "triangle"],
      scalar: 2,
      zIndex: 100,
      disableForReducedMotion: false,
    });

    await wait(500);

    confetti("tsparticles", {
      count: 300,
      position: {
        x: 50,
        y: 100,
      },
      angle: 90,
      spread: 90,
      startVelocity: 100,
      drift: 0.1,
      gravity: 2,
      ticks: 150,
      colors: ["#008AFF", "#FF3058", "#FFEC80"],
      shapes: ["square", "image"],
      shapeOptions: {
        image: [
          {
            src: "https://beta.danielsaisani.com/static/favicon.ico",
          },
        ],
      },
      scalar: 3,
      zIndex: 100,
      disableForReducedMotion: false,
    });
  };

  return triggerConfetti;
}
