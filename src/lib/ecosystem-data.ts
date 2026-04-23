export type LayerId = "infra" | "connect" | "intel" | "security" | "ops";

export interface EcoNode {
  id: string;
  label: string;
  layer: LayerId;
  description: string;
  features: string[];
  role: string;
  /** Polar position: angle in degrees, radius 0..1 (relative to canvas) */
  angle: number;
  radius: number;
  isBrain?: boolean;
}

export interface EcoLink {
  source: string;
  target: string;
}

export const LAYERS: Record<LayerId, { label: string; color: string; description: string }> = {
  infra: {
    label: "Infrastructure",
    color: "var(--layer-infra)",
    description: "Always-on physical foundation: compute, cameras, kiosks, networking.",
  },
  connect: {
    label: "Connectivity",
    color: "var(--layer-connect)",
    description: "Private LTE binds every device into one unified network.",
  },
  intel: {
    label: "Intelligence",
    color: "var(--layer-intel)",
    description: "The Smart Brain — AI orchestrator coordinating products in real time.",
  },
  security: {
    label: "Security",
    color: "var(--layer-security)",
    description: "Post-quantum cryptography, TLS and MDM wrap every signal.",
  },
  ops: {
    label: "Operations",
    color: "var(--layer-ops)",
    description: "NOC, SOC and Command Center keep humans in the loop.",
  },
};

export const BRAIN_ID = "brain";

export const NODES: EcoNode[] = [
  // Brain (center)
  {
    id: BRAIN_ID,
    label: "Smart Brain",
    layer: "intel",
    description: "The AI orchestrator at the heart of the ecosystem. Fuses signals from every layer and triggers responses.",
    features: ["Multi-modal inference", "Event routing", "Policy engine", "Real-time decisions"],
    role: "Central orchestrator — receives, decides, dispatches.",
    angle: 0,
    radius: 0,
    isBrain: true,
  },

  // Intelligence layer (inner ring)
  { id: "darshan", label: "Darshan (Hex Sign)", layer: "intel",
    description: "Centralized content & signage management driving every screen and kiosk.",
    features: ["Live content push", "Scheduling", "Emergency overrides", "Multi-screen sync"],
    role: "Pushes contextual content to displays in response to brain decisions.",
    angle: 120, radius: 0.18 },
  { id: "hexcam", label: "Vyracam / HexCam", layer: "intel",
    description: "AI vision pipeline detecting events: fire, intrusion, crowd density, anomalies.",
    features: ["Object detection", "Event classification", "Edge inference", "Low-latency stream"],
    role: "Eyes of the ecosystem — feeds detections into the brain.",
    angle: 240, radius: 0.18 },

  // Infrastructure (outer ring, bottom arc)
  { id: "gpu", label: "GPU Compute", layer: "infra",
    description: "High-density GPU servers running inference workloads for vision and AI.",
    features: ["CUDA cluster", "Model serving", "Auto-scaling"],
    role: "Powers the brain and HexCam inference.",
    angle: 200, radius: 0.42 },
  { id: "cameras", label: "Smart Cameras", layer: "infra",
    description: "Perimeter and interior smart cameras with on-device pre-processing.",
    features: ["4K capture", "IR night vision", "Edge filtering"],
    role: "Raw sensory input layer for HexCam.",
    angle: 230, radius: 0.42 },
  { id: "led", label: "Active LED Walls", layer: "infra",
    description: "Large-format LED walls for command centers and public displays.",
    features: ["Pixel-mapped", "HDR", "Redundant controllers"],
    role: "Surface for Command Center and Darshan content.",
    angle: 310, radius: 0.42 },
  { id: "kiosks", label: "Smart Kiosks", layer: "infra",
    description: "Interactive kiosks for wayfinding, alerts and self-service.",
    features: ["Touch UI", "Emergency mode", "Remote managed"],
    role: "Public-facing endpoint controlled by Darshan.",
    angle: 340, radius: 0.42 },
  { id: "network-hw", label: "Network Hardware", layer: "infra",
    description: "Switches, routers and OEM gateways forming the physical fabric.",
    features: ["L2/L3", "Redundant paths", "PoE+"],
    role: "Wire-level backbone for every device.",
    angle: 170, radius: 0.42 },

  // Connectivity
  { id: "lte", label: "Private LTE", layer: "connect",
    description: "Dedicated cellular network binding all infrastructure into one secure fabric.",
    features: ["Sub-10ms latency", "Carrier-grade", "SIM-based auth"],
    role: "Carries every packet between layers.",
    angle: 90, radius: 0.32 },

  // Security
  { id: "qrng", label: "PQC QRNG", layer: "security",
    description: "Post-quantum cryptography seeded by a quantum random number generator.",
    features: ["True entropy", "PQC algorithms", "Key rotation"],
    role: "Roots all cryptographic keys in the system.",
    angle: 30, radius: 0.32 },
  { id: "tls", label: "TLS Fabric", layer: "security",
    description: "TLS termination and mutual auth across every service hop.",
    features: ["mTLS", "Cert automation", "Cipher policy"],
    role: "Encrypts every connection end-to-end.",
    angle: 60, radius: 0.42 },
  { id: "mdm", label: "MDM", layer: "security",
    description: "Mobile Device Management for kiosks, cameras and field devices.",
    features: ["Remote wipe", "Policy push", "Compliance"],
    role: "Hardens every endpoint in the fleet.",
    angle: 0, radius: 0.42 },

  // Operations
  { id: "noc", label: "NOC", layer: "ops",
    description: "Network Operations Center — monitors uptime, latency and health.",
    features: ["Live topology", "SLA dashboards", "Incident routing"],
    role: "Keeps the network green.",
    angle: 110, radius: 0.42 },
  { id: "soc", label: "SOC", layer: "ops",
    description: "Security Operations Center — monitors threats and anomalies.",
    features: ["SIEM", "Threat hunt", "Forensics"],
    role: "Responds to security events from the brain.",
    angle: 140, radius: 0.42 },
  { id: "command", label: "Command Center", layer: "ops",
    description: "Unified command center with active LED walls for situational awareness.",
    features: ["Multi-feed", "Scenario playbooks", "Voice ops"],
    role: "Where humans take action.",
    angle: 70, radius: 0.32 },
  { id: "monitor", label: "Network Monitor", layer: "ops",
    description: "Real-time network monitoring system feeding NOC dashboards.",
    features: ["Flow analytics", "Anomaly alerts", "Topology map"],
    role: "Telemetry source for NOC.",
    angle: 150, radius: 0.32 },
];

export const LINKS: EcoLink[] = [
  // Brain to intelligence products
  { source: BRAIN_ID, target: "darshan" },
  { source: BRAIN_ID, target: "hexcam" },
  // Brain to security & ops
  { source: BRAIN_ID, target: "qrng" },
  { source: BRAIN_ID, target: "command" },
  { source: BRAIN_ID, target: "lte" },
  // Intelligence to infra
  { source: "hexcam", target: "cameras" },
  { source: "hexcam", target: "gpu" },
  { source: "darshan", target: "kiosks" },
  { source: "darshan", target: "led" },
  // Connectivity binds
  { source: "lte", target: "network-hw" },
  { source: "lte", target: "cameras" },
  { source: "lte", target: "kiosks" },
  { source: "lte", target: "led" },
  { source: "lte", target: "gpu" },
  // Security wraps
  { source: "qrng", target: "tls" },
  { source: "tls", target: "lte" },
  { source: "mdm", target: "kiosks" },
  { source: "mdm", target: "cameras" },
  // Ops
  { source: "noc", target: "monitor" },
  { source: "monitor", target: "lte" },
  { source: "soc", target: "hexcam" },
  { source: "command", target: "led" },
  { source: "command", target: "darshan" },
];

export interface Scenario {
  id: string;
  name: string;
  description: string;
  /** Ordered chain of node ids that light up */
  steps: { node: string; note: string }[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: "fire",
    name: "Fire Hazard",
    description: "HexCam detects fire and the ecosystem coordinates an evacuation response.",
    steps: [
      { node: "cameras", note: "Smart camera captures smoke + flame signature." },
      { node: "hexcam", note: "HexCam classifies event as FIRE with high confidence." },
      { node: "lte", note: "Event streamed over Private LTE." },
      { node: "tls", note: "Payload encrypted via TLS, keys seeded by QRNG." },
      { node: BRAIN_ID, note: "Smart Brain triggers emergency policy." },
      { node: "darshan", note: "Darshan pushes evacuation content to displays." },
      { node: "kiosks", note: "Kiosks show nearest fire exit routes." },
      { node: "led", note: "Command Center LED wall switches to incident view." },
      { node: "soc", note: "SOC dashboard raises a P1 alert." },
      { node: "noc", note: "NOC verifies network paths remain healthy." },
    ],
  },
  {
    id: "intrusion",
    name: "Perimeter Intrusion",
    description: "Unauthorized entry detected on perimeter cameras after-hours.",
    steps: [
      { node: "cameras", note: "Perimeter camera detects motion." },
      { node: "hexcam", note: "HexCam classifies as human intrusion." },
      { node: "lte", note: "Encrypted alert over Private LTE." },
      { node: BRAIN_ID, note: "Brain elevates threat level." },
      { node: "soc", note: "SOC analyst notified, live feed pinned." },
      { node: "command", note: "Command Center coordinates response." },
      { node: "led", note: "LED wall shows live perimeter map." },
    ],
  },
  {
    id: "outage",
    name: "Network Anomaly",
    description: "Latency spike detected on a network segment.",
    steps: [
      { node: "monitor", note: "Network monitor flags latency spike." },
      { node: "noc", note: "NOC sees segment degrade." },
      { node: "lte", note: "LTE failover engaged." },
      { node: BRAIN_ID, note: "Brain reroutes critical workloads." },
      { node: "gpu", note: "GPU inference rebalanced." },
      { node: "command", note: "Command Center informed, no public impact." },
    ],
  },
];