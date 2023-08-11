import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useAtomValue, useSetAtom } from "jotai";
import { activeSessionAtom, isDraggingAtom, totalAtom } from "../../store";
import { CardEmpty } from "./CardEmpty";

const CARDS = Array.from({ length: 15 });

export const Card = (props: any) => {
  return (
    <img draggable={false} className="w-auto h-full" src={props.url} />
  );
};

const GifCard = (props: any) => {
  const isDragging = useAtomValue(isDraggingAtom);

  const setActiveSession = useSetAtom(activeSessionAtom);

  const data = props.data;

  return (
    <motion.div
      animate={{ scale: isDragging ? 0.9 : 1 }}
      transition={{
        ease: "easeInOut",
        duration: 0.2,
      }}
      className="relative w-full h-[15vh]"
    >
      {props.isLoading || !data?.preview ? (
        <CardEmpty />
      ) : (
        <motion.div
          layoutId={data.id}
          className="w-full h-[15vh]"
          onClick={() => {
            if (data?.id) {
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
    <div className="w-full grid grid-cols-3 gap-2 p-4">
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
