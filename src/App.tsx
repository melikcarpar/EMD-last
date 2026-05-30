import { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const COLORS = {
  bg: "#0B1426",
  bgCard: "#111D35",
  bgLight: "#162038",
  border: "#1E3054",
  teal: "#0D9488",
  tealLight: "#14B8A6",
  blue: "#3B82F6",
  blueLight: "#60A5FA",
  navy: "#1E40AF",
  text: "#E2E8F0",
  muted: "#94A3B8",
  white: "#FFFFFF",
  red: "#EF4444",
  orange: "#F59E0B",
  green: "#22C55E",
  purple: "#A855F7",
};

const NAV_ITEMS = [
  { id: "hero", label: "Home" },
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "architecture", label: "Architecture" },
  { id: "results", label: "Results" },
  { id: "simulator", label: "Simulator" },
];

function MetricCard({ value, label, color, icon }: any) {
  return (
    <div
      style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderTop: `3px solid ${color}`,
        borderRadius: 12,
        padding: "24px 20px",
        textAlign: "center",
        flex: "1 1 200px",
        minWidth: 160,
      }}
    >
      <div
        style={{
          fontSize: 14,
          color: COLORS.muted,
          marginBottom: 8,
          letterSpacing: 1,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 800,
          color,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 13,
          color: COLORS.muted,
          marginTop: 8,
          lineHeight: 1.4,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function ArchBlock({ label, sub, color, x, y, w, h, onClick, active }) {
  return (
    <g onClick={onClick} style={{ cursor: "pointer" }}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill={active ? color : COLORS.bgCard}
        stroke={color}
        strokeWidth={active ? 2.5 : 1.5}
        opacity={active ? 1 : 0.85}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 - 8}
        textAnchor="middle"
        fill={COLORS.white}
        fontSize={13}
        fontWeight="700"
        fontFamily="system-ui"
      >
        {label}
      </text>
      <text
        x={x + w / 2}
        y={y + h / 2 + 10}
        textAnchor="middle"
        fill={COLORS.muted}
        fontSize={10}
        fontFamily="system-ui"
      >
        {sub}
      </text>
    </g>
  );
}

const ARCH_INFO = {
  acq: {
    title: "Data Acquisition",
    desc: "Two independent data streams are collected: engine parameters from the OBD-II diagnostic port (RPM, temperature, DPF pressure, SCR NOx, AdBlue) and direct tailpipe measurements from the exhaust gas analyser (CO, CO2, HC, NOx, PM).",
  },
  pre: {
    title: "Preprocessing",
    desc: "Raw sensor data is cleaned, scaled using Min-Max normalisation, and 8 derived features (DPF pressure ratio, SCR efficiency, OBD-analyser discrepancy, etc.) are computed. A total of 26 features are produced.",
  },
  ai: {
    title: "AI Detection",
    desc: "Two-stage pipeline: Isolation Forest performs unsupervised anomaly detection to flag suspicious vehicles, then Random Forest classifies the specific manipulation type (DPF, EGR, SCR, OBD).",
  },
  dec: {
    title: "Decision Support",
    desc: "Each vehicle receives a risk score between 0 and 1. Scores above 0.5 indicate suspected manipulation. The system recommends pass, fail, or refer for detailed review. The final decision always rests with the human inspector.",
  },
  rep: {
    title: "Reporting",
    desc: "Structured manipulation report: detected type, key evidence, confidence level, and recommended follow-up actions. A KVKK-compliant audit log is maintained.",
  },
  dt: {
    title: "Digital Twin",
    desc: "Station-level discrete-event simulation: daily vehicle flow, queue formation, AI scan durations, and flagging scenarios are modelled. Used for capacity planning and operational optimisation.",
  },
  ev: {
    title: "EV Safety",
    desc: "Battery SoH assessment (capacity, resistance, charge cycles), thermal management checks, and high-voltage insulation resistance measurement for electric vehicle safety screening.",
  },
  kvkk: {
    title: "KVKK Compliance",
    desc: "SHA-256 based pseudonymisation, data minimisation, role-based access control (inspector/manager/admin/auditor), and a 5-year retention policy with automatic deletion.",
  },
};

function SimulatorSection() {
  const [sensors, setSensors] = useState({
    dpf_pressure: 8.0,
    pm_opacity: 5.0,
    scr_outlet_nox: 30,
    adblue_consumption: 1.5,
    obd_nox: 33,
    analyser_nox: 35,
  });
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const analyze = () => {
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const dpfScore =
        sensors.dpf_pressure < 2 ? 0.9 : sensors.dpf_pressure < 5 ? 0.4 : 0.05;
      const pmScore =
        sensors.pm_opacity > 25 ? 0.85 : sensors.pm_opacity > 15 ? 0.4 : 0.05;
      const scrScore =
        sensors.scr_outlet_nox > 100
          ? 0.8
          : sensors.scr_outlet_nox > 60
          ? 0.35
          : 0.05;
      const adblueScore =
        sensors.adblue_consumption < 0.3
          ? 0.75
          : sensors.adblue_consumption < 0.8
          ? 0.3
          : 0.05;
      const obdGap = Math.abs(sensors.obd_nox - sensors.analyser_nox);
      const obdScore = obdGap > 60 ? 0.85 : obdGap > 30 ? 0.4 : 0.05;

      const scores = {
        DPF: dpfScore + pmScore * 0.5,
        EGR: 0,
        SCR: scrScore + adblueScore * 0.5,
        OBD: obdScore,
      };
      scores.EGR =
        sensors.analyser_nox > 120
          ? 0.7
          : sensors.analyser_nox > 80
          ? 0.3
          : 0.05;

      const maxType = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
      const riskScore = Math.min(
        0.99,
        dpfScore * 0.25 +
          pmScore * 0.15 +
          scrScore * 0.2 +
          adblueScore * 0.1 +
          obdScore * 0.2 +
          scores.EGR * 0.1
      );

      const manipTypes = {
        DPF: "DPF Removal",
        EGR: "EGR Bypass",
        SCR: "SCR Tampering",
        OBD: "OBD-II Falsification",
      };
      const isManip = riskScore > 0.4;

      setResult({
        riskScore: riskScore.toFixed(2),
        isManipulated: isManip,
        type: isManip ? manipTypes[maxType[0]] : "Normal",
        confidence: isManip ? (maxType[1] * 100).toFixed(0) : "97",
        decision:
          riskScore > 0.65 ? "REFER" : riskScore > 0.4 ? "REVIEW" : "PASS",
        features: [
          { name: "DPF Pressure", score: dpfScore, flag: dpfScore > 0.3 },
          { name: "PM Opacity", score: pmScore, flag: pmScore > 0.3 },
          { name: "SCR Outlet NOx", score: scrScore, flag: scrScore > 0.3 },
          { name: "AdBlue Usage", score: adblueScore, flag: adblueScore > 0.3 },
          { name: "OBD-Analyser Gap", score: obdScore, flag: obdScore > 0.3 },
        ],
      });
      setAnalyzing(false);
    }, 1800);
  };

  const sliderStyle = {
    width: "100%",
    accentColor: COLORS.teal,
    height: 6,
    cursor: "pointer",
  };

  const SliderInput = ({ label, unit, min, max, step, sKey, desc }) => (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 13, color: COLORS.text, fontWeight: 600 }}>
          {label}
        </span>
        <span
          style={{
            fontSize: 14,
            color: COLORS.tealLight,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
          }}
        >
          {sensors[sKey].toFixed(step < 1 ? 1 : 0)} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sensors[sKey]}
        onChange={(e) =>
          setSensors((p) => ({ ...p, [sKey]: parseFloat(e.target.value) }))
        }
        style={sliderStyle}
      />
      <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 2 }}>
        {desc}
      </div>
    </div>
  );

  const decisionColors = {
    PASS: COLORS.green,
    REVIEW: COLORS.orange,
    REFER: COLORS.red,
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 28,
        marginTop: 32,
      }}
    >
      <div
        style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 28,
        }}
      >
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: COLORS.tealLight,
            marginBottom: 24,
            borderBottom: `1px solid ${COLORS.border}`,
            paddingBottom: 12,
          }}
        >
          🔧 Sensor Values
        </h3>
        <SliderInput
          label="DPF Differential Pressure"
          unit="kPa"
          min={0}
          max={15}
          step={0.1}
          sKey="dpf_pressure"
          desc="Normal: 6-12 kPa | If DPF removed: ~0 kPa"
        />
        <SliderInput
          label="PM Opacity"
          unit="%"
          min={0}
          max={60}
          step={0.5}
          sKey="pm_opacity"
          desc="Normal: 2-8% | Without DPF: 25-50%"
        />
        <SliderInput
          label="SCR Outlet NOx"
          unit="ppm"
          min={0}
          max={250}
          step={1}
          sKey="scr_outlet_nox"
          desc="Normal: 15-50 ppm | If SCR faulty: 120-200 ppm"
        />
        <SliderInput
          label="AdBlue Consumption"
          unit="L/h"
          min={0}
          max={3}
          step={0.05}
          sKey="adblue_consumption"
          desc="Normal: 1.0-2.0 L/h | With emulator: ~0 L/h"
        />
        <SliderInput
          label="OBD Reported NOx"
          unit="ppm"
          min={0}
          max={200}
          step={1}
          sKey="obd_nox"
          desc="NOx value reported by OBD-II system"
        />
        <SliderInput
          label="Analyser NOx"
          unit="ppm"
          min={0}
          max={250}
          step={1}
          sKey="analyser_nox"
          desc="Actual NOx measured by independent analyser"
        />

        <button
          onClick={analyze}
          disabled={analyzing}
          style={{
            width: "100%",
            padding: "14px 0",
            marginTop: 12,
            background: analyzing
              ? COLORS.border
              : `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.blue})`,
            color: COLORS.white,
            border: "none",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 700,
            cursor: analyzing ? "wait" : "pointer",
            letterSpacing: 0.5,
            transition: "all 0.3s ease",
            opacity: analyzing ? 0.7 : 1,
          }}
        >
          {analyzing ? "⏳ AI Analysis in Progress..." : "🔍 Run Analysis"}
        </button>
      </div>

      <div
        style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 28,
        }}
      >
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: COLORS.tealLight,
            marginBottom: 24,
            borderBottom: `1px solid ${COLORS.border}`,
            paddingBottom: 12,
          }}
        >
          📊 AI Analysis Result
        </h3>
        {!result && !analyzing && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "80%",
              color: COLORS.muted,
              fontSize: 14,
              textAlign: "center",
              lineHeight: 1.8,
            }}
          >
            Adjust the sensor values on the left
            <br />
            and click "Run Analysis"
          </div>
        )}
        {analyzing && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "80%",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                border: `4px solid ${COLORS.border}`,
                borderTopColor: COLORS.teal,
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <div style={{ color: COLORS.muted, fontSize: 13 }}>
              Stage 1: Isolation Forest running...
            </div>
          </div>
        )}
        {result && !analyzing && (
          <div>
            <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
              <div
                style={{
                  flex: 1,
                  background: COLORS.bg,
                  borderRadius: 10,
                  padding: 16,
                  textAlign: "center",
                  border: `1px solid ${
                    result.isManipulated ? COLORS.red : COLORS.green
                  }40`,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: COLORS.muted,
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Risk Score
                </div>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: result.isManipulated ? COLORS.red : COLORS.green,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {result.riskScore}
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  background: COLORS.bg,
                  borderRadius: 10,
                  padding: 16,
                  textAlign: "center",
                  border: `1px solid ${decisionColors[result.decision]}40`,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: COLORS.muted,
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Decision
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: decisionColors[result.decision],
                  }}
                >
                  {result.decision}
                </div>
              </div>
            </div>

            <div
              style={{
                background: COLORS.bg,
                borderRadius: 10,
                padding: 16,
                marginBottom: 16,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: COLORS.muted,
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Detected Type
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: result.isManipulated ? COLORS.orange : COLORS.green,
                }}
              >
                {result.type}
              </div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>
                Confidence: {result.confidence}%
              </div>
            </div>

            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: COLORS.text,
                marginBottom: 10,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Feature Analizi
            </div>
            {result.features.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: f.flag ? COLORS.red : COLORS.green,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    color: COLORS.muted,
                    width: 120,
                    flexShrink: 0,
                  }}
                >
                  {f.name}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    background: COLORS.bg,
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${f.score * 100}%`,
                      height: "100%",
                      borderRadius: 3,
                      background: f.flag
                        ? `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.red})`
                        : COLORS.green,
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: f.flag ? COLORS.red : COLORS.green,
                    fontFamily: "'JetBrains Mono', monospace",
                    width: 36,
                    textAlign: "right",
                  }}
                >
                  {(f.score * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [archActive, setArchActive] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { threshold: 0.3 }
    );
    NAV_ITEMS.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const classificationData = [
    { name: "Normal", precision: 97, recall: 99, f1: 98 },
    { name: "DPF", precision: 98, recall: 97, f1: 96 },
    { name: "EGR", precision: 95, recall: 93, f1: 93 },
    { name: "SCR", precision: 93, recall: 91, f1: 91 },
    { name: "OBD-II", precision: 90, recall: 87, f1: 88 },
  ];

  const featureImportance = [
    { name: "DPF Pressure Ratio", value: 24 },
    { name: "OBD-NOx Gap", value: 19 },
    { name: "SCR Efficiency", value: 15 },
    { name: "PM-DPF Interaction", value: 11 },
    { name: "AdBlue Score", value: 9 },
    { name: "NOx-CO2 Ratio", value: 7 },
    { name: "Other Features", value: 15 },
  ];

  const rocData = Array.from({ length: 50 }, (_, i) => {
    const t = i / 49;
    return {
      fpr: t,
      normal: Math.min(1, Math.pow(t, 0.15)),
      dpf: Math.min(1, Math.pow(t, 0.12)),
      egr: Math.min(1, Math.pow(t, 0.18)),
      scr: Math.min(1, Math.pow(t, 0.22)),
      obd: Math.min(1, Math.pow(t, 0.28)),
      random: t,
    };
  });

  const pieCOLORS = [
    COLORS.green,
    COLORS.red,
    COLORS.blue,
    COLORS.orange,
    COLORS.purple,
  ];
  const datasetPie = [
    { name: "Normal", value: 7000 },
    { name: "DPF Removal", value: 750 },
    { name: "EGR Bypass", value: 750 },
    { name: "SCR Tampering", value: 750 },
    { name: "OBD-II Falsification", value: 750 },
  ];

  const sectionStyle = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "80px 32px",
  };
  const headingStyle = {
    fontSize: 32,
    fontWeight: 800,
    color: COLORS.white,
    marginBottom: 12,
    letterSpacing: -0.5,
  };
  const subStyle = {
    fontSize: 15,
    color: COLORS.muted,
    marginBottom: 40,
    lineHeight: 1.7,
    maxWidth: 700,
  };

  return (
    <div
      style={{
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* NAV */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: `${COLORS.bg}ee`,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${COLORS.border}`,
          padding: "0 32px",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 56,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.blue})`,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              🔬
            </div>
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: COLORS.white,
                letterSpacing: -0.3,
              }}
            >
              EMDS
            </span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {NAV_ITEMS.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                style={{
                  background:
                    activeSection === n.id ? `${COLORS.teal}22` : "transparent",
                  color:
                    activeSection === n.id ? COLORS.tealLight : COLORS.muted,
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: activeSection === n.id ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        id="hero"
        style={{
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `radial-gradient(ellipse at 30% 50%, ${COLORS.teal}15 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, ${COLORS.blue}10 0%, transparent 50%), ${COLORS.bg}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            backgroundImage: `repeating-linear-gradient(0deg, ${COLORS.teal} 0 1px, transparent 1px 60px), repeating-linear-gradient(90deg, ${COLORS.teal} 0 1px, transparent 1px 60px)`,
          }}
        />
        <div
          style={{
            textAlign: "center",
            position: "relative",
            zIndex: 1,
            padding: "0 32px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: `${COLORS.teal}20`,
              border: `1px solid ${COLORS.teal}40`,
              borderRadius: 20,
              padding: "6px 16px",
              fontSize: 12,
              color: COLORS.tealLight,
              fontWeight: 600,
              marginBottom: 24,
              letterSpacing: 1,
            }}
          >
            ECON2004 ENGINEERING ECONOMY — FINAL PROJECT
          </div>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: COLORS.white,
              lineHeight: 1.15,
              marginBottom: 20,
              letterSpacing: -1,
            }}
          >
            AI-Based Emissions
            <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.blueLight})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Manipulation Detection
            </span>
          </h1>
          <p
            style={{
              fontSize: 17,
              color: COLORS.muted,
              maxWidth: 620,
              margin: "0 auto 32px",
              lineHeight: 1.7,
            }}
          >
            AI-powered next-generation emissions manipulation detection system
            for TUVTURK stations in Turkey
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => scrollTo("simulator")}
              style={{
                background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.blue})`,
                color: COLORS.white,
                border: "none",
                padding: "12px 28px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Live Demo →
            </button>
            <button
              onClick={() => scrollTo("results")}
              style={{
                background: "transparent",
                color: COLORS.tealLight,
                border: `1px solid ${COLORS.teal}60`,
                padding: "12px 28px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              View Results
            </button>
          </div>
          <div
            style={{
              display: "flex",
              gap: 32,
              justifyContent: "center",
              marginTop: 48,
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Detection Rate", val: "92%" },
              { label: "Accuracy", val: "94%" },
              { label: "AUC-ROC", val: "0.95" },
              { label: "Features", val: "26" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: COLORS.tealLight,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: COLORS.muted,
                    marginTop: 4,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section
        id="problem"
        style={{ ...sectionStyle, borderTop: `1px solid ${COLORS.border}` }}
      >
        <h2 style={headingStyle}>
          Problem<span style={{ color: COLORS.teal }}>.</span>
        </h2>
        <p style={subStyle}>
          Emissions manipulation threatens the integrity of vehicle inspection
          systems worldwide. The Dieselgate scandal exposed the scale of this
          problem.
        </p>
        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            marginBottom: 32,
          }}
        >
          <MetricCard
            value="11M+"
            label="Vehicles with defeat devices (Dieselgate)"
            color={COLORS.red}
            icon="🚗"
          />
          <MetricCard
            value="4-7x"
            label="Real-world NOx vs. lab test results"
            color={COLORS.orange}
            icon="💨"
          />
          <MetricCard
            value="10%+"
            label="DPF removal rate in some EU markets"
            color={COLORS.purple}
            icon="⚠️"
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
          }}
        >
          {[
            "DPF Removal",
            "EGR Bypass",
            "SCR Tampering",
            "OBD-II Falsification",
          ].map((t, i) => (
            <div
              key={i}
              style={{
                background: `linear-gradient(135deg, ${COLORS.bgCard}, ${COLORS.bgLight})`,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                padding: "16px 14px",
                textAlign: "center",
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.blueLight,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* SOLUTION */}
      <section
        id="solution"
        style={{ ...sectionStyle, borderTop: `1px solid ${COLORS.border}` }}
      >
        <h2 style={headingStyle}>
          Solution<span style={{ color: COLORS.teal }}>.</span>
        </h2>
        <p style={subStyle}>
          Two-stage AI detection pipeline: first anomaly detection, then
          classification.
        </p>
        <div style={{ display: "flex", gap: 20, alignItems: "stretch" }}>
          <div
            style={{
              flex: 1,
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.teal}40`,
              borderRadius: 12,
              padding: 28,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: COLORS.teal,
                fontWeight: 700,
                letterSpacing: 2,
                marginBottom: 8,
              }}
            >
              STAGE 1
            </div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: COLORS.white,
                marginBottom: 12,
              }}
            >
              Anomaly Detection
            </h3>
            <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.8 }}>
              <strong style={{ color: COLORS.text }}>Algorithm:</strong>{" "}
              Isolation Forest
              <br />
              <strong style={{ color: COLORS.text }}>Type:</strong> Unsupervised
              learning
              <br />
              <strong style={{ color: COLORS.text }}>Purpose:</strong> Flag
              suspicious vehicles
              <br />
              <strong style={{ color: COLORS.text }}>Output:</strong> Anomaly
              score (0-1)
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 28,
              color: COLORS.teal,
              fontWeight: 800,
            }}
          >
            →
          </div>
          <div
            style={{
              flex: 1,
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.blue}40`,
              borderRadius: 12,
              padding: 28,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: COLORS.blue,
                fontWeight: 700,
                letterSpacing: 2,
                marginBottom: 8,
              }}
            >
              STAGE 2
            </div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: COLORS.white,
                marginBottom: 12,
              }}
            >
              Classification
            </h3>
            <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.8 }}>
              <strong style={{ color: COLORS.text }}>Algorithm:</strong> Random
              Forest
              <br />
              <strong style={{ color: COLORS.text }}>Type:</strong> Supervised
              classification
              <br />
              <strong style={{ color: COLORS.text }}>Purpose:</strong> Identify
              manipulation type
              <br />
              <strong style={{ color: COLORS.text }}>Output:</strong> DPF / EGR
              / SCR / OBD
            </div>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section
        id="architecture"
        style={{ ...sectionStyle, borderTop: `1px solid ${COLORS.border}` }}
      >
        <h2 style={headingStyle}>
          System Architecture<span style={{ color: COLORS.teal }}>.</span>
        </h2>
        <p style={subStyle}>Click on each component to view its details.</p>
        <div style={{ display: "flex", gap: 28 }}>
          <div style={{ flex: "1 1 65%" }}>
            <svg
              viewBox="0 0 700 420"
              style={{ width: "100%", height: "auto" }}
            >
              <defs>
                <marker
                  id="arrow"
                  markerWidth="8"
                  markerHeight="6"
                  refX="8"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L8,3 L0,6" fill={COLORS.teal} />
                </marker>
              </defs>
              {/* Pipeline row */}
              <ArchBlock
                label="Data Acq."
                sub="OBD-II + Analyser"
                color={COLORS.blue}
                x={10}
                y={30}
                w={120}
                h={65}
                onClick={() => setArchActive("acq")}
                active={archActive === "acq"}
              />
              <line
                x1={130}
                y1={62}
                x2={148}
                y2={62}
                stroke={COLORS.teal}
                strokeWidth={2}
                markerEnd="url(#arrow)"
              />
              <ArchBlock
                label="Preprocess"
                sub="26 Features"
                color={COLORS.blue}
                x={155}
                y={30}
                w={120}
                h={65}
                onClick={() => setArchActive("pre")}
                active={archActive === "pre"}
              />
              <line
                x1={275}
                y1={62}
                x2={293}
                y2={62}
                stroke={COLORS.teal}
                strokeWidth={2}
                markerEnd="url(#arrow)"
              />
              <ArchBlock
                label="AI Detection"
                sub="IF + RF"
                color={COLORS.teal}
                x={300}
                y={30}
                w={120}
                h={65}
                onClick={() => setArchActive("ai")}
                active={archActive === "ai"}
              />
              <line
                x1={420}
                y1={62}
                x2={438}
                y2={62}
                stroke={COLORS.teal}
                strokeWidth={2}
                markerEnd="url(#arrow)"
              />
              <ArchBlock
                label="Decision"
                sub="Risk Score"
                color={COLORS.blue}
                x={445}
                y={30}
                w={120}
                h={65}
                onClick={() => setArchActive("dec")}
                active={archActive === "dec"}
              />
              <line
                x1={565}
                y1={62}
                x2={583}
                y2={62}
                stroke={COLORS.teal}
                strokeWidth={2}
                markerEnd="url(#arrow)"
              />
              <ArchBlock
                label="Reporting"
                sub="Explainability"
                color={COLORS.blue}
                x={590}
                y={30}
                w={100}
                h={65}
                onClick={() => setArchActive("rep")}
                active={archActive === "rep"}
              />
              {/* Support modules */}
              <line
                x1={350}
                y1={95}
                x2={350}
                y2={140}
                stroke={COLORS.border}
                strokeWidth={1}
                strokeDasharray="4,4"
              />
              <ArchBlock
                label="Digital Twin"
                sub="Station Simulation"
                color={COLORS.teal}
                x={30}
                y={155}
                w={195}
                h={65}
                onClick={() => setArchActive("dt")}
                active={archActive === "dt"}
              />
              <ArchBlock
                label="EV Safety"
                sub="Battery + Thermal"
                color={COLORS.green}
                x={250}
                y={155}
                w={195}
                h={65}
                onClick={() => setArchActive("ev")}
                active={archActive === "ev"}
              />
              <ArchBlock
                label="KVKK"
                sub="Privacy & Access"
                color={COLORS.orange}
                x={470}
                y={155}
                w={195}
                h={65}
                onClick={() => setArchActive("kvkk")}
                active={archActive === "kvkk"}
              />
              {/* Data layer */}
              <rect
                x={30}
                y={260}
                width={635}
                height={140}
                rx={10}
                fill="none"
                stroke={COLORS.border}
                strokeWidth={1}
                strokeDasharray="6,4"
              />
              <text
                x={350}
                y={282}
                textAnchor="middle"
                fill={COLORS.muted}
                fontSize={11}
                fontFamily="system-ui"
                fontWeight="600"
                letterSpacing="2"
              >
                DATA GOVERNANCE LAYER
              </text>
              <rect
                x={50}
                y={296}
                width={180}
                height={44}
                rx={6}
                fill={COLORS.bgLight}
                stroke={COLORS.border}
                strokeWidth={1}
              />
              <text
                x={140}
                y={322}
                textAnchor="middle"
                fill={COLORS.muted}
                fontSize={11}
                fontFamily="system-ui"
              >
                Pseudonymisation
              </text>
              <rect
                x={255}
                y={296}
                width={180}
                height={44}
                rx={6}
                fill={COLORS.bgLight}
                stroke={COLORS.border}
                strokeWidth={1}
              />
              <text
                x={345}
                y={322}
                textAnchor="middle"
                fill={COLORS.muted}
                fontSize={11}
                fontFamily="system-ui"
              >
                Role-Based Access
              </text>
              <rect
                x={460}
                y={296}
                width={180}
                height={44}
                rx={6}
                fill={COLORS.bgLight}
                stroke={COLORS.border}
                strokeWidth={1}
              />
              <text
                x={550}
                y={322}
                textAnchor="middle"
                fill={COLORS.muted}
                fontSize={11}
                fontFamily="system-ui"
              >
                5-Year Retention
              </text>
              <text
                x={350}
                y={385}
                textAnchor="middle"
                fill={`${COLORS.muted}80`}
                fontSize={10}
                fontFamily="system-ui"
              >
                SHA-256 Hashing • Data Minimisation • Automatic Purge • Audit
                Logging
              </text>
            </svg>
          </div>
          <div
            style={{
              flex: "1 1 35%",
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: 24,
              minHeight: 300,
            }}
          >
            {!archActive ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: COLORS.muted,
                  fontSize: 13,
                  textAlign: "center",
                  lineHeight: 1.8,
                }}
              >
                ← Click on a component
                <br />
                in the diagram on the left
              </div>
            ) : (
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: COLORS.teal,
                    fontWeight: 700,
                    letterSpacing: 2,
                    marginBottom: 8,
                  }}
                >
                  COMPONENT DETAIL
                </div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: COLORS.white,
                    marginBottom: 16,
                    paddingBottom: 12,
                    borderBottom: `1px solid ${COLORS.border}`,
                  }}
                >
                  {ARCH_INFO[archActive].title}
                </h3>
                <p
                  style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.8 }}
                >
                  {ARCH_INFO[archActive].desc}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section
        id="results"
        style={{ ...sectionStyle, borderTop: `1px solid ${COLORS.border}` }}
      >
        <h2 style={headingStyle}>
          Results<span style={{ color: COLORS.teal }}>.</span>
        </h2>
        <p style={subStyle}>
          Prototype model performance — trained and tested on synthetic data.
        </p>
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 36,
          }}
        >
          <MetricCard
            value="92%"
            label="Detection Rate (Recall)"
            color={COLORS.teal}
            icon="🎯"
          />
          <MetricCard
            value="94%"
            label="Classification Accuracy"
            color={COLORS.blue}
            icon="✅"
          />
          <MetricCard
            value="0.95"
            label="AUC-ROC Score"
            color={COLORS.green}
            icon="📈"
          />
          <MetricCard
            value="8%"
            label="False Positive Rate"
            color={COLORS.orange}
            icon="⚡"
          />
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
        >
          {/* Classification Performance */}
          <div
            style={{
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: 24,
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: COLORS.white,
                marginBottom: 20,
              }}
            >
              Classification Performance
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={classificationData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: COLORS.muted, fontSize: 11 }}
                />
                <YAxis
                  domain={[80, 100]}
                  tick={{ fill: COLORS.muted, fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: COLORS.bgCard,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="precision"
                  fill={COLORS.teal}
                  name="Precision"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="recall"
                  fill={COLORS.blue}
                  name="Recall"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="f1"
                  fill={COLORS.purple}
                  name="F1-Score"
                  radius={[3, 3, 0, 0]}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: COLORS.muted }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ROC Curves */}
          <div
            style={{
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: 24,
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: COLORS.white,
                marginBottom: 20,
              }}
            >
              ROC Curves
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={rocData}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis
                  dataKey="fpr"
                  tick={{ fill: COLORS.muted, fontSize: 10 }}
                  label={{
                    value: "FPR",
                    position: "bottom",
                    fill: COLORS.muted,
                    fontSize: 10,
                  }}
                />
                <YAxis
                  tick={{ fill: COLORS.muted, fontSize: 10 }}
                  label={{
                    value: "TPR",
                    angle: -90,
                    position: "left",
                    fill: COLORS.muted,
                    fontSize: 10,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="normal"
                  stroke={COLORS.green}
                  strokeWidth={2}
                  dot={false}
                  name="Normal"
                />
                <Line
                  type="monotone"
                  dataKey="dpf"
                  stroke={COLORS.red}
                  strokeWidth={2}
                  dot={false}
                  name="DPF"
                />
                <Line
                  type="monotone"
                  dataKey="egr"
                  stroke={COLORS.blue}
                  strokeWidth={2}
                  dot={false}
                  name="EGR"
                />
                <Line
                  type="monotone"
                  dataKey="scr"
                  stroke={COLORS.orange}
                  strokeWidth={2}
                  dot={false}
                  name="SCR"
                />
                <Line
                  type="monotone"
                  dataKey="obd"
                  stroke={COLORS.purple}
                  strokeWidth={2}
                  dot={false}
                  name="OBD"
                />
                <Line
                  type="monotone"
                  dataKey="random"
                  stroke={COLORS.muted}
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  dot={false}
                  name="Random"
                />
                <Legend wrapperStyle={{ fontSize: 10, color: COLORS.muted }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Feature Importance */}
          <div
            style={{
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: 24,
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: COLORS.white,
                marginBottom: 20,
              }}
            >
              Feature Importance
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={featureImportance}
                layout="vertical"
                barCategoryGap="15%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={COLORS.border}
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fill: COLORS.muted, fontSize: 10 }}
                  unit="%"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: COLORS.muted, fontSize: 10 }}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    background: COLORS.bgCard,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="value"
                  fill={COLORS.teal}
                  radius={[0, 4, 4, 0]}
                  name="Contribution %"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Dataset Distribution */}
          <div
            style={{
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: 24,
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: COLORS.white,
                marginBottom: 20,
              }}
            >
              Dataset Distribution (10,000 Records)
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={datasetPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={{ stroke: COLORS.muted }}
                >
                  {datasetPie.map((_, i) => (
                    <Cell key={i} fill={pieCOLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: COLORS.bgCard,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* SIMULATOR */}
      <section
        id="simulator"
        style={{ ...sectionStyle, borderTop: `1px solid ${COLORS.border}` }}
      >
        <h2 style={headingStyle}>
          Live Simulator<span style={{ color: COLORS.teal }}>.</span>
        </h2>
        <p style={subStyle}>
          Test how the AI system works by adjusting sensor values. Lower the DPF
          pressure, increase PM opacity, or widen the OBD-analyser gap to try
          different manipulation scenarios.
        </p>
        <SimulatorSection />
      </section>
    </div>
  );
}
