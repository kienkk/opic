import { useEffect, useRef, useState } from "react";

/* ===================== DATA ===================== */

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

/* ===================== HELPERS ===================== */

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

function pickAudios(folderMap) {
  const folders = Object.keys(folderMap);

  const rolePlay = folders.filter(f => f.includes("Role Play"));
  const normal = folders.filter(f => !f.includes("Role Play"));

  const selectedRolePlay = shuffle(rolePlay).slice(0, 2);

  const targetFolderCount = 6 + Math.floor(Math.random() * 2);

  const selectedNormal = shuffle(normal).slice(
    0,
    targetFolderCount - selectedRolePlay.length
  );

  const selectedFolders = shuffle([
    ...selectedRolePlay,
    ...selectedNormal,
  ]);

  let result = [];
  let remaining = 15;
  let remainingFolders = selectedFolders.length;

  for (let folder of selectedFolders) {
    const files = folderMap[folder];

    let take;

    if (remainingFolders === 1) {
      take = remaining;
    } else {
      const min = 2;
      const max = Math.min(3, remaining - (remainingFolders - 1) * 2);
      take = min + Math.floor(Math.random() * (max - min + 1));
    }

    take = Math.min(take, files.length);

    result.push(...files.slice(0, take));

    remaining -= take;
    remainingFolders--;
  }

  return result;
}

function getDuration(src) {
  if (src.includes("- A")) return 60;
  if (src.includes("- B")) return 90;
  if (src.includes("- C")) return 120;
  return 60;
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
}

/* ===================== APP ===================== */

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
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  /* ===================== START ===================== */

  const startTest = () => {
    const picked = pickAudios(FOLDER_MAP);

    setList(picked);
    setStarted(true);
    setIndex(0);

    setTimeout(() => playAudio(picked[0]), 300);
  };

  /* ===================== AUDIO ===================== */

  const playAudio = (src) => {
    setMode("playing");
    setCanNext(false);

    const audio = new Audio(src);
    audioRef.current = audio;

    audio.onended = () => {
      setTimeout(() => startRecording(src), 500);
    };

    audio.onerror = () => {
      goNext();
    };

    audio.play().catch(() => goNext());
  };

  /* ===================== RECORD ===================== */

  const startRecording = async (src) => {
    const duration = getDuration(src);

    setMode("recording");
    setTime(duration);
    setMaxTime(duration);
    setCanNext(true);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    let chunks = [];
    let stopped = false;

    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = () => {
      if (stopped) return;
      stopped = true;

      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);

      const blob = new Blob(chunks);

      setUploading(true);
      setCanNext(false);

      setTimeout(() => {
        setUploading(false);
        goNext();
      }, 2000);

      stream.getTracks().forEach(t => t.stop());
    };

    recorder.start();

    let t = duration;

    intervalRef.current = setInterval(() => {
      t--;
      if (t <= 0) {
        clearInterval(intervalRef.current);
        recorder.stop();
      } else {
        setTime(t);
      }
    }, 1000);

    timeoutRef.current = setTimeout(() => {
      if (recorder.state !== "inactive") recorder.stop();
    }, (duration + 5) * 1000);
  };

  /* ===================== NEXT ===================== */

  const handleNext = () => {
    if (!canNext) return;

    if (mode === "recording") {
      mediaRecorderRef.current?.stop();
      return;
    }

    goNext();
  };

  const goNext = () => {
    if (index + 1 >= list.length) {
      setFinished(true);
      return;
    }

    const next = index + 1;
    setIndex(next);

    setTimeout(() => playAudio(list[next]), 300);
  };

  /* ===================== UI ===================== */

  if (!started) {
    return (
      <div className="container">
        <button onClick={startTest}>START TEST</button>
      </div>
    );
  }

  if (finished) {
    return <div>🎉 DONE</div>;
  }

  return (
    <div className="container">
      <div className="steps">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      <div className="timer-bar">
        <div
          style={{
            width:
              mode === "recording"
                ? `${(time / maxTime) * 100}%`
                : "0%",
          }}
        />
      </div>

      <div>{mode === "recording" && formatTime(time)}</div>

      <button onClick={handleNext} disabled={!canNext}>
        NEXT
      </button>

      <div>
        {mode === "playing" && "Listening..."}
        {mode === "recording" && "Recording..."}
      </div>

      {uploading && <div>Uploading...</div>}
    </div>
  );
}
