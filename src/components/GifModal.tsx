import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import QRCode from "react-qr-code";
import { activeSessionAtom } from "../store";

export const GifModal = () => {
  const [activeSession, setActiveSession] = useAtom<any, any, any>(
    activeSessionAtom
  );

  return (
    <AnimatePresence>
      {activeSession && (
        <div className="relative w-[100vw] h-[100vh]">
          <motion.div
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute w-full h-full backdrop-blur-sm bg-[rgb(0,0,0,0.3)]"
          ></motion.div>
          <motion.div
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            initial={{
              scale: 0.4,
              translateY: "-50%",
              translateX: "-50%",
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            className="absolute bg-[#F0F0F0] w-[842px] h-[1445px] rounded-[27px] top-1/2 left-1/2"
            style={{
              boxShadow: "0px 9px 6px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="w-[458px] h-[812px] mx-auto mt-[34px] bg-black rounded-[17px] overflow-hidden">
              <img
                draggable={false}
                className="w-auto h-full object-contain"
                src={`${import.meta.env.VITE_SERVER_URL}/${activeSession.url}`}
              />
            </div>
            <div className="w-[342px] h-[342px] mt-[45px] bg-white rounded-[43px] m-auto px-8">
              {activeSession.downloadUrl && (
                <QRCode
                  value={activeSession.downloadUrl}
                  className="w-full h-full"
                />
              )}
            </div>
            <div className="w-[612px] h-[116px] bg-[url(text.svg)] mt-[27px] mx-auto"></div>
            <div
              className="absolute w-[103px] h-[103px] bg-[url(x.svg)] top-4 right-4 translate-x-1/2 -translate-y-1/2"
              onClick={() => setActiveSession(undefined)}
            ></div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
