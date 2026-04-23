export type LayerId = "infra" | "connect" | "intel" | "security" | "ops";

export interface EcoNode {
  id: string;
  label: string;
  layer: LayerId;
  description: string;
  features: string[];
  role: string;
  /** Lucide icon name used to render node visually */
  icon: string;
  /** Short tagline shown on hover and in panel hero */
  tagline?: string;
  /** Hardware / software specs presented to clients */
  specs?: { label: string; value: string }[];
  /** Step-by-step setup guide for installation team */
  setup?: string[];
  /** Real-world KPIs / outcomes used in client presentation */
  kpis?: { label: string; value: string }[];
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
    icon: "BrainCircuit",
    tagline: "AI orchestrator that thinks for the whole site.",
    specs: [
      { label: "Inference latency", value: "< 80 ms p95" },
      { label: "Concurrent streams", value: "256 channels" },
      { label: "Models", value: "Vision + LLM + Policy" },
      { label: "HA mode", value: "Active-active dual node" },
    ],
    setup: [
      "Rack 2× orchestrator appliances in the core zone (1U each).",
      "Bond to GPU cluster over 25 GbE; assign dedicated VLAN 'BRAIN'.",
      "Pair with QRNG for key seeding and TLS fabric onboarding.",
      "Load policy pack (fire, intrusion, crowd, network) via Darshan UI.",
      "Run end-to-end smoke test using built-in scenario simulator.",
    ],
    kpis: [
      { label: "Decision time", value: "1.2 s avg" },
      { label: "Uptime SLA", value: "99.99%" },
    ],
    angle: 0,
    radius: 0,
    isBrain: true,
  },

  // Intelligence layer (inner ring)
  { id: "darshan", label: "Darshan (Hex Sign)", layer: "intel",
    description: "Centralized content & signage management driving every screen and kiosk.",
    features: ["Live content push", "Scheduling", "Emergency overrides", "Multi-screen sync"],
    role: "Pushes contextual content to displays in response to brain decisions.",
    icon: "MonitorPlay",
    tagline: "One control room for every pixel on site.",
    specs: [
      { label: "Endpoints", value: "Up to 5,000 screens" },
      { label: "Sync drift", value: "< 40 ms" },
      { label: "Formats", value: "HTML5, MP4, RTSP, HLS" },
    ],
    setup: [
      "Provision Darshan controller VM (8 vCPU / 16 GB).",
      "Register each LED wall and kiosk via QR pairing flow.",
      "Upload brand kit + emergency template pack.",
      "Configure brain webhook for incident-driven overrides.",
    ],
    kpis: [
      { label: "Screens managed", value: "Centrally" },
      { label: "Override push", value: "< 2 s site-wide" },
    ],
    angle: 120, radius: 0.18 },
  { id: "hexcam", label: "Vyracam / HexCam", layer: "intel",
    description: "AI vision pipeline detecting events: fire, intrusion, crowd density, anomalies.",
    features: ["Object detection", "Event classification", "Edge inference", "Low-latency stream"],
    role: "Eyes of the ecosystem — feeds detections into the brain.",
    icon: "Eye",
    tagline: "Computer-vision brain that watches every camera.",
    specs: [
      { label: "Models", value: "YOLO v8, FireNet, CrowdNet" },
      { label: "Throughput", value: "120 FPS aggregate" },
      { label: "Detection accuracy", value: "98.4% (fire) / 96% (intrusion)" },
    ],
    setup: [
      "Deploy HexCam workers on GPU nodes (one per 16 cameras).",
      "Auto-discover cameras over LTE/ONVIF.",
      "Calibrate detection zones per camera in HexCam UI.",
      "Route events to brain via signed gRPC channel.",
    ],
    kpis: [
      { label: "False positives", value: "< 0.5%" },
      { label: "Time to detect", value: "< 900 ms" },
    ],
    angle: 240, radius: 0.18 },

  // Infrastructure (outer ring, bottom arc)
  { id: "gpu", label: "GPU Compute", layer: "infra",
    description: "High-density GPU servers running inference workloads for vision and AI.",
    features: ["CUDA cluster", "Model serving", "Auto-scaling"],
    role: "Powers the brain and HexCam inference.",
    icon: "Server",
    tagline: "The muscle behind every AI decision.",
    specs: [
      { label: "GPUs", value: "8× NVIDIA L40S per node" },
      { label: "Memory", value: "384 GB DDR5 / node" },
      { label: "Cooling", value: "Liquid-assisted, 28 °C inlet" },
    ],
    setup: [
      "Install GPU nodes in environment-controlled rack zone.",
      "Provision Kubernetes with NVIDIA operator + MIG profiles.",
      "Enroll into brain control plane via mTLS bootstrap.",
      "Validate with synthetic inference benchmark.",
    ],
    kpis: [
      { label: "GPU utilisation", value: "65–80%" },
      { label: "Cost / inference", value: "−42% vs cloud" },
    ],
    angle: 200, radius: 0.42 },
  { id: "cameras", label: "Smart Cameras", layer: "infra",
    description: "Perimeter and interior smart cameras with on-device pre-processing.",
    features: ["4K capture", "IR night vision", "Edge filtering"],
    role: "Raw sensory input layer for HexCam.",
    icon: "Camera",
    tagline: "Always-on eyes across the perimeter.",
    specs: [
      { label: "Resolution", value: "4K @ 30 FPS" },
      { label: "Night vision", value: "IR up to 60 m" },
      { label: "Power", value: "PoE+ (30 W)" },
      { label: "Rating", value: "IP67 vandal-proof" },
    ],
    setup: [
      "Mount cameras on perimeter masts and interior junctions.",
      "Wire to nearest PoE+ switch; auto-onboard via MDM.",
      "Bind SIM/eSIM to Private LTE for failover.",
      "Map each feed to HexCam detection zone.",
    ],
    kpis: [
      { label: "Coverage", value: "100% perimeter" },
      { label: "Mean stream uptime", value: "99.95%" },
    ],
    angle: 230, radius: 0.42 },
  { id: "led", label: "Active LED Walls", layer: "infra",
    description: "Large-format LED walls for command centers and public displays.",
    features: ["Pixel-mapped", "HDR", "Redundant controllers"],
    role: "Surface for Command Center and Darshan content.",
    icon: "Tv2",
    tagline: "Cinematic situational awareness wall.",
    specs: [
      { label: "Pitch", value: "P1.5 fine-pitch" },
      { label: "Brightness", value: "800 nits" },
      { label: "Refresh", value: "3,840 Hz" },
      { label: "Controllers", value: "N+1 redundant" },
    ],
    setup: [
      "Frame and assemble cabinets per pixel-map plan.",
      "Patch primary + backup controllers to network core.",
      "Calibrate brightness/colour with on-site colorimeter.",
      "Pair wall to Darshan and Command Center scenes.",
    ],
    kpis: [
      { label: "Color accuracy", value: "ΔE < 2" },
      { label: "Failover", value: "< 1 s" },
    ],
    angle: 310, radius: 0.42 },
  { id: "kiosks", label: "Smart Kiosks", layer: "infra",
    description: "Interactive kiosks for wayfinding, alerts and self-service.",
    features: ["Touch UI", "Emergency mode", "Remote managed"],
    role: "Public-facing endpoint controlled by Darshan.",
    icon: "Smartphone",
    tagline: "Self-service touchpoint for visitors.",
    specs: [
      { label: "Display", value: "32\" capacitive touch" },
      { label: "Compute", value: "ARM SoC, 8 GB RAM" },
      { label: "Connectivity", value: "LTE + Wi-Fi 6" },
    ],
    setup: [
      "Bolt kiosk to floor plate; connect to PoE++ or AC.",
      "Enroll into MDM with site profile.",
      "Pair to Darshan via QR; assign wayfinding map.",
      "Run accessibility & touch calibration test.",
    ],
    kpis: [
      { label: "Daily interactions", value: "1.2k avg" },
      { label: "Emergency switch-over", value: "< 1 s" },
    ],
    angle: 340, radius: 0.42 },
  { id: "network-hw", label: "Network Hardware", layer: "infra",
    description: "Switches, routers and OEM gateways forming the physical fabric.",
    features: ["L2/L3", "Redundant paths", "PoE+"],
    role: "Wire-level backbone for every device.",
    icon: "Network",
    tagline: "The wired backbone holding it all together.",
    specs: [
      { label: "Core switches", value: "100 GbE spine" },
      { label: "Access switches", value: "25 GbE / PoE++" },
      { label: "Topology", value: "Spine-leaf, dual home" },
    ],
    setup: [
      "Rack and stack core + access switches in MDF/IDFs.",
      "Run fiber spine; copper PoE++ to edge devices.",
      "Push baseline config from NOC automation.",
      "Verify L2/L3 reachability and STP convergence.",
    ],
    kpis: [
      { label: "Convergence", value: "< 200 ms" },
      { label: "Port availability", value: "99.99%" },
    ],
    angle: 170, radius: 0.42 },

  // Connectivity
  { id: "lte", label: "Private LTE", layer: "connect",
    description: "Dedicated cellular network binding all infrastructure into one secure fabric.",
    features: ["Sub-10ms latency", "Carrier-grade", "SIM-based auth"],
    role: "Carries every packet between layers.",
    icon: "Radio",
    tagline: "Your own private mobile network — no carrier in the loop.",
    specs: [
      { label: "Spectrum", value: "CBRS / Band 48" },
      { label: "Latency", value: "< 10 ms" },
      { label: "Coverage", value: "Up to 5 km / cell" },
      { label: "Devices", value: "Up to 1,000 SIMs" },
    ],
    setup: [
      "Site-survey for radio placement; install small cells.",
      "Stand up EPC/5GC core appliance in data room.",
      "Provision SIMs and bind to device whitelist.",
      "Run drive-test to verify coverage map.",
    ],
    kpis: [
      { label: "Avg latency", value: "8 ms" },
      { label: "Packet loss", value: "< 0.1%" },
    ],
    angle: 90, radius: 0.32 },

  // Security
  { id: "qrng", label: "PQC QRNG", layer: "security",
    description: "Post-quantum cryptography seeded by a quantum random number generator.",
    features: ["True entropy", "PQC algorithms", "Key rotation"],
    role: "Roots all cryptographic keys in the system.",
    icon: "Atom",
    tagline: "Quantum-grade entropy. Future-proof keys.",
    specs: [
      { label: "Entropy rate", value: "1 Gbps true random" },
      { label: "Algorithms", value: "Kyber, Dilithium, Falcon" },
      { label: "Form factor", value: "1U HSM appliance" },
    ],
    setup: [
      "Install QRNG appliance in secure rack with tamper seals.",
      "Bond to TLS fabric as root entropy source.",
      "Define key-rotation policy (default 24 h).",
      "Audit logs streamed to SOC SIEM.",
    ],
    kpis: [
      { label: "Key rotation", value: "Daily" },
      { label: "PQ readiness", value: "100%" },
    ],
    angle: 30, radius: 0.32 },
  { id: "tls", label: "TLS Fabric", layer: "security",
    description: "TLS termination and mutual auth across every service hop.",
    features: ["mTLS", "Cert automation", "Cipher policy"],
    role: "Encrypts every connection end-to-end.",
    icon: "Lock",
    tagline: "Mutual TLS on every hop. No plaintext anywhere.",
    specs: [
      { label: "Protocol", value: "TLS 1.3 + PQC hybrid" },
      { label: "Cert lifetime", value: "24 h auto-rotated" },
      { label: "Cipher policy", value: "Modern profile only" },
    ],
    setup: [
      "Deploy TLS terminators alongside core switches.",
      "Bind to QRNG as entropy + key issuer.",
      "Enroll every service via SPIFFE identities.",
      "Validate with mTLS handshake test suite.",
    ],
    kpis: [
      { label: "Handshake p95", value: "12 ms" },
      { label: "Cert incidents", value: "0 / quarter" },
    ],
    angle: 60, radius: 0.42 },
  { id: "mdm", label: "MDM", layer: "security",
    description: "Mobile Device Management for kiosks, cameras and field devices.",
    features: ["Remote wipe", "Policy push", "Compliance"],
    role: "Hardens every endpoint in the fleet.",
    icon: "ShieldCheck",
    tagline: "Lock down every endpoint, from anywhere.",
    specs: [
      { label: "Devices managed", value: "Cameras, kiosks, tablets" },
      { label: "Compliance", value: "CIS L1 baseline" },
      { label: "Push latency", value: "< 30 s site-wide" },
    ],
    setup: [
      "Stand up MDM control plane (VM or SaaS).",
      "Enroll devices via zero-touch provisioning.",
      "Apply baseline policy + app whitelist.",
      "Configure remote wipe and geo-fence rules.",
    ],
    kpis: [
      { label: "Compliance rate", value: "100%" },
      { label: "MTTR (lost device)", value: "< 5 min" },
    ],
    angle: 0, radius: 0.42 },

  // Operations
  { id: "noc", label: "NOC", layer: "ops",
    description: "Network Operations Center — monitors uptime, latency and health.",
    features: ["Live topology", "SLA dashboards", "Incident routing"],
    role: "Keeps the network green.",
    icon: "Activity",
    tagline: "24×7 eyes on every link, every hop.",
    specs: [
      { label: "Coverage", value: "24×7×365" },
      { label: "Tooling", value: "Grafana, Prom, NetBox" },
      { label: "SLA", value: "P1 ack < 5 min" },
    ],
    setup: [
      "Provision NOC dashboards from monitor data sources.",
      "Configure runbooks per incident class.",
      "Integrate with paging (PagerDuty/Opsgenie).",
      "Run game-day to validate response times.",
    ],
    kpis: [
      { label: "MTTA", value: "3 min" },
      { label: "Network uptime", value: "99.99%" },
    ],
    angle: 110, radius: 0.42 },
  { id: "soc", label: "SOC", layer: "ops",
    description: "Security Operations Center — monitors threats and anomalies.",
    features: ["SIEM", "Threat hunt", "Forensics"],
    role: "Responds to security events from the brain.",
    icon: "ShieldAlert",
    tagline: "Threat hunters watching the brain's signals.",
    specs: [
      { label: "SIEM", value: "Elastic / Splunk" },
      { label: "Detections", value: "MITRE ATT&CK aligned" },
      { label: "Retention", value: "12 months hot" },
    ],
    setup: [
      "Wire log sources (brain, MDM, TLS, cameras) into SIEM.",
      "Deploy detection rule pack and tune for site.",
      "Build playbooks per scenario (intrusion, malware, fraud).",
      "Stage red-team exercise to validate.",
    ],
    kpis: [
      { label: "MTTD", value: "< 2 min" },
      { label: "Incidents auto-triaged", value: "78%" },
    ],
    angle: 140, radius: 0.42 },
  { id: "command", label: "Command Center", layer: "ops",
    description: "Unified command center with active LED walls for situational awareness.",
    features: ["Multi-feed", "Scenario playbooks", "Voice ops"],
    role: "Where humans take action.",
    icon: "LayoutDashboard",
    tagline: "The bridge — humans + AI working in concert.",
    specs: [
      { label: "Operator stations", value: "6–24 seats" },
      { label: "Video wall", value: "Up to 12K canvas" },
      { label: "Comms", value: "Voice, radio, paging" },
    ],
    setup: [
      "Design operator console layout and sightlines.",
      "Bind LED wall scenes to scenario playbooks.",
      "Integrate radio + paging via SIP gateway.",
      "Train operators with simulator scenarios.",
    ],
    kpis: [
      { label: "Operator response", value: "< 30 s" },
      { label: "Scenario coverage", value: "20+ playbooks" },
    ],
    angle: 70, radius: 0.32 },
  { id: "monitor", label: "Network Monitor", layer: "ops",
    description: "Real-time network monitoring system feeding NOC dashboards.",
    features: ["Flow analytics", "Anomaly alerts", "Topology map"],
    role: "Telemetry source for NOC.",
    icon: "LineChart",
    tagline: "Telemetry firehose, distilled into signals.",
    specs: [
      { label: "Telemetry", value: "sFlow, SNMP, gNMI" },
      { label: "Resolution", value: "1 s metric polling" },
      { label: "ML anomaly", value: "Per-link baselines" },
    ],
    setup: [
      "Enable telemetry exporters on switches & LTE core.",
      "Tune anomaly baselines after 7-day learning window.",
      "Wire alerts into NOC paging.",
      "Publish topology map to Command Center wall.",
    ],
    kpis: [
      { label: "Anomalies caught early", value: "92%" },
      { label: "False alarm rate", value: "< 3%" },
    ],
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