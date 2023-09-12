import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useAtomValue, useSetAtom, useAtom } from "jotai";
import {
  activeSessionAtom,
  sessionsSelectedsAtom,
  deleteModeAtom,
  isDraggingAtom,
  totalAtom,
} from "../../store";
import { CardEmpty } from "./CardEmpty";

const CARDS = Array.from({ length: 12 });

export const Card = (props: any) => {
  return (
    <img
      draggable={false}
      className="w-auto h-full object-cover"
      src={props.url}
    />
  );
};

interface GifCardProps {
  id: string;
  isLoading: boolean;
  data: any;
}

const selectedStyle =
  " after:absolute after:w-full after:h-full after:bg-red-500 after:opacity-50 after:top-0 after:select-none after:pointer-events-none";

const GifCard = (props: GifCardProps) => {
  const isDragging = useAtomValue(isDraggingAtom);

  const setActiveSession = useSetAtom<any, any, any>(activeSessionAtom);

  const data = props.data;

  const deleteMode = useAtomValue(deleteModeAtom);

  const [sessionsSeleteds, setSessionsSeleteds] = useAtom<any, any, any>(
    sessionsSelectedsAtom
  );

  return (
    <motion.div
      animate={{ scale: isDragging ? 0.9 : 1 }}
      transition={{
        ease: "easeInOut",
        duration: 0.2,
      }}
      className={
        "relative w-full h-[15vh] rounded-[20px] overflow-hidden" +
        (deleteMode && sessionsSeleteds[data?.id] ? selectedStyle : "")
      }
    >
      {props.isLoading || !data?.preview ? (
        <CardEmpty />
      ) : (
        <motion.div
          className="w-full h-[15vh]"
          onClick={() => {
            if (data?.id) {
              if (deleteMode) {
                setSessionsSeleteds((prev: any) => ({
                  ...prev,
                  [data.id]: !prev[data.id],
                }));

                return;
              }
              setActiveSession({
                id: data.id,
                downloadUrl: data.downloadUrl,
                url: data.url,
              });
            }
          }}
        >
          <Card url={`${import.meta.env.VITE_SERVER_URL}/${data.preview}`} />
        </motion.div>
      )}
    </motion.div>
  );
};

export const GridCard = (props: any) => {
  const setTotal = useSetAtom(totalAtom);

  const queryClient = useQueryClient();

  const sessions = useQuery({
    queryKey: ["sessions", props.page],
    queryFn: () =>
      axios
        .get("/sessions/" + (props.page - 1), {
          baseURL: import.meta.env.VITE_SERVER_URL,
        })
        .then(async (value) => {
          if (
            sessions?.data?.data.total !== value.data.total &&
            props.isActive
          ) {
            await queryClient.invalidateQueries({
              predicate: (query) => {
                return (
                  query.queryKey[0] === "sessions" &&
                  query.queryKey[1] !== props.page
                );
              },
            });
          }

          setTotal(Number(value.data.total));

          return value;
        }),
    refetchInterval: props.isActive ? 10000 : false,
    enabled: !props.isDisable,
  });

  if (props.isDisable) {
    return null;
  }

  return (
    <div className="absolute w-full h-auto grid grid-cols-3 gap-6 p-16 top-1/2 -translate-y-1/2">
      {CARDS.map((_, index) => (
        <GifCard
          key={index}
          isLoading={props.isActive ? sessions.isLoading : sessions.isFetching}
          id={index + " " + props.page}
          data={sessions?.data?.data?.sessions?.[index]}
        />
      ))}
    </div>
  );
};
