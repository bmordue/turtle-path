import type { Level, TurtleState } from "../types";
import { DIR_ANGLE, isBlocked } from "../lib/turtle";

const CELL = 80;

interface GridProps {
  level: Level;
  turtle?: TurtleState;
  /** Print/worksheet mode: no turtle marker, no path trail. */
  readOnly?: boolean;
}

function cellCenter(x: number, y: number) {
  return { cx: x * CELL + CELL / 2, cy: y * CELL + CELL / 2 };
}

export function Grid({ level, turtle, readOnly = false }: GridProps) {
  const size = level.size;
  const cells = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const blocked = isBlocked(level, x, y);
      const isStart = x === level.start.x && y === level.start.y;
      const isEnd = x === level.end.x && y === level.end.y;
      let fill = "#FFFFFF";
      let stroke = "var(--paper-line)";
      if (blocked) {
        fill = "var(--blocked-fill)";
        stroke = "var(--blocked)";
      }
      if (isStart) {
        fill = "#DFF3E3";
        stroke = "var(--good)";
      }
      if (isEnd) {
        fill = "var(--accent-soft)";
        stroke = "var(--accent)";
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
            stroke="var(--blocked)"
            strokeWidth={2}
          />
        );
      }
    }
  }

  const startLabel = cellCenter(level.start.x, level.start.y);
  const endLabel = cellCenter(level.end.x, level.end.y);

  const pathPoints = turtle
    ? turtle.path.map(([x, y]) => cellCenter(x, y)).map((c) => `${c.cx},${c.cy}`).join(" ")
    : "";
  const turtleCenter = turtle ? cellCenter(turtle.x, turtle.y) : null;

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
        stroke="var(--ink)"
        strokeWidth={3}
        rx={4}
      />
      <text x={startLabel.cx} y={startLabel.cy + 38} textAnchor="middle" className="cell-label good">
        START
      </text>
      <text x={endLabel.cx} y={endLabel.cy + 38} textAnchor="middle" className="cell-label end">
        END
      </text>

      {!readOnly && turtle && (
        <>
          <polyline
            points={pathPoints}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.8}
          />
          <g
            style={{ transition: "transform 0.28s linear" }}
            transform={`translate(${turtleCenter!.cx},${turtleCenter!.cy}) rotate(${DIR_ANGLE[turtle.dir]})`}
          >
            <polygon points="0,-16 12,12 -12,12" fill="var(--ink)" stroke="var(--accent)" strokeWidth={2} />
          </g>
        </>
      )}
    </svg>
  );
}
