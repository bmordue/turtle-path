import { useCallback, useState } from "react";
import type { Instruction } from "../types";

export function useProgramEditor() {
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

  return { program, addInstruction, removeInstruction, clearProgram };
}
