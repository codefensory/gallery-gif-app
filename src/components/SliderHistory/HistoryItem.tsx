import { useAtomValue } from "jotai";
import { ReactNode } from "react";
import { isDraggingAtom } from "../../store";
import { motion } from "framer-motion";

interface Props {
  page?: number;
  isActive?: boolean;
  isDisable?: boolean;
  children: (props: any) => ReactNode;
}

export const HistoryItem = (props: Props) => {
  const { page = 1 } = props;

  const isDragging = useAtomValue(isDraggingAtom);

  return (
    <motion.div
      transition={{
        ease: "easeInOut",
        duration: 0.2,
      }}
      animate={{
        scale: isDragging ? 0.9 : 1,
      }}
      className="absolute w-full top-0 h-full"
      style={{ left: (page - 1) * 100 + "%" }}
    >
      {props.children({ ...props })}
    </motion.div>
  );
};
