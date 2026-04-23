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
  "/audios/17.mp3",
  "/audios/18.mp3",
];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [list, setList] = useState([]);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState("idle"); // playing | recording
  const [time, setTime] = useState(20);
  const [canNext, setCanNext] = useState(false);
  const [finished, setFinished] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Start test
  const startTest = () => {
    const random15 = shuffle(AUDIO_LIST).slice(0, 15);
    setList(random15);
    setStarted(true);
    setIndex(0);
    setTimeout(() => playAudio(random15[0]), 500);
  };

  // Play audio
  const playAudio = (src) => {
    setMode("playing");
    setCanNext(false);

    const audio = new Audio(src);

    audio.onended = () => {
      setTimeout(() => {
        startRecording();
      }, 2000);
    };

    audio.play();
  };

  // Start recording
  const startRecording = async () => {
    setMode("recording");
    setTime(20);
    setCanNext(false);

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

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

    // Timer
    let t = 20;
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

  // Next
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

  return (
    <div className="container">
      {/* IMAGE */}
      <div className="image-box">
        <img src="/image.jpg" alt="visual" />
      </div>

      {/* TIMER */}
      <div className="timer">{mode === "recording" ? time : "--"}</div>

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