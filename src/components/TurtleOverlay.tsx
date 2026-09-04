import type { TurtleState } from "../types";
import { DIR_ANGLE } from "../lib/turtle";

const CELL = 80;

function cellCenter(x: number, y: number) {
  return { cx: x * CELL + CELL / 2, cy: y * CELL + CELL / 2 };
}

interface Props {
  turtle: TurtleState;
}

export function TurtleOverlay({ turtle }: Props) {
  const pathPoints = turtle.path
    .map(([x, y]) => cellCenter(x, y))
    .map((c) => `${c.cx},${c.cy}`)
    .join(" ");

  const { cx, cy } = cellCenter(turtle.x, turtle.y);

  return (
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
        transform={`translate(${cx},${cy}) rotate(${DIR_ANGLE[turtle.dir]})`}
      >
        <polygon points="0,-16 12,12 -12,12" fill="var(--ink)" stroke="var(--accent)" strokeWidth={2} />
      </g>
    </>
  );
}
