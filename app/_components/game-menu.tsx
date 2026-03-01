"use client";

import { useState } from "react";
import { ApiGame, Category } from "../_types";

const DEFAULT_URL =
  "https://raw.githubusercontent.com/Eyefyre/NYT-Connections-Answers/refs/heads/main/connections.json";

type Props = {
  onSelectGame: (categories: Category[]) => void;
};

function convertToCategories(game: ApiGame): Category[] {
  return game.answers.map((answer) => ({
    category: answer.group,
    items: answer.members,
    level: (answer.level + 1) as 1 | 2 | 3 | 4,
  }));
}

export default function GameMenu({ onSelectGame }: Props) {
  const [url, setUrl] = useState(DEFAULT_URL);
  const [games, setGames] = useState<ApiGame[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGames = () => {
    setLoading(true);
    setError(null);
    setGames(null);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: ApiGame[]) => {
        setGames([...data].reverse());
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load games. Check the URL and file format.");
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-14">
      <h1 className="text-black text-4xl font-semibold my-4">Connections</h1>
      <hr className="mb-6 w-full" />

      {games === null ? (
        <div className="flex flex-col gap-3 w-full">
          <label className="text-black font-medium">
            Enter a URL to a <code>connections.json</code> file:
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <p className="text-sm text-gray-500">
            See <strong>README.md</strong> for the required file format.
          </p>
          <button
            onClick={loadGames}
            disabled={loading || url.trim() === ""}
            className="self-start px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-40 transition-colors"
          >
            {loading ? "Loading..." : "Load Games"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between w-full mb-4">
            <h2 className="text-black">Select a puzzle to play</h2>
            <button
              onClick={() => setGames(null)}
              className="text-sm text-gray-500 hover:text-black transition-colors"
            >
              ← Change URL
            </button>
          </div>
          <div className="w-full overflow-y-auto max-h-[60vh] flex flex-col gap-2 pr-1">
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => onSelectGame(convertToCategories(game))}
                className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium">#{game.id}</span>
                <span className="text-gray-500 ml-3">{game.date}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
