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

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function getRandomTime() {
  const arr = [6, 5, 4]; // test nhanh
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
        setTime(t);

        if (t <= 0) {
          clearInterval(interval);
          mediaRecorder.stop();
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
    return (
      <div className="container">
        <h1>THANK YOU</h1>
      </div>
    );
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
        <div className="timer-fill" style={{ width: `${progress}%` }} />
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
