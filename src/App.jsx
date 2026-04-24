import { useEffect, useRef, useState } from "react";

const FOLDER_MAP = {
  "Appointment": [
    "/audios/Appointment/30_Q2 - A.mp3",
    "/audios/Appointment/30_Q3 - B.mp3",
    "/audios/Appointment/30_Q4 - C.mp3",
  ],
  "Bank": [
    "/audios/Bank/28_Q1 - A.mp3",
    "/audios/Bank/28_Q3 - B.mp3",
    "/audios/Bank/28_Q4 - C.mp3",
  ],
  "Clothes": [
    "/audios/Clothes/22_Q1 - A.mp3",
    "/audios/Clothes/22_Q2 - B.mp3",
    "/audios/Clothes/22_Q5 - C.mp3",
  ],
  "Family": [
    "/audios/Family/24_Q1 - A.mp3",
    "/audios/Family/24_Q1 - B.mp3",
    "/audios/Family/24_Q4 - C.mp3",
  ],
  "Food": [
    "/audios/Food/12_Q1 - A.mp3",
    "/audios/Food/12_Q1 - B.mp3",
    "/audios/Food/12_Q5 - C.mp3",
  ],
  "Food2": [
    "/audios/Food2/13_Q2 - A.mp3",
    "/audios/Food2/13_Q3 - B.mp3",
    "/audios/Food2/13_Q5 - C.mp3",
  ],
  "Furniture": [
    "/audios/Furniture/10_Q1 - A.mp3",
    "/audios/Furniture/10_Q3 - B.mp3",
    "/audios/Furniture/10_Q4 - C.mp3",
  ],
  "Geography": [
    "/audios/Geography/19_Q1 - A.mp3",
    "/audios/Geography/19_Q4 - B.mp3",
    "/audios/Geography/19_Q4 - C.mp3",
  ],
  "Holiday": [
    "/audios/Holiday/23_Q1 - A.mp3",
    "/audios/Holiday/23_Q1 - B.mp3",
    "/audios/Holiday/23_Q2 - C.mp3",
  ],
  "Hotel": [
    "/audios/Hotel/29_Q2 - A.mp3",
    "/audios/Hotel/29_Q3 - B.mp3",
    "/audios/Hotel/29_Q4 - C.mp3",
  ],
  "House": [
    "/audios/House/08_Q1 - A.mp3",
    "/audios/House/08_Q4 - B.mp3",
    "/audios/House/08_Q5 - C.mp3",
  ],
  "Movie": [
    "/audios/Movie/06_Q1 - A.mp3",
    "/audios/Movie/06_Q2 - B.mp3",
    "/audios/Movie/06_Q3 - C.mp3",
  ],
  "Music": [
    "/audios/Music/05_Q1 - A.mp3",
    "/audios/Music/05_Q3 - B.mp3",
    "/audios/Music/05_Q4 - C.mp3",
  ],
  "Park": [
    "/audios/Park/20_Q1 - A.mp3",
    "/audios/Park/20_Q3 - B.mp3",
    "/audios/Park/20_Q4 - C.mp3",
  ],
  "Recycling": [
    "/audios/Recycling/10_Q5 - A.mp3",
    "/audios/Recycling/10_Q6 - B.mp3",
    "/audios/Recycling/10_Q7 - C.mp3",
  ],
  "Restaurant": [
    "/audios/Restaurant/14_Q1 - A.mp3",
    "/audios/Restaurant/14_Q2 - B.mp3",
    "/audios/Restaurant/14_Q6 - C.mp3",
  ],
  "Role Play Another Country": [
    "/audios/Role Play Another Country/33_Q12 - A.mp3",
    "/audios/Role Play Another Country/33_Q13 - B.mp3",
    "/audios/Role Play Another Country/33_Q14 - C.mp3",
  ],
  "Role Play Appointment": [
    "/audios/Role Play Appointment/39_Q4 - A.mp3",
    "/audios/Role Play Appointment/39_Q5 - B.mp3",
    "/audios/Role Play Appointment/39_Q6 - C.mp3",
  ],
  "Role Play Birthday Party": [
    "/audios/Role Play Birthday Party/40_Q8 - A.mp3",
    "/audios/Role Play Birthday Party/40_Q9 - B.mp3",
    "/audios/Role Play Birthday Party/40_Q10 - C.mp3",
  ],
  "Role Play Cell Phone": [
    "/audios/Role Play Cell Phone/35_Q1 - A.mp3",
    "/audios/Role Play Cell Phone/35_Q2 - B.mp3",
    "/audios/Role Play Cell Phone/35_Q3 - C.mp3",
  ],
  "Role Play Clothes": [
    "/audios/Role Play Clothes/32_Q1 - A.mp3",
    "/audios/Role Play Clothes/32_Q2 - B.mp3",
    "/audios/Role Play Clothes/32_Q3 - C.mp3",
  ],
  "Role Play House": [
    "/audios/Role Play House/36_Q4 - A.mp3",
    "/audios/Role Play House/36_Q5 - B.mp3",
    "/audios/Role Play House/36_Q6 - C.mp3",
  ],
  "Role Play MP3": [
    "/audios/Role Play MP3/38_Q1 - A.mp3",
    "/audios/Role Play MP3/38_Q2 - B.mp3",
    "/audios/Role Play MP3/38_Q3 - C.mp3",
  ],
  "Role Play Park": [
    "/audios/Role Play Park/40_Q1 - A.mp3",
    "/audios/Role Play Park/40_Q2 - B.mp3",
    "/audios/Role Play Park/40_Q3 - C.mp3",
  ],
  "Role Play Take Care Home": [
    "/audios/Role Play Take Care Home/38_Q7 - A.mp3",
    "/audios/Role Play Take Care Home/38_Q8 - B.mp3",
    "/audios/Role Play Take Care Home/38_Q9 - C.mp3",
  ],
  "Role Play Travelling": [
    "/audios/Role Play Travelling/33_Q1 - A.mp3",
    "/audios/Role Play Travelling/33_Q2 - B.mp3",
  ],
  "Vacation": [
    "/audios/Vacation/17_Q1 - A.mp3",
    "/audios/Vacation/17_Q3 - B.mp3",
    "/audios/Vacation/17_Q4 - C.mp3",
  ],
  "Weather": [
    "/audios/Weather/26_Q1 - A.mp3",
    "/audios/Weather/26_Q2 - B.mp3",
    "/audios/Weather/26_Q3 - C.mp3",
  ],
};

function pickAudios(folderMap) {
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const folders = Object.keys(folderMap);

  const rolePlay = folders.filter(f => f.includes("Role Play"));
  const normal = folders.filter(f => !f.includes("Role Play"));

  // chọn role play ≤ 2
  const selectedRolePlay = shuffle(rolePlay).slice(0, Math.min(2, rolePlay.length));

  // tổng folder = 6 hoặc 7
  const targetFolderCount = 6 + Math.floor(Math.random() * 2);

  const remainingNeeded = targetFolderCount - selectedRolePlay.length;
  const selectedNormal = shuffle(normal).slice(0, remainingNeeded);

   const selectedFolders = shuffle([
     ...selectedRolePlay,
     ...selectedNormal
   ]);

  // ===== pick file =====
  let result = [];
  let remaining = 15;
  let remainingFolders = selectedFolders.length;

  for (let i = 0; i < selectedFolders.length; i++) {
    const folder = selectedFolders[i];
    const files = folderMap[folder];

    let take;

    if (remainingFolders === 1) {
      take = remaining;
    } else {
      const minTake = 2;
      const maxTake = Math.min(3, remaining - (remainingFolders - 1) * 2);

      take = minTake + Math.floor(Math.random() * (maxTake - minTake + 1));
    }

    // ⚠️ tránh lấy quá số file có sẵn
    take = Math.min(take, files.length);

    // ⚠️ lấy theo thứ tự
    const picked = files.slice(0, take);

    result.push(...picked);

    remaining -= take;
    remainingFolders--;
  }

  return result;
}

function getDurationFromFileName(src) {
  const match = src.match(/- ?([ABC])/);

  if (!match) return 60;

  const type = match[1];

  if (type === "A") return 60;
  if (type === "B") return 90;
  if (type === "C") return 120;

  return 60;
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function getRandomTime() {
  const arr = [6, 5, 4];
  return arr[Math.floor(Math.random() * arr.length)];
}

function FinishedScreen({ recordings }) {
  const canvasRef = useRef(null);

  const handleDownload = async () => {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    recordings.forEach((blob, i) => {
      const name = `${String(i + 1).padStart(2, "0")}.webm`;
      zip.file(name, blob);
    });

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recordings.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

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
        this.trail.forEach((p, i) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,220,100,${(i / this.trail.length) * 0.5})`;
          ctx.fill();
        });
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

      if (ts - lastLaunch > 700) {
        rockets.push(new Rocket());
        lastLaunch = ts;
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        rockets[i].update();
        rockets[i].draw();
        if (rockets[i].exploded && rockets[i].y < -20) rockets.splice(i, 1);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.07;
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
          🎉 Congratulations!<br />You Have Completed The Test! 🎉
        </h1>
        <button
          onClick={handleDownload}
          style={{
            marginTop: 16,
            padding: "12px 28px",
            fontSize: 16,
            fontWeight: "bold",
            background: "#00c853",
            color: "white",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          ⬇️ Download Recordings
        </button>
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
const [showReplay, setShowReplay] = useState(false);

  const mediaRecorderRef = useRef(null);
const chunksRef = useRef([]);
const recordingsRef = useRef([]);

const audioCacheRef = useRef({});
const audioRef = useRef(null);
const timerIntervalRef = useRef(null);
const pendingNextRef = useRef(false);
const replayTimeoutRef = useRef(null);
const currentSrcRef = useRef(null);
const listRef = useRef([]);

  const fallbackNext = () => {
    setMode("idle");
    setCanNext(true);
  };

  useEffect(() => {
    if (list.length === 0) return;
    list.forEach((src) => {
      const audio = new Audio();
      audio.src = src;
      audio.preload = "auto";
      audioCacheRef.current[src] = audio;
    });
  }, [list]);

  useEffect(() => {
    return () => {
      Object.values(audioCacheRef.current).forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
    };
  }, []);

  const startTest = () => {
    const picked = pickAudios(FOLDER_MAP);
    listRef.current = picked;
    setList(picked);
    setStarted(true);
    setIndex(0);
    setTimeout(() => playAudio(picked[0]), 300);
  };

  const playAudio = (src, isReplay = false) => {
    setMode("playing");
    setCanNext(false);
    setShowReplay(false);
    currentSrcRef.current = src;

    // Clear timeout replay phòng trường hợp còn sót
    if (replayTimeoutRef.current) {
      clearTimeout(replayTimeoutRef.current);
      replayTimeoutRef.current = null;
    }

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
      if (isReplay) {
        // Lần phát lại: đi thẳng vào recording, không hiện nút nữa
        setTimeout(() => startRecording(src), 800);
      } else {
        // Lần phát đầu tiên: hiện nút replay, chờ 3 giây
        setShowReplay(true);
        replayTimeoutRef.current = setTimeout(() => {
          setShowReplay(false);
          startRecording(src);
        }, 3000);
      }
    };

    audio.onerror = () => {
      fallbackNext();
    };

    setTimeout(() => {
      if (!started) fallbackNext();
    }, 4000);
  };

  const handleReplay = () => {
    const src = currentSrcRef.current;
    if (!src) return;

    // Clear timeout 3 giây
    if (replayTimeoutRef.current) {
      clearTimeout(replayTimeoutRef.current);
      replayTimeoutRef.current = null;
    }

    setShowReplay(false);
    playAudio(src, true);
  };

  const startRecording = async (src) => {
  try {
    const duration = getDurationFromFileName(src);

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

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        recordingsRef.current.push(blob);

        setCanNext(false); // Disable Next trong lúc uploading
        setUploading(true);

        setTimeout(() => {
          setUploading(false);

          if (pendingNextRef.current) {
            // Người dùng đã bấm Next trong lúc recording → tự động chuyển câu
            pendingNextRef.current = false;
            goToNext();
          } else {
            // Hết giờ tự nhiên → mở nút Next bình thường
            setCanNext(true);
          }
        }, 3000);

        mediaRecorder.stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setCanNext(true); // Cho phép bấm Next ngay khi recording bắt đầu

      let t = duration;

      // Delay nhỏ để React kịp render thanh full 100% trước khi transition bắt đầu
      setTimeout(() => {
        const interval = setInterval(() => {
          t--;

          if (t <= 0) {
            clearInterval(interval);
            timerIntervalRef.current = null;
            setTime(0);
            setTimeout(() => {
              if (!stopped) mediaRecorder.stop();
            }, 100);
          } else {
            setTime(t);
          }
        }, 1000);
        timerIntervalRef.current = interval;
      }, 50);

      setTimeout(() => {
        if (!stopped) mediaRecorder.stop();
      }, (duration + 5) * 1000);

    } catch (err) {
      console.error(err);
      fallbackNext();
    }
  };

  const goToNext = () => {
  setIndex((prevIndex) => {
    const nextIndex = prevIndex + 1;

    if (nextIndex >= listRef.current.length) {
      setFinished(true);
      return prevIndex;
    }

    audioRef.current?.pause();
    setTimeout(() => {
      playAudio(listRef.current[nextIndex]);
    }, 300);

    return nextIndex;
  });
};

  const handleNext = () => {
    if (!canNext) return;

    if (mode === "recording" && mediaRecorderRef.current?.state === "recording") {
      // Bấm Next khi đang recording: dừng timer, đánh dấu pending, stop recorder
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      pendingNextRef.current = true;
      mediaRecorderRef.current.stop();
      // onstop sẽ lo phần còn lại (spinner → goToNext)
      return;
    }

    goToNext();
  };

  if (!started) {
    return (
      <div className="landing">
        <div className="landing-card">
          <div className="landing-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="38" height="38">
              <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.93V20H9v2h6v-2h-2v-2.07A7 7 0 0 0 19 11h-2z"/>
            </svg>
          </div>
          <h1 className="landing-title">OPIC Practicing App</h1>
          <p className="landing-sub">15 questions · Speaking test simulation</p>
          <div className="landing-divider" />
          <ul className="landing-info">
            <li>🎧 Listen to each question carefully</li>
            <li>🎙️ Record your answer when prompted</li>
            <li>⬇️ Download all recordings at the end</li>
          </ul>
          <button className="start-btn" onClick={startTest}>
            START TEST
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
  return <FinishedScreen recordings={recordingsRef.current} />;
}

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
        {showReplay && (
          <button className="replay-btn" onClick={handleReplay}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="36" height="36">
              <path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-9 9zm7.5-4.5 5 4.5-5 4.5V7.5z"/>
            </svg>
          </button>
        )}
      </div>

      <div className="timer-bar">
        <div
          className="timer-fill"
          style={{
            width: mode === "recording" ? `${(time / maxTime) * 100}%` : "0%",
            transition: mode === "recording" && time < maxTime && time > 0
              ? "width 1s linear"
              : "none",
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
