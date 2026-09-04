import { useMemo, useState } from "react";
import { LEVELS } from "./lib/levels";
import { Grid } from "./components/Grid";
import { InstructionBuilder } from "./components/InstructionBuilder";
import { ProgramList } from "./components/ProgramList";
import { StatusBar } from "./components/StatusBar";
import { useTurtleRunner } from "./hooks/useTurtleRunner";
import type { Instruction } from "./types";
import { PrintView } from "./print/PrintView";

function Game() {
  const [levelIndex, setLevelIndex] = useState(0);
  const level = LEVELS[levelIndex];
  const [program, setProgram] = useState<Instruction[]>([]);
  const { turtle, status, activeInstruction, run, reset } = useTurtleRunner(level);

  const running = status.kind === "running";

  const selectLevel = (i: number) => {
    setLevelIndex(i);
    setProgram([]);
  };

  const maxForward = level.size - 1;

  return (
    <div className="wrap">
      <header>
        <h1>
          Turtle <span>Path</span>
        </h1>
        <div className="sub">forward X · turn left · turn right</div>
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
          <InstructionBuilder
            maxForward={maxForward}
            disabled={running}
            onAdd={(instr) => setProgram((p) => [...p, instr])}
          />
          <ProgramList
            program={program}
            activeIndex={activeInstruction}
            onRemove={(i) => setProgram((p) => p.filter((_, idx) => idx !== i))}
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
                setProgram([]);
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
          never crosses a blocked square or the edge of the grid, then translate it into instructions — <b>turn
          left</b>, <b>turn right</b>, and <b>forward X</b> for however many squares to travel in the current
          direction. Press Run to watch it play out exactly. Hitting a wall or blocked square stops it dead — fix
          the program and try again.
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  const isPrint = useMemo(() => new URLSearchParams(window.location.search).get("print") === "1", []);
  return isPrint ? <PrintView /> : <Game />;
}
