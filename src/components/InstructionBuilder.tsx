import { useState } from "react";
import type { Instruction } from "../types";
import type { InstructionSet } from "../lib/instructionSets";

interface Props {
  maxForward: number;
  instructionSet: InstructionSet;
  disabled?: boolean;
  onAdd: (instr: Instruction) => void;
}

export function InstructionBuilder({ maxForward, instructionSet, disabled, onAdd }: Props) {
  const [action, setAction] = useState<Instruction["action"]>("forward");
  const [n, setN] = useState(1);

  const add = () => {
    if (action === "forward") {
      onAdd({ action: "forward", n: Math.max(1, Math.min(maxForward, n)) });
    } else {
      onAdd({ action });
    }
  };

  return (
    <div className="add-row">
      <select
        value={action}
        disabled={disabled}
        onChange={(e) => setAction(e.target.value as Instruction["action"])}
      >
        <option value="left">{instructionSet.turnLeft}</option>
        <option value="right">{instructionSet.turnRight}</option>
        <option value="forward">{instructionSet.forward}</option>
      </select>
      {action === "forward" && (
        <input
          type="number"
          min={1}
          max={maxForward}
          value={n}
          disabled={disabled}
          onChange={(e) => setN(parseInt(e.target.value, 10) || 1)}
        />
      )}
      <button className="accent" disabled={disabled} onClick={add}>
        Add
      </button>
    </div>
  );
}
