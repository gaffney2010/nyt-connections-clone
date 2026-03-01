"use client";

import { useState } from "react";
import GameMenu from "./_components/game-menu";
import GameScreen from "./_components/game/game-screen";
import { Category } from "./_types";

export default function Home() {
  const [selectedCategories, setSelectedCategories] = useState<
    Category[] | null
  >(null);

  if (selectedCategories === null) {
    return <GameMenu onSelectGame={setSelectedCategories} />;
  }

  return (
    <GameScreen
      categories={selectedCategories}
      onBack={() => setSelectedCategories(null)}
    />
  );
}
