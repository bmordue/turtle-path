import type { Instruction } from "../types";
import { labelInstruction, type InstructionSet } from "../lib/instructionSets";

interface Props {
  program: Instruction[];
  activeIndex: number | null;
  instructionSet: InstructionSet;
  onRemove: (index: number) => void;
}

export function ProgramList({ program, activeIndex, instructionSet, onRemove }: Props) {
  if (!program.length) {
    return <p className="empty-hint">No instructions yet — add some above.</p>;
  }
  return (
    <ol className="program-list">
      {program.map((instr, i) => (
        <li key={i} className={i === activeIndex ? "active-step" : ""}>
          <span>
            <span className="idx">{i + 1}.</span>
            {labelInstruction(instr, instructionSet)}
          </span>
          <button onClick={() => onRemove(i)} aria-label={`Remove instruction ${i + 1}`}>
            ✕
          </button>
        </li>
      ))}
    </ol>
  );
}
