import { SCENARIOS } from "@/lib/ecosystem-data";
import { Play, Square, Sparkles, Sun, Moon } from "lucide-react";

interface Props {
  activeScenarioId: string | null;
  stepIndex: number;
  onPlay: (id: string) => void;
  onStop: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export function ScenarioBar({
  activeScenarioId,
  stepIndex,
  onPlay,
  onStop,
  theme,
  onToggleTheme,
}: Props) {
  const active = SCENARIOS.find((s) => s.id === activeScenarioId) ?? null;

  return (
    <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-background/70 px-5 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ background: "var(--brain)", boxShadow: "var(--glow-brain)" }}
        >
          <Sparkles className="h-4 w-4 text-background" />
        </div>
        <div>
          <div className="text-sm font-bold tracking-tight text-foreground">
            Hex Ecosystem · Live System Map
          </div>
          <div className="text-[11px] text-muted-foreground">
            Drag to pan · scroll to zoom · click any node
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:inline">
          Simulate Scenario
        </span>
        <div className="flex gap-1.5">
          {SCENARIOS.map((s) => {
            const isActive = s.id === activeScenarioId;
            return (
              <button
                key={s.id}
                onClick={() => (isActive ? onStop() : onPlay(s.id))}
                className="group flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition"
                style={{
                  borderColor: isActive ? "var(--destructive)" : "var(--border)",
                  background: isActive
                    ? "color-mix(in oklab, var(--destructive) 18%, transparent)"
                    : "var(--card)",
                  color: isActive ? "oklch(0.95 0.05 25)" : "var(--foreground)",
                  boxShadow: isActive
                    ? "0 0 18px color-mix(in oklab, var(--destructive) 50%, transparent)"
                    : "none",
                }}
              >
                {isActive ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {s.name}
              </button>
            );
          })}
        </div>
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition hover:bg-muted"
          title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>
      </div>

      {active && (
        <div className="absolute inset-x-0 top-full mt-2 flex justify-center px-4">
          <div className="max-w-3xl rounded-lg border border-border bg-card/85 px-4 py-2 text-xs text-foreground backdrop-blur-xl">
            <span className="font-semibold text-destructive">● {active.name}</span>{" "}
            <span className="text-muted-foreground">
              Step {Math.min(stepIndex + 1, active.steps.length)} / {active.steps.length} —
            </span>{" "}
            {active.steps[Math.min(stepIndex, active.steps.length - 1)]?.note}
          </div>
        </div>
      )}
    </header>
  );
}
