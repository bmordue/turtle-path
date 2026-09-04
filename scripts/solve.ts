import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

interface Cell {
  x: number;
  y: number;
}

interface Level {
  name: string;
  size: number;
  start: Cell;
  startDir: number;
  end: Cell;
  blocked: [number, number][];
}

const DIR_VECTORS = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

const isBlocked = (level: Level, x: number, y: number) =>
  level.blocked.some(([bx, by]) => bx === x && by === y);

const inBounds = (level: Level, x: number, y: number) =>
  x >= 0 && y >= 0 && x < level.size && y < level.size;

/**
 * Breadth-first search from start to end, ignoring the turtle's orientation
 * (directional turns never cost moves, so a path exists iff the cells connect).
 * Returns the reachable cell count and, when the END is reachable, the shortest
 * movement path from START to END (inclusive).
 */
function solve(level: Level): { reachable: number; path: Cell[] | null } {
  const startKey = (c: Cell) => `${c.x},${c.y}`;
  const start = level.start;
  const goal = level.end;
  const goalKey = startKey(goal);

  const visited = new Set<string>([startKey(start)]);
  const queue: Cell[] = [start];
  const cameFrom = new Map<string, string>();

  let found = false;
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (startKey(current) === goalKey) {
      found = true;
      break;
    }
    for (const v of DIR_VECTORS) {
      const nx = current.x + v.x;
      const ny = current.y + v.y;
      if (!inBounds(level, nx, ny) || isBlocked(level, nx, ny)) continue;
      const key = startKey({ x: nx, y: ny });
      if (visited.has(key)) continue;
      visited.add(key);
      cameFrom.set(key, startKey(current));
      queue.push({ x: nx, y: ny });
    }
  }

  if (!found) return { reachable: visited.size, path: null };

  const path: Cell[] = [];
  let cursor = goalKey;
  while (cursor !== startKey(start)) {
    const [x, y] = cursor.split(",").map(Number);
    path.push({ x, y });
    cursor = cameFrom.get(cursor)!;
  }
  path.push({ ...start });
  path.reverse();
  return { reachable: visited.size, path };
}

function main() {
  const levelsDir = join(
    fileURLToPath(new URL("..", import.meta.url)),
    "src",
    "levels",
  );
  const files = readdirSync(levelsDir)
    .filter((f) => f.endsWith(".json"))
    .sort();

  let allSolvable = true;

  for (const file of files) {
    const level = JSON.parse(
      readFileSync(join(levelsDir, file), "utf8"),
    ) as Level;
    const { reachable, path } = solve(level);

    if (path) {
      console.log(
        `${level.name}: solvable (${reachable}/${level.size * level.size} cells reachable, ` +
          `${path.length - 1} steps)`,
      );
      console.log(`  path: ${path.map((c) => `(${c.x},${c.y})`).join(" → ")}`);
    } else {
      allSolvable = false;
      console.log(
        `${level.name}: IMPOSSIBLE (only ${reachable}/${level.size * level.size} cells reachable)`,
      );
    }
  }

  if (!allSolvable) {
    process.exitCode = 1;
  }
}

main();
