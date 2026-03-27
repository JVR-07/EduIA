import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartData } from "../EngineeringVideo";

interface ExampleSceneProps {
  text: string;
  charts: ChartData[];
  durationInFrames: number;
}

// Componente de chart animado — las barras crecen desde 0 según el frame
const AnimatedBarChart: React.FC<{ chart: ChartData; progress: number }> = ({
  chart,
  progress,
}) => {
  const animatedData = chart.data.map((d) => ({
    ...d,
    value: d.value * progress,
  }));

  const COLORS = ["#4299E1", "#63B3ED", "#48BB78", "#F6AD55", "#FC8181", "#B794F4"];

  return (
    <div>
      <p
        style={{
          color: "#63B3ED",
          fontSize: 20,
          fontFamily: "monospace",
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        {chart.title}
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={animatedData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="name"
            tick={{ fill: "rgba(226,232,240,0.7)", fontSize: 13 }}
            axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
          />
          <YAxis
            tick={{ fill: "rgba(226,232,240,0.7)", fontSize: 13 }}
            axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {animatedData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const AnimatedLineChart: React.FC<{ chart: ChartData; progress: number }> = ({
  chart,
  progress,
}) => {
  const visibleCount = Math.ceil(chart.data.length * progress);
  const visibleData = chart.data.slice(0, visibleCount);

  return (
    <div>
      <p
        style={{
          color: "#63B3ED",
          fontSize: 20,
          fontFamily: "monospace",
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        {chart.title}
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={visibleData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="name"
            tick={{ fill: "rgba(226,232,240,0.7)", fontSize: 13 }}
            axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
          />
          <YAxis
            tick={{ fill: "rgba(226,232,240,0.7)", fontSize: 13 }}
            axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#63B3ED"
            strokeWidth={3}
            dot={{ r: 5, fill: "#63B3ED" }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ExampleScene: React.FC<ExampleSceneProps> = ({
  text,
  charts,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // El texto entra primero, las gráficas después
  const textOpacity = interpolate(frame, [10, 35], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Animación de las gráficas: de 0 a 1 entre frames 40 y 110
  const chartProgress = interpolate(frame, [40, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const chartsOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateRight: "clamp",
  });

  const hasCharts = charts && charts.length > 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0e1a",
        padding: hasCharts ? "50px 80px 40px" : "60px 100px",
        opacity: fadeOut,
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          opacity: headerOpacity,
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            width: 4,
            height: 36,
            borderRadius: 2,
            background: "linear-gradient(180deg, #48BB78, #38A169)",
          }}
        />
        <span
          style={{
            color: "#48BB78",
            fontSize: 22,
            fontFamily: "monospace",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Ejemplo práctico
        </span>
      </div>

      {/* Layout: texto a la izquierda, gráficas a la derecha (si existen) */}
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: 48,
          alignItems: "flex-start",
        }}
      >
        {/* Texto */}
        <div
          style={{
            opacity: textOpacity,
            flex: hasCharts ? "0 0 42%" : "1",
          }}
        >
          <p
            style={{
              color: "rgba(226,232,240,0.9)",
              fontSize: hasCharts ? 26 : 32,
              fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
              fontWeight: 300,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {text}
          </p>
        </div>

        {/* Gráficas */}
        {hasCharts && (
          <div
            style={{
              opacity: chartsOpacity,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {charts.slice(0, 2).map((chart, i) => (
              <div key={i}>
                {chart.type === "bar" ? (
                  <AnimatedBarChart chart={chart} progress={chartProgress} />
                ) : (
                  <AnimatedLineChart chart={chart} progress={chartProgress} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};