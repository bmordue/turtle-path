import type { Instruction } from "../types";

interface Props {
  program: Instruction[];
  activeIndex: number | null;
  onRemove: (index: number) => void;
}

function label(instr: Instruction): string {
  if (instr.type === "left") return "↺ turn left";
  if (instr.type === "right") return "↻ turn right";
  return `↑ forward ${instr.n}`;
}

export function ProgramList({ program, activeIndex, onRemove }: Props) {
  if (!program.length) {
    return <p className="empty-hint">No instructions yet — add some above.</p>;
  }
  return (
    <ol className="program-list">
      {program.map((instr, i) => (
        <li key={i} className={i === activeIndex ? "active-step" : ""}>
          <span>
            <span className="idx">{i + 1}.</span>
            {label(instr)}
          </span>
          <button onClick={() => onRemove(i)} aria-label={`Remove instruction ${i + 1}`}>
            ✕
          </button>
        </li>
      ))}
    </ol>
  );
}
