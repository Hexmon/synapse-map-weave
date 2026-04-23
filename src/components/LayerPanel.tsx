import { LAYERS, type LayerId } from "@/lib/ecosystem-data";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  active: Record<LayerId, boolean>;
  onToggle: (id: LayerId) => void;
}

export function LayerPanel({ active, onToggle }: Props) {
  return (
    <aside className="absolute left-4 top-20 z-20 w-[260px] rounded-xl border border-border bg-card/85 p-4 backdrop-blur-xl">
      <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        System Layers
      </h3>
      <div className="space-y-1.5">
        {(Object.keys(LAYERS) as LayerId[]).map((id) => {
          const isOn = active[id];
          const layer = LAYERS[id];
          return (
            <button
              key={id}
              onClick={() => onToggle(id)}
              className="flex w-full items-center gap-3 rounded-lg border border-transparent px-2.5 py-2 text-left transition hover:bg-muted/50"
              style={{
                borderColor: isOn ? `color-mix(in oklab, ${layer.color} 35%, transparent)` : "transparent",
                background: isOn ? `color-mix(in oklab, ${layer.color} 8%, transparent)` : undefined,
              }}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{
                  background: isOn ? layer.color : "transparent",
                  border: `2px solid ${layer.color}`,
                  boxShadow: isOn ? `0 0 10px ${layer.color}` : "none",
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground">{layer.label}</div>
                <div className="truncate text-[11px] text-muted-foreground">{layer.description}</div>
              </div>
              {isOn ? (
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <EyeOff className="h-3.5 w-3.5 text-muted-foreground/50" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}