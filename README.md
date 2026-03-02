# NYT Connections Clone

Clone of the Connections game from the New York Times, written using Next.js.

## Features

- Load any Connections puzzle from a custom JSON file via URL
- **Drag tiles** to rearrange them on the board — hold a tile briefly (or start moving it) to drag it into a new position

## Installing locally

For those interested in running the app locally, first clone the repository:
```bash
git clone https://github.com/srefsland/nyt-connections-clone.git
```

Install dependencies:
```bash
cd nyt-connections-clone
npm install
```

Start the development server:
```bash
npm run dev
```

The development server is now live at http://localhost:3000.

## connections.json format

The app loads puzzles from a JSON file you provide via URL. The file must be a JSON array of game objects, each with the following structure:

```json
[
  {
    "id": 1,
    "date": "2024-01-01",
    "answers": [
      {
        "level": 0,
        "group": "CATEGORY NAME",
        "members": ["WORD1", "WORD2", "WORD3", "WORD4"]
      },
      {
        "level": 1,
        "group": "ANOTHER CATEGORY",
        "members": ["WORD1", "WORD2", "WORD3", "WORD4"]
      },
      {
        "level": 2,
        "group": "THIRD CATEGORY",
        "members": ["WORD1", "WORD2", "WORD3", "WORD4"]
      },
      {
        "level": 3,
        "group": "FOURTH CATEGORY",
        "members": ["WORD1", "WORD2", "WORD3", "WORD4"]
      }
    ]
  }
]
```

**Fields:**

| Field | Type | Description |
|---|---|---|
| `id` | number | Unique identifier for the puzzle |
| `date` | string | Display date shown in the puzzle list |
| `answers` | array | Exactly 4 category objects |
| `answers[].level` | 0–3 | Difficulty: 0 = easiest (yellow), 1 = easy (green), 2 = hard (blue), 3 = hardest (purple) |
| `answers[].group` | string | The category label displayed when solved |
| `answers[].members` | string[] | Exactly 4 words belonging to this category |

## License

This project is released under the [MIT License](LICENSE.md).
