"use client";

import { Word } from "@/app/_types";

type CellProps = {
  cellValue: Word;
  onClick: (word: Word) => void;
  animateGuess: boolean;
  animateWrongGuess: boolean;
  isGhost?: boolean;
  isPressing?: boolean;
  onPointerDown?: (e: React.PointerEvent<HTMLButtonElement>) => void;
  cellIndex?: number;
};

export default function Cell(props: CellProps) {
  const bgColor = props.cellValue.selected ? "bg-slate-500" : "bg-slate-200";
  const textColor = props.cellValue.selected ? "text-stone-100" : "text-black";

  const handleClick = () => {
    props.onClick(props.cellValue);
  };

  const guessAnimation = props.animateGuess ? "transform -translate-y-2" : "";
  const wrongGuessAnimation = props.animateWrongGuess
    ? "animate-horizontal-shake"
    : "";
  const ghostStyle = props.isGhost ? "opacity-30" : "";
  const pressingStyle = props.isPressing ? "scale-95" : "";

  return (
    <button
      className={`${bgColor} py-6 rounded-md break-all px-1 transition ease-in-out cursor-grab active:cursor-grabbing select-none ${guessAnimation} ${wrongGuessAnimation} ${ghostStyle} ${pressingStyle}`}
      style={{ touchAction: "none" }}
      onClick={handleClick}
      onPointerDown={props.onPointerDown}
      data-cell-index={props.cellIndex}
    >
      <h2 className={`${textColor} text-xs md:text-lg text-center font-bold`}>
        {props.cellValue.word.toUpperCase()}
      </h2>
    </button>
  );
}
