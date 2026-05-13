"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import {
  Sun,
  Wind,
  Droplets,
  Flame,
  Zap,
  Leaf,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Award,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const renewableSources = [
  {
    id: 1,
    name: "On-Grid Solar PV System",
    capacity: "~190–200 kW",
    annualOutput: 750000,
    annualOutputLabel: "~750,000 kWh",
    purpose: "Campus Electricity",
    icon: Sun,
    colorClass: "text-secondary",
    bgClass: "bg-secondary/10",
    borderClass: "border-secondary/30",
    chartColor: "hsl(45 70% 50%)",
    description:
      "Large-scale grid-tied photovoltaic installation powering the main campus buildings. Feeds surplus electricity back to the grid.",
  },
  {
    id: 2,
    name: "Off-Grid Solar — Irrigation",
    capacity: "5 kW",
    annualOutput: 8760,
    annualOutputLabel: "8,760 kWh",
    purpose: "Irrigation",
    icon: Droplets,
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    borderClass: "border-primary/30",
    chartColor: "hsl(142 45% 28%)",
    description:
      "Standalone solar system dedicated to campus irrigation, operating independently of the grid for reliable water management.",
  },
  {
    id: 3,
    name: "Off-Grid Solar — Entomology Lab",
    capacity: "8 kW",
    annualOutput: 17520,
    annualOutputLabel: "17,520 kWh",
    purpose: "Research",
    icon: Sun,
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    borderClass: "border-primary/30",
    chartColor: "hsl(142 45% 38%)",
    description:
      "Dedicated off-grid solar unit supplying clean power to the Entomology Research Lab for uninterrupted research activities.",
  },
  {
    id: 4,
    name: "Solar Thermal & Dryers",
    capacity: "6.7 kW",
    annualOutput: 10950,
    annualOutputLabel: "10,950 kWh",
    purpose: "Heating / Drying",
    icon: Flame,
    colorClass: "text-secondary",
    bgClass: "bg-secondary/10",
    borderClass: "border-secondary/30",
    chartColor: "hsl(25 80% 50%)",
    description:
      "Solar thermal collectors and crop dryers converting solar radiation into heat for drying agricultural produce and space heating.",
  },
  {
    id: 5,
    name: "Biogas Plant",
    capacity: "20 m³/day",
    annualOutput: 365,
    annualOutputLabel: "365 kWh",
    purpose: "Waste Processing",
    icon: Leaf,
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    borderClass: "border-primary/30",
    chartColor: "hsl(90 40% 45%)",
    description:
      "Biogas digester converting organic campus waste into energy, reducing landfill burden while producing usable biogas for heating.",
  },
  {
    id: 6,
    name: "Wind & Hydro Models",
    capacity: "0.5 kW each",
    annualOutput: 7300,
    annualOutputLabel: "7,300 kWh",
    purpose: "Teaching",
    icon: Wind,
    colorClass: "text-secondary",
    bgClass: "bg-secondary/10",
    borderClass: "border-secondary/30",
    chartColor: "hsl(180 40% 40%)",
    description:
      "Educational wind turbine and micro-hydro models for hands-on teaching of renewable energy principles to students and visitors.",
  },
];

const pieData = renewableSources.map((s) => ({
  name: s.name.replace("Off-Grid Solar —", "Solar —").replace("On-Grid Solar PV System", "Solar PV"),
  value: s.annualOutput,
  color: s.chartColor,
}));

const barData = renewableSources.map((s) => ({
  name: s.name
    .replace("Off-Grid Solar —", "")
    .replace("On-Grid Solar PV System", "Solar PV")
    .trim(),
  output: s.annualOutput,
  color: s.chartColor,
}));

function CustomBar(props: any) {
  const { x, y, width, height, color } = props;
  return <rect x={x} y={y} width={width} height={height} fill={color} rx={4} />;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function EC3GreenMetricPage() {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const sourcesRef = useRef(null);
  const chartsRef = useRef(null);
  const scoreRef = useRef(null);
  const evidenceRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-60px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });
  const sourcesInView = useInView(sourcesRef, { once: true, margin: "-60px" });
  const chartsInView = useInView(chartsRef, { once: true, margin: "-60px" });
  const scoreInView = useInView(scoreRef, { once: true, margin: "-60px" });
  const evidenceInView = useInView(evidenceRef, { once: true, margin: "-60px" });

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden gradient-agriculture text-primary-foreground">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        {/* Radial glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-primary-foreground/5 blur-2xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <motion.div
            ref={heroRef}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                UI GreenMetric World University Rankings 2026
              </span>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                {/* Category label */}
                <motion.p variants={itemVariants} className="text-sm font-semibold uppercase tracking-widest opacity-70 mb-3">
                  EC3 — Energy &amp; Climate
                </motion.p>

                {/* Title */}
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-5"
                >
                  Renewable Energy<br />
                  <span className="text-secondary">Sources</span> on Campus
                </motion.h1>

                {/* Description */}
                <motion.p variants={itemVariants} className="text-lg opacity-85 leading-relaxed mb-8 max-w-lg">
                  MNS University of Agriculture, Multan operates <strong>six renewable energy systems</strong> with a combined annual output of 794,895 kWh — qualifying for full GreenMetric marks.
                </motion.p>

                {/* Focal person */}
                <motion.div variants={itemVariants} className="inline-flex items-center gap-3 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Mr. Israr Hussain</div>
                    <div className="text-xs opacity-70">UI GreenMetric Governance &amp; Digitalization Committee</div>
                  </div>
                </motion.div>
              </div>

              {/* Hero image */}
              <motion.div
                variants={itemVariants}
                className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80"
                  alt="Solar panels on campus"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-secondary text-secondary-foreground text-xs font-semibold">6 Systems</Badge>
                    <Badge className="bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30 text-xs">~214 kW Installed</Badge>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L60 72C120 64 240 48 360 43C480 38 600 43 720 48C840 53 960 58 1080 58C1200 58 1320 53 1380 51L1440 48V80H0Z" className="fill-background" />
          </svg>
        </div>
      </div>

      {/* ── STAT CARDS ────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 mb-16">
        <motion.div
          ref={statsRef}
          initial="hidden"
          animate={statsInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Active Systems", value: "6", sub: "Renewable technologies", icon: Zap, iconClass: "text-secondary" },
            { label: "Installed Capacity", value: "~214 kW", sub: "Combined peak output", icon: Sun, iconClass: "text-secondary" },
            { label: "Annual Output", value: "794,895 kWh", sub: "Per year across all systems", icon: BarChart3, iconClass: "text-primary" },
            { label: "GreenMetric Score", value: "300/300", sub: "Full marks target EC3", icon: TrendingUp, iconClass: "text-primary" },
          ].map((stat, i) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <Card className="stat-card h-full hover:shadow-lg transition-shadow duration-300 border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center flex-shrink-0">
                      <stat.icon className={`w-5 h-5 ${stat.iconClass}`} />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{stat.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{stat.sub}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── RENEWABLE SOURCES GRID ────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={sourcesRef}
            initial="hidden"
            animate={sourcesInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Active Renewable Energy Systems
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Six distinct technologies operating across the university campus, each contributing to the total renewable energy portfolio.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {renewableSources.map((src, i) => (
                <motion.div key={src.id} variants={itemVariants}>
                  <Card className="h-full card-hover border-border/50 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className={`w-10 h-10 rounded-full ${src.bgClass} flex items-center justify-center`}>
                          <src.icon className={`w-5 h-5 ${src.colorClass}`} />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {src.purpose}
                        </Badge>
                      </div>
                      <CardTitle className="text-base text-foreground group-hover:text-primary transition-colors">
                        {src.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {src.description}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-border/50 text-sm">
                        <div>
                          <span className="text-muted-foreground">Capacity: </span>
                          <span className="font-semibold text-foreground">{src.capacity}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-muted-foreground">Output: </span>
                          <span className={`font-semibold ${src.colorClass}`}>{src.annualOutputLabel}/yr</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CHARTS ────────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={chartsRef}
            initial="hidden"
            animate={chartsInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Output Analysis
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Annual energy production figures across all six renewable systems.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <motion.div variants={itemVariants}>
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary" />
                      Annual Output by System (kWh/yr)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 72 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                          angle={-38}
                          textAnchor="end"
                          interval={0}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            fontSize: 12,
                          }}
                          formatter={(v: number) => [`${v.toLocaleString()} kWh`, "Output"]}
                        />
                        <Bar dataKey="output" shape={<CustomBar />} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Pie Chart */}
              <motion.div variants={itemVariants}>
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-secondary" />
                      Share by System
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            fontSize: 12,
                          }}
                          formatter={(v: number) => [`${v.toLocaleString()} kWh`]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-3 grid grid-cols-2 gap-1.5">
                      {pieData.map((d) => (
                        <div key={d.name} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                          <span className="text-xs text-muted-foreground truncate">{d.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SCORE PROJECTION ──────────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={scoreRef}
            initial="hidden"
            animate={scoreInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                GreenMetric Score Projection
              </h2>
              <p className="text-muted-foreground text-lg">
                Expected improvement for EC3 in the 2026 rankings.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="max-w-2xl mx-auto border-border/50 overflow-hidden">
                <div className="h-1.5 gradient-gold" />
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {[
                      { label: "2025 Score", value: 150, max: 300, pct: 50 },
                      { label: "2026 Target", value: 300, max: 300, pct: 100 },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            {item.label}
                          </span>
                          <span className="text-2xl font-bold text-foreground">
                            {item.value}
                            <span className="text-sm font-normal text-muted-foreground ml-1">/ {item.max}</span>
                          </span>
                        </div>
                        <div className="h-3 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={scoreInView ? { width: `${item.pct}%` } : { width: 0 }}
                            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className={`h-full rounded-full ${item.pct === 100 ? "gradient-gold" : "bg-muted-foreground/40"}`}
                          />
                        </div>
                      </div>
                    ))}

                    <div className="pt-4 flex items-center justify-between border-t border-border">
                      <div>
                        <div className="text-sm text-muted-foreground">Expected Gain</div>
                        <div className="text-4xl font-bold text-primary">+150 pts</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Final Score</div>
                        <div className="text-4xl font-bold text-secondary">Full Marks</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── EVIDENCE CHECKLIST ────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={evidenceRef}
            initial="hidden"
            animate={evidenceInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Submission Evidence Summary
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Documentation and data supporting the EC3 GreenMetric submission.
              </p>
            </motion.div>

            <motion.div variants={containerVariants} className="max-w-3xl mx-auto">
              {[
                "6 distinct renewable energy technologies documented and operational on campus",
                "Real-time EMIS solar monitoring dashboard — live readings: 190.2 kW, 2,457.30 kWh/day",
                "100% campus self-sufficiency achieved on peak solar generation days (grid import: 0 kWh)",
                "CO₂ reduction of 2,049,623 kg recorded cumulatively on monitoring system",
                "Monthly and annual energy production charts available as supporting evidence",
                "Total combined output of ~794,895 kWh/year verified across all six systems",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex items-start gap-4 py-4 border-b border-border/50 last:border-0"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{item}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER BAND ───────────────────────────────────────────────────── */}
      <div className="bg-muted/30 border-t border-border py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>
            <span className="font-semibold text-foreground">Mr. Israr Hussain</span>
            {" — "}UI GreenMetric Governance &amp; Digitalization Committee · MNS University of Agriculture, Multan · May 2026
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary">
            EC3 · GreenMetric 2026
          </Badge>
        </div>
      </div>

    </div>
  );
}
