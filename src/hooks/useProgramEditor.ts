import { useCallback, useState } from "react";
import type { Instruction, Level } from "../types";

export function useProgramEditor(level: Level) {
  const [program, setProgram] = useState<Instruction[]>([]);

  const addInstruction = useCallback((instr: Instruction) => {
    setProgram((p) => [...p, instr]);
  }, []);

  const removeInstruction = useCallback((index: number) => {
    setProgram((p) => p.filter((_, idx) => idx !== index));
  }, []);

  const clearProgram = useCallback(() => {
    setProgram([]);
  }, []);

  const maxForward = level.size - 1;

  return { program, addInstruction, removeInstruction, clearProgram, maxForward };
}
