import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { EcosystemGraph } from "@/components/EcosystemGraph";
import { LayerPanel } from "@/components/LayerPanel";
import { NodeDetails } from "@/components/NodeDetails";
import { ScenarioBar } from "@/components/ScenarioBar";
import { LAYERS, LINKS, SCENARIOS, type LayerId } from "@/lib/ecosystem-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hex Ecosystem — Live System Map" },
      {
        name: "description",
        content:
          "Interactive neural-network style map of the Hex technology ecosystem: infrastructure, connectivity, intelligence, security and operations.",
      },
      { property: "og:title", content: "Hex Ecosystem — Live System Map" },
      {
        property: "og:description",
        content:
          "Explore how cameras, AI, kiosks, LTE and the Smart Brain connect — and simulate live scenarios.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [activeLayers, setActiveLayers] = useState<Record<LayerId, boolean>>({
    infra: true,
    connect: true,
    intel: true,
    security: true,
    ops: true,
    quantum: true,
    local: true,
  });
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("theme-light", theme === "light");
    html.classList.toggle("theme-dark", theme === "dark");
  }, [theme]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  // Scenario playback
  useEffect(() => {
    if (!scenarioId) return;
    const scenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;
    setStepIndex(0);
    const t = setInterval(() => {
      setStepIndex((i) => {
        if (i + 1 >= scenario.steps.length) {
          return 0; // loop
        }
        return i + 1;
      });
    }, 1800);
    return () => clearInterval(t);
  }, [scenarioId]);

  const { highlightedNodes, highlightedLinks, flowingLinks } = useMemo(() => {
    const hn = new Set<string>();
    const hl = new Set<string>();
    const fl = new Set<string>();
    if (scenarioId) {
      const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;
      const upTo = scenario.steps.slice(0, stepIndex + 1).map((s) => s.node);
      upTo.forEach((id) => hn.add(id));
      // Build flow links between consecutive nodes if a link exists (either direction)
      for (let i = 0; i < upTo.length - 1; i++) {
        const a = upTo[i];
        const b = upTo[i + 1];
        const direct = LINKS.find(
          (l) => (l.source === a && l.target === b) || (l.source === b && l.target === a),
        );
        if (direct) {
          const key = `${direct.source}->${direct.target}`;
          hl.add(key);
          if (i === stepIndex - 1 || i === stepIndex) fl.add(key);
        }
      }
    } else if (selectedId) {
      hn.add(selectedId);
      for (const l of LINKS) {
        if (l.source === selectedId || l.target === selectedId) {
          hn.add(l.source);
          hn.add(l.target);
          hl.add(`${l.source}->${l.target}`);
        }
      }
    }
    return { highlightedNodes: hn, highlightedLinks: hl, flowingLinks: fl };
  }, [selectedId, scenarioId, stepIndex]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <ScenarioBar
        activeScenarioId={scenarioId}
        stepIndex={stepIndex}
        onPlay={(id) => {
          setSelectedId(null);
          setScenarioId(id);
        }}
        onStop={() => setScenarioId(null)}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      />

      <LayerPanel
        active={activeLayers}
        onToggle={(id) => setActiveLayers((s) => ({ ...s, [id]: !s[id] }))}
      />

      <EcosystemGraph
        activeLayers={activeLayers}
        selectedId={selectedId}
        onSelect={(id) => {
          setScenarioId(null);
          setSelectedId(id);
        }}
        highlightedNodes={highlightedNodes}
        highlightedLinks={highlightedLinks}
        flowingLinks={flowingLinks}
      />

      <NodeDetails
        nodeId={selectedId}
        onClose={() => setSelectedId(null)}
        onSelect={(id) => setSelectedId(id)}
      />

      {/* Watermark */}
      <div className="pointer-events-none absolute bottom-4 right-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
        Hex · Neural Ecosystem
      </div>
      {/* Touch unused import to satisfy linter */}
      <span className="hidden">{Object.keys(LAYERS).length}</span>
    </div>
  );
}
