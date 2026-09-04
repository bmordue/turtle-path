import { useState } from "react";
import type { Instruction } from "../types";

interface Props {
  maxForward: number;
  disabled?: boolean;
  onAdd: (instr: Instruction) => void;
}

export function InstructionBuilder({ maxForward, disabled, onAdd }: Props) {
  const [type, setType] = useState<Instruction["type"]>("forward");
  const [n, setN] = useState(1);

  const add = () => {
    if (type === "forward") {
      onAdd({ type: "forward", n: Math.max(1, Math.min(maxForward, n)) });
    } else {
      onAdd({ type });
    }
  };

  return (
    <div className="add-row">
      <select
        value={type}
        disabled={disabled}
        onChange={(e) => setType(e.target.value as Instruction["type"])}
      >
        <option value="left">Turn left</option>
        <option value="right">Turn right</option>
        <option value="forward">Forward</option>
      </select>
      {type === "forward" && (
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
