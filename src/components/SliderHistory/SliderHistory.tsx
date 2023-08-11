import {
  Children,
  cloneElement,
  FC,
  PropsWithChildren,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { useSetAtom } from "jotai";
import { isDraggingAtom } from "../../store";

interface Props {
  limit: number;
}

export const SliderHistory: FC<PropsWithChildren<Props>> = (props) => {
  const setIsDragging = useSetAtom(isDraggingAtom);

  const [page, setPage] = useState(1);

  const childActive = useRef(0);

  const childrenOrder = useRef<any[]>(
    Children.map<any, any>(props.children, (_, index) => {
      return { index, page: page + index };
    })
  );

  const children = useMemo(
    () =>
      Children.map<any, any>(props.children, (child, index) => {
        const page = childrenOrder.current.find(
          (val) => val.index === index
        )?.page;

        return cloneElement(child, {
          page,
          isDisable: page > props.limit,
          isActive: index === childActive.current,
        });
      }),
    [props.limit, props.children]
  );

  const handlerDragEnd = (_: any, info: any) => {
    setIsDragging(false);

    const dir = info.offset.x > 0 ? 1 : -1;

    const movingValue = Math.abs(info.offset.x) / window.innerWidth;

    if (page - dir < 1 || page - dir > props.limit || movingValue < 0.1) {
      return;
    }

    const nextPage = page - dir;

    let nextChildActive =
      (childActive.current - dir) % childrenOrder.current.length;

    nextChildActive =
      nextChildActive < 0 ? childrenOrder.current.length - 1 : nextChildActive;

    const childInOrderIndex = childrenOrder.current.findIndex(
      (val) => val.index === nextChildActive
    );

    if (childInOrderIndex === childrenOrder.current.length - 1) {
      const prePage = nextPage + 1;

      if (prePage >= 1 && prePage <= props.limit) {
        const preOrder = childrenOrder.current.shift();

        preOrder.page = prePage;

        childrenOrder.current.push(preOrder);
      }
    }

    if (childInOrderIndex === 0) {
      const prePage = nextPage - 1;

      if (prePage >= 1 && prePage <= props.limit) {
        const preOrder = childrenOrder.current.pop();

        preOrder.page = prePage;

        childrenOrder.current.unshift(preOrder);
      }
    }

    childActive.current = nextChildActive;

    setPage(nextPage);
  };

  return (
    <div>
      <motion.div
        drag="x"
        dragConstraints={{ right: 0, left: 0 }}
        dragElastic={0.15}
        transition={{
          ease: "easeInOut",
          duration: 0.3,
        }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handlerDragEnd}
        animate={{
          translateX: -(page - 1) * 100 + "%",
        }}
        className="w-full h-full absolute"
      >
        {children ?? null}
      </motion.div>
    </div>
  );
};
