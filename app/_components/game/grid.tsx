"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CellAnimationState, Category, Word } from "@/app/_types";
import Cell from "./cell";
import ClearedCategory from "./cleared-category";

type GridProps = {
  words: Word[];
  selectedWords: Word[];
  clearedCategories: Category[];
  onClick: (word: Word) => void;
  onReorder: (newWords: Word[]) => void;
  guessAnimationState: CellAnimationState;
  wrongGuessAnimationState: boolean;
};

type DragVisual =
  | { active: false }
  | {
      active: true;
      word: Word;
      x: number;
      y: number;
      offsetX: number;
      offsetY: number;
      width: number;
      height: number;
      holeIndex: number;
    };

function getCellIndexFromPoint(x: number, y: number): number {
  const elements = document.elementsFromPoint(x, y);
  for (const el of elements) {
    const idx = el.getAttribute("data-cell-index");
    if (idx !== null) return parseInt(idx);
  }
  return -1;
}

export default function Grid(props: GridProps) {
  const [displayWords, setDisplayWords] = useState(props.words);
  const [dragVisual, setDragVisual] = useState<DragVisual>({ active: false });
  const [pressingIndex, setPressingIndex] = useState(-1);

  // Refs for stable access inside global event listener closures
  const displayWordsRef = useRef(displayWords);
  const propsRef = useRef(props);
  const isDraggingRef = useRef(false);
  const blockNextClickRef = useRef(false);

  const dragRef = useRef<{
    word: Word;
    holeIndex: number;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
    holdTimer: ReturnType<typeof setTimeout> | null;
    startIndex: number;
    startX: number;
    startY: number;
    pointerId: number;
  } | null>(null);

  // Keep refs current with latest values each render
  useEffect(() => {
    displayWordsRef.current = displayWords;
  }, [displayWords]);

  useEffect(() => {
    propsRef.current = props;
  });

  // Sync displayWords from props when not dragging (e.g. shuffle)
  useEffect(() => {
    if (!isDraggingRef.current) {
      setDisplayWords(props.words);
      displayWordsRef.current = props.words;
    }
  }, [props.words]);

  // Register global pointer event listeners once
  useEffect(() => {
    const beginDrag = (x: number, y: number) => {
      const ds = dragRef.current;
      if (!ds) return;
      isDraggingRef.current = true;
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
      setPressingIndex(-1);
      setDragVisual({
        active: true,
        word: ds.word,
        x,
        y,
        offsetX: ds.offsetX,
        offsetY: ds.offsetY,
        width: ds.width,
        height: ds.height,
        holeIndex: ds.startIndex,
      });
    };

    const handlePointerMove = (e: PointerEvent) => {
      const ds = dragRef.current;
      if (!ds || e.pointerId !== ds.pointerId) return;

      if (!isDraggingRef.current) {
        const dx = e.clientX - ds.startX;
        const dy = e.clientY - ds.startY;
        if (Math.sqrt(dx * dx + dy * dy) > 5) {
          if (ds.holdTimer) {
            clearTimeout(ds.holdTimer);
            ds.holdTimer = null;
          }
          beginDrag(e.clientX, e.clientY);
        }
        return;
      }

      // Find grid slot under cursor and swap if changed
      const newIndex = getCellIndexFromPoint(e.clientX, e.clientY);
      if (newIndex !== -1 && newIndex !== ds.holeIndex) {
        const newWords = [...displayWordsRef.current];
        [newWords[ds.holeIndex], newWords[newIndex]] = [
          newWords[newIndex],
          newWords[ds.holeIndex],
        ];
        displayWordsRef.current = newWords;
        ds.holeIndex = newIndex;
        setDisplayWords(newWords);
      }

      setDragVisual((prev) => {
        if (!prev.active) return prev;
        return { ...prev, x: e.clientX, y: e.clientY, holeIndex: ds.holeIndex };
      });
    };

    const handlePointerUp = (e: PointerEvent) => {
      const ds = dragRef.current;
      if (!ds || e.pointerId !== ds.pointerId) return;

      if (ds.holdTimer) {
        clearTimeout(ds.holdTimer);
        ds.holdTimer = null;
      }

      setPressingIndex(-1);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      if (isDraggingRef.current) {
        blockNextClickRef.current = true;
        propsRef.current.onReorder(displayWordsRef.current);
        isDraggingRef.current = false;
        setDragVisual({ active: false });
      }

      dragRef.current = null;
    };

    const handlePointerCancel = (e: PointerEvent) => {
      const ds = dragRef.current;
      if (!ds || e.pointerId !== ds.pointerId) return;

      if (ds.holdTimer) {
        clearTimeout(ds.holdTimer);
        ds.holdTimer = null;
      }

      setPressingIndex(-1);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      if (isDraggingRef.current) {
        propsRef.current.onReorder(displayWordsRef.current);
        isDraggingRef.current = false;
        setDragVisual({ active: false });
      }

      dragRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, []);

  const handleCellPointerDown = (
    index: number,
    e: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (e.button > 0) return; // only primary button / touch
    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();
    const word = displayWords[index];

    setPressingIndex(index);

    dragRef.current = {
      word,
      holeIndex: index,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      width: rect.width,
      height: rect.height,
      holdTimer: setTimeout(() => {
        if (!dragRef.current) return;
        const ds = dragRef.current;
        ds.holdTimer = null;
        isDraggingRef.current = true;
        document.body.style.cursor = "grabbing";
        document.body.style.userSelect = "none";
        setPressingIndex(-1);
        setDragVisual({
          active: true,
          word: ds.word,
          x: ds.startX,
          y: ds.startY,
          offsetX: ds.offsetX,
          offsetY: ds.offsetY,
          width: ds.width,
          height: ds.height,
          holeIndex: ds.startIndex,
        });
      }, 200),
      startIndex: index,
      startX: e.clientX,
      startY: e.clientY,
      pointerId: e.pointerId,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  // Wrapper that suppresses the native click event following a drag
  const handleCellClick = useCallback(
    (word: Word) => {
      if (blockNextClickRef.current) {
        blockNextClickRef.current = false;
        return;
      }
      props.onClick(word);
    },
    [props.onClick]
  );

  const holeIndex = dragVisual.active ? dragVisual.holeIndex : -1;
  const floatingBg = dragVisual.active && dragVisual.word.selected
    ? "bg-slate-500"
    : "bg-slate-200";
  const floatingText = dragVisual.active && dragVisual.word.selected
    ? "text-stone-100"
    : "text-black";

  return (
    <div className="grid grid-cols-4 gap-2 w-full">
      {props.clearedCategories.map((category) => (
        <ClearedCategory key={category.category} category={category} />
      ))}
      {displayWords.map((item, index) => (
        <Cell
          key={item.word}
          cellValue={item}
          onClick={handleCellClick}
          animateGuess={
            props.guessAnimationState.show &&
            props.guessAnimationState.index ===
              props.selectedWords.indexOf(item)
          }
          animateWrongGuess={
            props.wrongGuessAnimationState && props.selectedWords.includes(item)
          }
          isGhost={index === holeIndex}
          isPressing={index === pressingIndex}
          onPointerDown={(e) => handleCellPointerDown(index, e)}
          cellIndex={index}
        />
      ))}

      {/* Floating tile that follows the cursor during drag */}
      {dragVisual.active && (
        <div
          style={{
            position: "fixed",
            left: dragVisual.x - dragVisual.offsetX,
            top: dragVisual.y - dragVisual.offsetY,
            width: dragVisual.width,
            height: dragVisual.height,
            pointerEvents: "none",
            zIndex: 50,
            transform: "rotate(2deg) scale(1.05)",
            transition: "none",
          }}
          className={`${floatingBg} rounded-md flex items-center justify-center shadow-xl`}
        >
          <h2
            className={`${floatingText} text-xs md:text-lg text-center font-bold break-all px-1`}
          >
            {dragVisual.word.word.toUpperCase()}
          </h2>
        </div>
      )}
    </div>
  );
}
