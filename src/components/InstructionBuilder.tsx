import { useState } from "react";
import type { Instruction } from "../types";

interface Props {
  maxForward: number;
  disabled?: boolean;
  onAdd: (instr: Instruction) => void;
}

export function InstructionBuilder({ maxForward, disabled, onAdd }: Props) {
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
        <option value="left">Turn left</option>
        <option value="right">Turn right</option>
        <option value="forward">Forward</option>
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
