import { AnimatePresence, motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import QRCode from "react-qr-code";
import { GridCard } from "./components/GifCard/GridCard";
import { HistoryItem, SliderHistory } from "./components/SliderHistory";
import { activeSessionAtom, totalAtom } from "./store";

const SESSIONS_PER_PAGE = 15;

function App() {
  const total = useAtomValue(totalAtom);

  const [activeSession, setActiveSession] = useAtom<any>(activeSessionAtom);

  return (
    <div>
      <SliderHistory limit={Math.ceil(total / SESSIONS_PER_PAGE)}>
        <HistoryItem>{GridCard}</HistoryItem>
        <HistoryItem>{GridCard}</HistoryItem>
        <HistoryItem>{GridCard}</HistoryItem>
      </SliderHistory>

      <AnimatePresence>
        {activeSession && (
          <div
            className="relative w-[100vw] h-[100vh]"
            onClick={() => setActiveSession(undefined)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute w-full h-full backdrop-blur-sm bg-[rgb(0,0,0,0.3)]"
            ></motion.div>
            <motion.div
              layoutId={activeSession.id}
              className="absolute w-full h-2/3 p-4"
            >
              <img
                draggable={false}
                className="w-auto h-full object-contain"
                src={`${import.meta.env.VITE_SERVER_URL}/${activeSession.url}`}
              />
            </motion.div>
            <motion.div
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              initial={{ scale: 0.4, opacity: 0 }}
              exit={{ opacity: 0 }}
              className="absolute w-full h-1/4 bottom-56 p-4"
            >
              <div className="relative bg-white rounded-3xl w-[52vw] h-[52vw] m-auto p-6">
                {activeSession.downloadUrl && (
                  <QRCode
                    value={activeSession.downloadUrl}
                    className="w-full h-full"
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
