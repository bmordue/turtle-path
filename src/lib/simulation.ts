import type { Instruction, Level, TurtleState } from "../types";
import { turnLeft, turnRight, stepForward, reachedEnd } from "./turtle";

export type StepEvent =
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
): AsyncGenerator<StepEvent> {
  let state = start;

  for (let i = 0; i < program.length; i++) {
    const instr = program[i];

    if (instr.action === "left" || instr.action === "right") {
      state = { ...state, dir: instr.action === "left" ? turnLeft(state.dir) : turnRight(state.dir) };
      yield { kind: "turn", state, atInstruction: i };
      continue;
    }

    for (let step = 0; step < instr.n; step++) {
      const result = stepForward(level, state);
      if ("crash" in result) {
        yield { kind: "crash", atInstruction: i, reason: result.crash };
        return;
      }
      state = result.state;
      yield { kind: "move", state, atInstruction: i };
      if (reachedEnd(level, state)) {
        yield { kind: "success", atInstruction: i };
        return;
      }
    }
  }
}
