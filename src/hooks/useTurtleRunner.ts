import { useCallback, useRef, useState } from "react";
import type { Instruction, Level, ProgramResult, TurtleState } from "../types";
import { initialTurtleState } from "../lib/turtle";
import { runProgram } from "../lib/simulation";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const DEFAULT_TURN_DELAY_MS = 220;
const DEFAULT_MOVE_DELAY_MS = 260;

interface RunnerOpts {
  turnDelay?: number;
  moveDelay?: number;
}

export function useTurtleRunner(level: Level, opts: RunnerOpts = {}) {
  const turnDelay = opts.turnDelay ?? DEFAULT_TURN_DELAY_MS;
  const moveDelay = opts.moveDelay ?? DEFAULT_MOVE_DELAY_MS;

  const [turtle, setTurtle] = useState<TurtleState>(() => initialTurtleState(level));
  const [status, setStatus] = useState<ProgramResult>({ kind: "ready" });
  const [executingInstructionIndex, setExecutingInstructionIndex] = useState<number | null>(null);
  const runId = useRef(0);

  const reset = useCallback(() => {
    runId.current += 1;
    setTurtle(initialTurtleState(level));
    setStatus({ kind: "ready" });
    setExecutingInstructionIndex(null);
  }, [level]);

  const run = useCallback(
    async (program: Instruction[]) => {
      if (!program.length) return;
      const myRun = ++runId.current;
      const start = initialTurtleState(level);
      setTurtle(start);
      setStatus({ kind: "running" });
      await sleep(150);

      let stepsTaken = 0;

      for await (const event of runProgram(level, program, start)) {
        if (runId.current !== myRun) return;

        if (event.kind === "turn") {
          setExecutingInstructionIndex(event.atInstruction);
          setTurtle(event.state);
          await sleep(turnDelay);
        } else if (event.kind === "move") {
          setExecutingInstructionIndex(event.atInstruction);
          setTurtle(event.state);
          stepsTaken += 1;
          await sleep(moveDelay);
        } else if (event.kind === "crash") {
          setStatus({ kind: "crashed", atInstruction: event.atInstruction, reason: event.reason });
          setExecutingInstructionIndex(null);
          return;
        } else if (event.kind === "success") {
          setStatus({ kind: "success", steps: stepsTaken });
          setExecutingInstructionIndex(null);
          return;
        }
      }
      if (runId.current === myRun) {
        setStatus({ kind: "ready" });
        setExecutingInstructionIndex(null);
      }
    },
    [level, turnDelay, moveDelay],
  );

  return { turtle, status, executingInstructionIndex, run, reset };
}
