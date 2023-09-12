import { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue, useAtom } from "jotai";
import { GridCard } from "./components/GifCard/GridCard";
import { HistoryItem, SliderHistory } from "./components/SliderHistory";
import { totalAtom, deleteModeAtom, sessionsSelectedsAtom } from "./store";
import { GifModal } from "./components";

const SESSIONS_PER_PAGE = 12;

function App() {
  const total = useAtomValue(totalAtom);

  const [deleteMode, setDeleteMode] = useAtom(deleteModeAtom);

  const [selectedsSessions, setSelectedsSessions] = useAtom<any, any, any>(
    sessionsSelectedsAtom
  );

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (deleteMode) {
      const ids = Object.keys(selectedsSessions)
        .filter((key) => !!selectedsSessions[key])
        .join();

      await axios.delete("/sessions/?ids=" + ids, {
        baseURL: import.meta.env.VITE_SERVER_URL,
      });

      await queryClient.invalidateQueries(["sessions"]);

      setSelectedsSessions([]);

      setDeleteMode(false);

      return;
    }

    setShowPassword(true);
  };

  const handlePassword = (value) => {
    const pass = value.target.value;

    if (pass === "55890") {
      setShowPassword(false);

      setDeleteMode(true);

      setPassword("");

      return;
    }

    if (pass.length >= 5) {
      setPassword("");

      setShowPassword(false);

      return;
    }

    setPassword(pass);
  };

  return (
    <div>
      <SliderHistory limit={Math.ceil(total / SESSIONS_PER_PAGE)}>
        <HistoryItem>{GridCard}</HistoryItem>
        <HistoryItem>{GridCard}</HistoryItem>
        <HistoryItem>{GridCard}</HistoryItem>
      </SliderHistory>
      <GifModal />
      <div className="fixed bg-[url(background.png)] top-0 left-0 w-[100vw] h-[100vh] select-none pointer-events-none z-10"></div>
      <div
        className={
          "absolute top-0 right-0 w-16 h-16 z-20 " +
          (deleteMode ? "bg-red-500" : "bg-transparent")
        }
        onClick={handleDelete}
      ></div>
      {showPassword && (
        <input
          className="absolute w-full h-16 top-0 left-0 z-20 text-6xl"
          type="password"
          autoFocus
          value={password}
          onChange={handlePassword}
        />
      )}
    </div>
  );
}

export default App;
