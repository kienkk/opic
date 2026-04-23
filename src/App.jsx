import { useRef, useState } from "react";
import JSZip from "jszip";

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

async function downloadAll() {
  const zip = new JSZip();

  recordingsRef.current.forEach((blob, i) => {
    zip.file(`record-${i + 1}.webm`, blob);
  });

  const content = await zip.generateAsync({ type: "blob" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(content);
  a.download = "all-recordings.zip";
  a.click();
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

  const [uploading, setUploading] = useState(false);
  const recordingsRef = useRef([]);

  const startTest = () => {
    const random15 = shuffle(AUDIO_LIST).slice(0, 15);
    setList(random15);
    setStarted(true);
    setIndex(0);
    setTimeout(() => playAudio(random15[0]), 500);
  };

  const playAudio = (src) => {
    console.log("PLAY:", index);
  setMode("playing");
  setCanNext(false);

  const audio = new Audio(src);

  audio.onended = () => {
    setTimeout(() => {
      startRecording();
    }, 2000);
  };

  audio.onerror = () => {
    console.error("Audio error:", src);
    setCanNext(true); // fallback
  };

  audio.play().catch((err) => {
    console.error("Play failed:", err);
    setCanNext(true); // fallback
  });
};

  const startRecording = async () => {
    console.log("RECORD START");
  try {
    const duration = getRandomTime();

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
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();

// ✅ thêm ngay sau đây
setTimeout(() => {
  if (!canNext && mode === "recording") {
    console.warn("Failsafe triggered");
    setCanNext(true);
  }
}, 15000);

    let t = duration;
    const interval = setInterval(() => {
      t--;
      setTime(t);

      if (t <= 0) {
        clearInterval(interval);
        mediaRecorder.stop();
      }
    }, 1000);
  } catch (err) {
    console.error("Recording error:", err);
    setCanNext(true); // fallback
  }
};

  const handleNext = async () => {
    if (!canNext) return;

    if (index + 1 >= list.length) {
      setUploading(true);
      await downloadAll();
      setUploading(false);
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
      </div>

  <div className="timer-display">
  {mode === "recording" ? formatTime(time) : ""}
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

      {uploading && (
  <div className="overlay">
    <div className="spinner"></div>
    <p>Uploading Audio...</p>
  </div>
)}
    </div>
  );
}
