import type { RunStatus } from "../types";

function message(status: RunStatus, queued: number): { text: string; kind?: "ok" | "bad" } {
  switch (status.kind) {
    case "ready":
      return { text: `Ready to run. ${queued} instruction(s) queued.` };
    case "running":
      return { text: "Running…" };
    case "success":
      return { text: `🎉 Reached END in ${status.steps} move(s)!`, kind: "ok" };
    case "crashed":
      return {
        text: `💥 Crashed at instruction ${status.atInstruction + 1} — that square is ${
          status.reason === "wall" ? "off the grid." : "blocked."
        }`,
        kind: "bad",
      };
    default:
      return { text: "Plan a path from START to END, then build your program." };
  }
}

export function StatusBar({ status, queued }: { status: RunStatus; queued: number }) {
  const { text, kind } = message(status, queued);
  return <div className={`status${kind ? ` ${kind}` : ""}`}>{text}</div>;
}
