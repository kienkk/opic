import { useEffect, useRef, useState } from "react";

const AUDIO_LIST = [
  "/audios/1.mp3",
  "/audios/2.mp3",
  "/audios/3.mp3",
  "/audios/4.mp3",
  "/audios/5.mp3",
  "/audios/6.mp3",
  "/audios/7.mp3",
  "/audios/8.mp3",
  "/audios/9.mp3",
  "/audios/10.mp3",
  "/audios/11.mp3",
  "/audios/12.mp3",
  "/audios/13.mp3",
  "/audios/14.mp3",
  "/audios/15.mp3",
  "/audios/16.mp3",
];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function getRandomTime() {
  const arr = [6, 5, 4]; // test nhanh
  return arr[Math.floor(Math.random() * arr.length)];
}

function FinishedScreen() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = [];

    class Rocket {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.vy = -(Math.random() * 6 + 7);
        this.targetY = Math.random() * canvas.height * 0.5 + 60;
        this.color = `hsl(${Math.random() * 360}, 100%, 65%)`;
        this.exploded = false;
        this.trail = [];
      }

      update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 8) this.trail.shift();
        this.y += this.vy;
        if (this.y <= this.targetY && !this.exploded) {
          this.exploded = true;
          this.burst();
        }
      }

      burst() {
        const count = 60 + Math.floor(Math.random() * 30);
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count;
          const speed = Math.random() * 4 + 1.5;
          particles.push({
            x: this.x,
            y: this.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            color: this.color,
            size: Math.random() * 2.5 + 1,
          });
        }
      }

      draw() {
        // trail
        this.trail.forEach((p, i) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,220,100,${(i / this.trail.length) * 0.5})`;
          ctx.fill();
        });
        // rocket dot
        if (!this.exploded) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        }
      }
    }

    const rockets = [];
    let lastLaunch = 0;

    const loop = (ts) => {
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // launch new rocket every ~700ms
      if (ts - lastLaunch > 700) {
        rockets.push(new Rocket());
        lastLaunch = ts;
      }

      // update & draw rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        rockets[i].update();
        rockets[i].draw();
        if (rockets[i].exploded && rockets[i].y < -20) rockets.splice(i, 1);
      }

      // update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.07; // gravity
        p.alpha -= 0.018;
        p.vx *= 0.98;
        p.vy *= 0.98;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(")", `, ${p.alpha})`).replace("hsl", "hsla");
        ctx.fill();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", background: "#000", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100%", flexDirection: "column", gap: 12,
      }}>
        <h1 style={{
          color: "#fff", textAlign: "center", fontSize: "clamp(20px, 5vw, 32px)",
          fontWeight: "bold", textShadow: "0 0 20px rgba(255,220,100,0.8)",
          padding: "0 20px", margin: 0,
        }}>
          🎉 Congratulations!<br />You Have Completed The Test 🎉
        </h1>
      </div>
    </div>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [list, setList] = useState([]);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState("idle");
  const [time, setTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const [canNext, setCanNext] = useState(false);
  const [finished, setFinished] = useState(false);
  const [uploading, setUploading] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const recordingsRef = useRef([]);

  const audioCacheRef = useRef({});
  const audioRef = useRef(null);

  const fallbackNext = () => {
    setMode("idle");
    setCanNext(true);
  };

  // 🎧 preload audio
  useEffect(() => {
    if (list.length === 0) return;

    console.log("Preloading audio...");

    list.forEach((src) => {
      const audio = new Audio();
      audio.src = src;
      audio.preload = "auto";

      audioCacheRef.current[src] = audio;
    });
  }, [list]);

  // cleanup
  useEffect(() => {
    return () => {
      Object.values(audioCacheRef.current).forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
    };
  }, []);

  const startTest = () => {
    const random15 = shuffle(AUDIO_LIST).slice(0, 15);
    setList(random15);
    setStarted(true);
    setIndex(0);

    setTimeout(() => playAudio(random15[0]), 300);
  };

  const playAudio = (src) => {
    console.log("PLAY:", index);

    setMode("playing");
    setCanNext(false);

    const audio = audioCacheRef.current[src];

    if (!audio) {
      fallbackNext();
      return;
    }

    audioRef.current = audio;

    audio.pause();
    audio.currentTime = 0;

    let started = false;

    const tryPlay = () => {
      audio.play().then(() => {
        started = true;
      }).catch(() => {
        fallbackNext();
      });
    };

    if (audio.readyState >= 3) {
      tryPlay();
    } else {
      audio.oncanplaythrough = tryPlay;
    }

    audio.onended = () => {
      setTimeout(() => startRecording(), 800);
    };

    audio.onerror = () => {
      fallbackNext();
    };

    setTimeout(() => {
      if (!started) {
        fallbackNext();
      }
    }, 4000);
  };

  const startRecording = async () => {
    console.log("RECORD START");

    try {
      const duration = getRandomTime();

      setMaxTime(duration);
      setTime(duration);
      setMode("recording");
      setCanNext(false);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      let stopped = false;

      mediaRecorder.onstop = () => {
        if (stopped) return;
        stopped = true;

        console.log("RECORD STOP");

        const blob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });

        recordingsRef.current.push(blob);

        setUploading(true);

        setTimeout(() => {
          console.log("UPLOAD DONE");
          setUploading(false);
          setCanNext(true);
        }, 3000);

        mediaRecorder.stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();

      let t = duration;

const interval = setInterval(() => {
  t--;

  if (t <= 0) {
    t = 0;
    setTime(0); // 🔥 đảm bảo về 0 trước
    clearInterval(interval);

    setTimeout(() => {
      mediaRecorder.stop(); // 👉 stop sau 1 tick
    }, 100);

  } else {
    setTime(t);
  }
}, 1000);

      setTimeout(() => {
        if (!stopped) {
          mediaRecorder.stop();
        }
      }, (duration + 5) * 1000);

    } catch (err) {
      console.error(err);
      fallbackNext();
    }
  };

  const handleNext = () => {
    if (!canNext) return;

    if (index + 1 >= list.length) {
      setFinished(true);
      return;
    }

    const nextIndex = index + 1;
    setIndex(nextIndex);

    audioRef.current?.pause();

    setTimeout(() => {
      playAudio(list[nextIndex]);
    }, 300);
  };

  if (!started) {
    return (
      <div className="container">
        <button className="start-btn" onClick={startTest}>
          START TEST
        </button>
      </div>
    );
  }

  if (finished) {
    return <FinishedScreen />;
  }

  const progress = (time / maxTime) * 100;

  return (
    <div className="container">
      <div className="steps">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className={`step ${i === index ? "active" : ""}`}>
            {i + 1}
          </div>
        ))}
      </div>

      <div className="image-box">
        <img src="/image.jpg" alt="" />
      </div>

      <div className="timer-bar">
        <div
          className="timer-fill"
          style={{
            width: mode === "recording" ? `${(time / maxTime) * 100}%` : "0%",
            transition: mode === "recording" && time > 0 ? "width 1s linear" : "none",
          }}
        />
      </div>

      <div className="timer-display">
        {mode === "recording" ? formatTime(time) : ""}
      </div>

      <button
        className={`next-btn ${canNext ? "active" : "disabled"}`}
        onClick={handleNext}
      >
        NEXT
      </button>

      <div className="status">
        {mode === "playing" && "Listening..."}
        {mode === "recording" && "Recording..."}
      </div>

      {uploading && (
        <div className="overlay">
          <div className="spinner"></div>
          <p>Uploading Audio...</p>
        </div>
      )}
    </div>
  );
}
