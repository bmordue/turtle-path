import type { Dir, Instruction, Level, TurtleState } from "../types";

// N, E, S, W step vectors
export const DIR_VECTORS: Record<Dir, { x: number; y: number }> = {
  0: { x: 0, y: -1 },
  1: { x: 1, y: 0 },
  2: { x: 0, y: 1 },
  3: { x: -1, y: 0 },
};

export const DIR_ANGLE: Record<Dir, number> = { 0: 0, 1: 90, 2: 180, 3: 270 };

export function isBlocked(level: Level, x: number, y: number): boolean {
  return level.blocked.some(([bx, by]) => bx === x && by === y);
}

export function inBounds(level: Level, x: number, y: number): boolean {
  return x >= 0 && y >= 0 && x < level.size && y < level.size;
}

export function initialTurtleState(level: Level): TurtleState {
  return {
    x: level.start.x,
    y: level.start.y,
    dir: level.startDir,
    path: [[level.start.x, level.start.y]],
  };
}

export function turnLeft(dir: Dir): Dir {
  return ((dir + 3) % 4) as Dir;
}

export function turnRight(dir: Dir): Dir {
  return ((dir + 1) % 4) as Dir;
}

export function reachedEnd(level: Level, state: TurtleState): boolean {
  return state.x === level.end.x && state.y === level.end.y;
}

/**
 * A single forward step. Returns the next state, or null if the step
 * would leave the grid or land on a blocked cell (a "crash").
 */
export function stepForward(level: Level, state: TurtleState): TurtleState | null {
  const v = DIR_VECTORS[state.dir];
  const nx = state.x + v.x;
  const ny = state.y + v.y;
  if (!inBounds(level, nx, ny) || isBlocked(level, nx, ny)) return null;
  return { ...state, x: nx, y: ny, path: [...state.path, [nx, ny]] };
}

export type RunEvent =
  | { kind: "turn"; state: TurtleState }
  | { kind: "move"; state: TurtleState }
  | { kind: "crash"; atInstruction: number; reason: "wall" | "blocked" }
  | { kind: "success"; atInstruction: number };

/**
 * Async generator that plays a program against a level, yielding one
 * event per animation tick. The caller drives timing (await + delay
 * between `next()` calls) so the same generator works for instant
 * validation (e.g. tests) or animated playback (the UI).
 */
export async function* runProgram(
  level: Level,
  program: Instruction[],
  start: TurtleState
): AsyncGenerator<RunEvent> {
  let state = start;

  for (let i = 0; i < program.length; i++) {
    const instr = program[i];

    if (instr.type === "left" || instr.type === "right") {
      state = { ...state, dir: instr.type === "left" ? turnLeft(state.dir) : turnRight(state.dir) };
      yield { kind: "turn", state };
      continue;
    }

    for (let step = 0; step < instr.n; step++) {
      const next = stepForward(level, state);
      if (!next) {
        const v = DIR_VECTORS[state.dir];
        const reason = inBounds(level, state.x + v.x, state.y + v.y) ? "blocked" : "wall";
        yield { kind: "crash", atInstruction: i, reason };
        return;
      }
      state = next;
      yield { kind: "move", state };
      if (reachedEnd(level, state)) {
        yield { kind: "success", atInstruction: i };
        return;
      }
    }
  }
}
