import { useMemo, useState } from "react";
import { LEVELS } from "./lib/levels";
import { Grid } from "./components/Grid";
import { InstructionBuilder } from "./components/InstructionBuilder";
import { ProgramList } from "./components/ProgramList";
import { StatusBar } from "./components/StatusBar";
import { useTurtleRunner } from "./hooks/useTurtleRunner";
import { useProgramEditor } from "./hooks/useProgramEditor";
import { PrintView } from "./print/PrintView";
import {
  DEFAULT_INSTRUCTION_SET_ID,
  getInstructionSet,
  INSTRUCTION_SETS,
} from "./lib/instructionSets";

function Game() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [setId, setSetId] = useState<string>(DEFAULT_INSTRUCTION_SET_ID);
  const level = LEVELS[levelIndex];
  const instructionSet = getInstructionSet(setId);
  const { program, addInstruction, removeInstruction, clearProgram } =
    useProgramEditor();
  const { turtle, status, executingInstructionIndex, run, reset } = useTurtleRunner(level);

  const running = status.kind === "running";
  const maxForward = level.size - 1;

  const selectLevel = (i: number) => {
    setLevelIndex(i);
    clearProgram();
  };

  const selectSet = (id: string) => {
    setSetId(id);
    clearProgram();
    reset();
  };

  return (
    <div className="wrap">
      <header>
        <h1>
          Turtle <span>Path</span>
        </h1>
        <div className="sub">{instructionSet.forwardPhrase("X")} · {instructionSet.turnLeft.toLowerCase()} · {instructionSet.turnRight.toLowerCase()}</div>
      </header>

      <div className="stage">
        <div className="board-card">
          <div className="board-head">
            <span className="level-pill">{level.name.toUpperCase()}</span>
            <span>
              {program.length} instruction{program.length === 1 ? "" : "s"}
            </span>
          </div>
          <Grid level={level} turtle={turtle} />
          <div className="legend">
            <span>
              <i className="swatch blocked" /> blocked
            </span>
            <span>
              <i className="swatch start" /> start
            </span>
            <span>
              <i className="swatch end" /> end
            </span>
          </div>
          <StatusBar status={status} queued={program.length} />
        </div>

        <div className="panel">
          <h2>Build the program</h2>
          <div className="set-row">
            <label htmlFor="instr-set">Instruction set</label>
            <select
              id="instr-set"
              value={setId}
              disabled={running}
              onChange={(e) => selectSet(e.target.value)}
            >
              {INSTRUCTION_SETS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <InstructionBuilder
            maxForward={maxForward}
            instructionSet={instructionSet}
            disabled={running}
            onAdd={addInstruction}
          />
          <ProgramList
            program={program}
            activeIndex={executingInstructionIndex}
            instructionSet={instructionSet}
            onRemove={removeInstruction}
          />

          <div className="run-row">
            <button disabled={running || !program.length} onClick={() => run(program)}>
              ▶ Run
            </button>
            <button className="secondary" disabled={running} onClick={reset}>
              Reset turtle
            </button>
            <button
              className="secondary"
              disabled={running}
              onClick={() => {
                clearProgram();
                reset();
              }}
            >
              Clear program
            </button>
          </div>
          <div className="run-row">
            {LEVELS.map((lvl, i) => (
              <button
                key={lvl.name}
                className="secondary"
                disabled={running}
                onClick={() => selectLevel(i)}
              >
                {lvl.name}
              </button>
            ))}
            <button
              className="secondary"
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set("print", "1");
                url.searchParams.set("set", setId);
                window.open(url.toString(), "_blank");
              }}
            >
              🖨 Print worksheet
            </button>
          </div>
        </div>
      </div>

      <footer className="instructions">
        <p>
          <b>How it works.</b> The turtle starts facing a fixed direction. Work out a route from START to END that
          never crosses a blocked square or the edge of the grid, then translate it into instructions —{" "}
          <b>{instructionSet.turnLeft.toLowerCase()}</b>, <b>{instructionSet.turnRight.toLowerCase()}</b>, and{" "}
          <b>{instructionSet.forwardPhrase("X")}</b> for however many squares to travel in the current direction.
          Press Run to watch it play out exactly. Hitting a wall or blocked square stops it dead — fix the program
          and try again.
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  const isPrint = useMemo(() => new URLSearchParams(window.location.search).get("print") === "1", []);
  return isPrint ? <PrintView /> : <Game />;
}
