export type Category = {
  category: string;
  items: string[];
  level: 1 | 2 | 3 | 4;
};

export type Word = {
  word: string;
  level: 1 | 2 | 3 | 4;
  selected?: boolean;
};

export type SubmitResultType =
  | "correct"
  | "incorrect"
  | "same"
  | "one-away"
  | "loss"
  | "win";

export type SubmitResult = {
  result: SubmitResultType;
};

export type CellAnimationState = {
  show: boolean;
  index: number;
};

export type ApiAnswer = {
  level: -1 | 0 | 1 | 2 | 3;
  group: string;
  members: string[];
};

export type ApiGame = {
  id: number;
  date: string;
  answers: ApiAnswer[];
};
