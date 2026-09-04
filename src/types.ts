// 0=N, 1=E, 2=S, 3=W
export type Dir = 0 | 1 | 2 | 3;

export interface Cell {
  x: number;
  y: number;
}

export interface Level {
  name: string;
  size: number;
  start: Cell;
  startDir: Dir;
  end: Cell;
  blocked: [number, number][];
}

export type Instruction =
  | { type: "left" }
  | { type: "right" }
  | { type: "forward"; n: number };

export interface TurtleState {
  x: number;
  y: number;
  dir: Dir;
  path: [number, number][];
}

export type RunStatus =
  | { kind: "idle" | "ready" | "running" }
  | { kind: "success"; steps: number }
  | { kind: "crashed"; atInstruction: number; reason: "wall" | "blocked" };
