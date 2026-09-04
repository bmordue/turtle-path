import { useCallback, useRef, useState } from "react";
import type { Instruction, Level, RunStatus, TurtleState } from "../types";
import { initialTurtleState, runProgram } from "../lib/turtle";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const TURN_DELAY_MS = 220;
const MOVE_DELAY_MS = 260;

export function useTurtleRunner(level: Level) {
  const [turtle, setTurtle] = useState<TurtleState>(() => initialTurtleState(level));
  const [status, setStatus] = useState<RunStatus>({ kind: "ready" });
  const [activeInstruction, setActiveInstruction] = useState<number | null>(null);
  const runId = useRef(0);

  const reset = useCallback(() => {
    runId.current += 1; // invalidate any in-flight run loop
    setTurtle(initialTurtleState(level));
    setStatus({ kind: "ready" });
    setActiveInstruction(null);
  }, [level]);

  const run = useCallback(
    async (program: Instruction[]) => {
      if (!program.length) return;
      const myRun = ++runId.current;
      const start = initialTurtleState(level);
      setTurtle(start);
      setStatus({ kind: "running" });
      await sleep(150);

      let instrIndex = 0;
      let stepsTaken = 0;

      for await (const event of runProgram(level, program, start)) {
        if (runId.current !== myRun) return; // superseded by reset/new run

        if (event.kind === "turn") {
          setActiveInstruction(instrIndex);
          setTurtle(event.state);
          await sleep(TURN_DELAY_MS);
          instrIndex += 1;
        } else if (event.kind === "move") {
          setActiveInstruction(instrIndex);
          setTurtle(event.state);
          stepsTaken += 1;
          await sleep(MOVE_DELAY_MS);
        } else if (event.kind === "crash") {
          setStatus({ kind: "crashed", atInstruction: event.atInstruction, reason: event.reason });
          setActiveInstruction(null);
          return;
        } else if (event.kind === "success") {
          setStatus({ kind: "success", steps: stepsTaken });
          setActiveInstruction(null);
          return;
        }
      }
      // Program ended without reaching the end cell
      if (runId.current === myRun) {
        setStatus({ kind: "ready" });
        setActiveInstruction(null);
      }
    },
    [level]
  );

  return { turtle, status, activeInstruction, run, reset };
}
