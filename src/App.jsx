import { useRef, useState } from "react";

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
  "/audios/17.mp3",
  "/audios/18.mp3",
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
  const arr = [60, 90, 120];
  return arr[Math.floor(Math.random() * arr.length)];
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

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startTest = () => {
    const random15 = shuffle(AUDIO_LIST).slice(0, 15);
    setList(random15);
    setStarted(true);
    setIndex(0);
    setTimeout(() => playAudio(random15[0]), 500);
  };

  const playAudio = (src) => {
    setMode("playing");
    setCanNext(false);

    const audio = new Audio(src);

    audio.onended = () => {
      setTimeout(() => startRecording(), 2000);
    };

    audio.play();
  };

  const startRecording = async () => {
    const duration = getRandomTime(); // 🎯 random time
    setMode("recording");
    setTime(duration);
    setMaxTime(duration);
    setCanNext(false);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: "audio/webm",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `record-${index + 1}.webm`;
      a.click();
    };

    mediaRecorder.start();

    let t = duration;
    const interval = setInterval(() => {
      t--;
      setTime(t);

      if (t <= 0) {
        clearInterval(interval);
        mediaRecorder.stop();
        setCanNext(true);
      }
    }, 1000);
  };

  const handleNext = () => {
    if (!canNext) return;

    if (index + 1 >= list.length) {
      setFinished(true);
      return;
    }

    const nextIndex = index + 1;
    setIndex(nextIndex);

    setTimeout(() => {
      playAudio(list[nextIndex]);
    }, 500);
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
    return (
      <div className="container">
        <h1>THANK YOU</h1>
      </div>
    );
  }

  // % width progress
  const progress = (time / maxTime) * 100;

  return (
    <div className="container">
      {/* 🔢 STEP LIST */}
      <div className="steps">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className={`step ${i === index ? "active" : ""}`}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* 🖼 IMAGE */}
      <div className="image-box">
        <img src="/image.jpg" alt="" />
      </div>

      {/* ⏱ TIMER BAR */}
      <div className="timer-bar">
        <div
          className="timer-fill"
          style={{ width: `${progress}%` }}
        ></div>

        <div className="timer-display">
  {mode === "recording" ? formatTime(time) : ""}
</div>
      </div>

      {/* BUTTON */}
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
    </div>
  );
}
