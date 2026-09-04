import type { Instruction, Level, TurtleState } from "../types";
import { turnLeft, turnRight, stepForward, inBounds, DIR_VECTORS } from "./turtle";

export type RunEvent =
  | { kind: "turn"; state: TurtleState; atInstruction: number }
  | { kind: "move"; state: TurtleState; atInstruction: number }
  | { kind: "crash"; atInstruction: number; reason: "wall" | "blocked" }
  | { kind: "success"; atInstruction: number };

/**
 * Pure async generator that plays a program against a level, yielding one
 * event per animation tick. The caller controls timing (await + delay
 * between `next()` calls) so the same generator works for instant
 * validation (e.g. tests) or animated playback (the UI).
 */
export async function* runProgram(
  level: Level,
  program: Instruction[],
  start: TurtleState,
): AsyncGenerator<RunEvent> {
  let state = start;

  for (let i = 0; i < program.length; i++) {
    const instr = program[i];

    if (instr.type === "left" || instr.type === "right") {
      state = { ...state, dir: instr.type === "left" ? turnLeft(state.dir) : turnRight(state.dir) };
      yield { kind: "turn", state, atInstruction: i };
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
      yield { kind: "move", state, atInstruction: i };
      if (state.x === level.end.x && state.y === level.end.y) {
        yield { kind: "success", atInstruction: i };
        return;
      }
    }
  }
}
