import { LEVELS } from "../lib/levels";
import { Grid } from "../components/Grid";

const DIR_NAMES = ["up", "right", "down", "left"];

export function PrintView() {
  return (
    <div className="worksheet">
      {LEVELS.map((level) => (
        <div className="ws-page" key={level.name}>
          <div className="ws-title">
            <h2>Turtle Path — {level.name}</h2>
            <span>forward X · turn left · turn right</span>
          </div>
          <div className="ws-body">
            <div className="ws-grid-col">
              <Grid level={level} readOnly />
              <div className="ws-legend">
                <span>▢ blocked</span>
                <span>▢ START</span>
                <span>▢ END</span>
              </div>
            </div>
            <div className="ws-lines">
              <p>Write your program, one instruction per line:</p>
              <ol>
                {Array.from({ length: 14 }).map((_, i) => (
                  <li key={i}>&nbsp;</li>
                ))}
              </ol>
            </div>
          </div>
          <div className="instr-key">
            Instruction set: <b>turn left</b> (90°) · <b>turn right</b> (90°) · <b>forward X</b> (X = number of
            squares). Turtle starts facing {DIR_NAMES[level.startDir]}.
          </div>
        </div>
      ))}
    </div>
  );
}
