import type { Instruction } from "../types";

/**
 * The semantics of every instruction set are identical (canonical actions
 * `left`, `right`, and `forward` with a distance `n`). An instruction set
 * describes how that vocabulary is presented to the player — names, phrasing,
 * and labels — so that simulation and level data never change.
 */
export interface InstructionSet {
  id: string;
  name: string;
  /** Human label for the turn-left option. */
  turnLeft: string;
  /** Human label for the turn-right option. */
  turnRight: string;
  /** Human label for the forward option in the builder. */
  forward: string;
  /** Renders a stored forward instruction as a written program line. */
  forwardPhrase: (n: number | string) => string;
}

export const INSTRUCTION_SETS: InstructionSet[] = [
  {
    id: "standard",
    name: "Standard",
    turnLeft: "Turn left",
    turnRight: "Turn right",
    forward: "Forward",
    forwardPhrase: (n) => `forward ${n}`,
  },
  {
    id: "logo",
    name: "Logo",
    turnLeft: "lt",
    turnRight: "rt",
    forward: "fd",
    forwardPhrase: (n) => `fd ${n}`,
  },
];

export const DEFAULT_INSTRUCTION_SET_ID = INSTRUCTION_SETS[0].id;

export function getInstructionSet(id: string | null): InstructionSet {
  const found = INSTRUCTION_SETS.find((s) => s.id === id);
  return found ?? INSTRUCTION_SETS[0];
}

/** Render an instruction as a written program line in the given set. */
export function labelInstruction(instr: Instruction, set: InstructionSet): string {
  if (instr.action === "left") return set.turnLeft;
  if (instr.action === "right") return set.turnRight;
  return set.forwardPhrase(instr.n);
}
