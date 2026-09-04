import { LEVELS } from "../lib/levels";
import { Grid } from "../components/Grid";

const DIR_NAMES = ["up", "right", "down", "left"];

export function PrintView() {
  return (
    <div className="worksheet">
      {LEVELS.map((level) => (
        <div className="ws-level" key={level.name}>
          <div className="ws-title">
            <h2>{level.name}</h2>
            <span>forward X · turn left · turn right</span>
          </div>
          <div className="ws-grid-col">
            <Grid level={level} readOnly bw />
            <div className="ws-legend">
              <span>&#9633; blocked</span>
              <span>&#9633; START</span>
              <span>&#9633; END</span>
            </div>
            <p className="ws-prompt">Write your program, one instruction per line:</p>
            <ol>
              {Array.from({ length: 10 }).map((_, i) => (
                <li key={i}>&nbsp;</li>
              ))}
            </ol>
            <div className="instr-key">
              Turtle starts facing {DIR_NAMES[level.startDir]}.
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
