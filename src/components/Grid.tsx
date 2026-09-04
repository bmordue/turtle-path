import type { Level, TurtleState } from "../types";
import { isBlocked } from "../lib/turtle";
import { TurtleOverlay } from "./TurtleOverlay";

const CELL = 80;

interface GridProps {
  level: Level;
  turtle?: TurtleState;
  /** Print/worksheet mode: no turtle marker, no path trail. */
  readOnly?: boolean;
  /** Black-and-white rendering for print. */
  bw?: boolean;
}

function cellCenter(x: number, y: number) {
  return { cx: x * CELL + CELL / 2, cy: y * CELL + CELL / 2 };
}

export function Grid({ level, turtle, readOnly = false, bw = false }: GridProps) {
  const size = level.size;
  const cells = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const blocked = isBlocked(level, x, y);
      const isStart = x === level.start.x && y === level.start.y;
      const isEnd = x === level.end.x && y === level.end.y;
      let fill = "#FFFFFF";
      let stroke = bw ? "#CCCCCC" : "var(--paper-line)";
      if (blocked) {
        fill = bw ? "#E8E8E8" : "var(--blocked-fill)";
        stroke = bw ? "#000000" : "var(--blocked)";
      }
      if (isStart) {
        fill = bw ? "#FFFFFF" : "#DFF3E3";
        stroke = bw ? "#000000" : "var(--good)";
      }
      if (isEnd) {
        fill = bw ? "#FFFFFF" : "var(--accent-soft)";
        stroke = bw ? "#000000" : "var(--accent)";
      }
      cells.push(
        <rect
          key={`${x}-${y}`}
          x={x * CELL + 2}
          y={y * CELL + 2}
          width={CELL - 4}
          height={CELL - 4}
          fill={fill}
          stroke={stroke}
          strokeWidth={2}
          rx={3}
        />
      );
      if (blocked) {
        cells.push(
          <line
            key={`hatch-${x}-${y}`}
            x1={x * CELL + 8}
            y1={y * CELL + CELL - 8}
            x2={x * CELL + CELL - 8}
            y2={y * CELL + 8}
            stroke={bw ? "#000000" : "var(--blocked)"}
            strokeWidth={2}
          />
        );
      }
    }
  }

  const startLabel = cellCenter(level.start.x, level.start.y);
  const endLabel = cellCenter(level.end.x, level.end.y);

  return (
    <svg
      className="grid-svg"
      viewBox={`0 0 ${size * CELL} ${size * CELL}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>{cells}</g>
      <rect
        x={2}
        y={2}
        width={size * CELL - 4}
        height={size * CELL - 4}
        fill="none"
        stroke={bw ? "#000000" : "var(--ink)"}
        strokeWidth={3}
        rx={4}
      />
      <text
        x={startLabel.cx}
        y={startLabel.cy + 38}
        textAnchor="middle"
        className="cell-label good"
        style={bw ? { fill: "#000000" } : undefined}
      >
        START
      </text>
      <text
        x={endLabel.cx}
        y={endLabel.cy + 38}
        textAnchor="middle"
        className="cell-label end"
        style={bw ? { fill: "#000000" } : undefined}
      >
        END
      </text>

      {!readOnly && turtle && <TurtleOverlay turtle={turtle} />}
    </svg>
  );
}
