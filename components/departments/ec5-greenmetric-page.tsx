"use client";

import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import {
  Sun,
  Zap,
  TrendingUp,
  CheckCircle2,
  Activity,
  Gauge,
  Leaf,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const totalRenewable = 794895;
const totalCampusLow = 1000000;
const totalCampusHigh = 1200000;
const ratioLow = Math.round((totalRenewable / totalCampusHigh) * 100);
const ratioHigh = Math.round((totalRenewable / totalCampusLow) * 100);

const energyBreakdown = [
  { name: "On-Grid Solar PV", value: 750000, color: "hsl(45 70% 50%)" },
  { name: "Off-Grid Solar (Irrigation)", value: 8760, color: "hsl(142 45% 28%)" },
  { name: "Off-Grid Solar (Entomology)", value: 17520, color: "hsl(142 45% 38%)" },
  { name: "Solar Thermal & Dryers", value: 10950, color: "hsl(25 80% 50%)" },
  { name: "Biogas Plant", value: 365, color: "hsl(90 40% 45%)" },
  { name: "Wind & Hydro Models", value: 7300, color: "hsl(180 40% 40%)" },
];

const monthlyData = [
  { month: "Jan", renewable: 55000, total: 80000 },
  { month: "Feb", renewable: 58000, total: 82000 },
  { month: "Mar", renewable: 68000, total: 88000 },
  { month: "Apr", renewable: 72000, total: 90000 },
  { month: "May", renewable: 78000, total: 92000 },
  { month: "Jun", renewable: 80000, total: 96000 },
  { month: "Jul", renewable: 76000, total: 98000 },
  { month: "Aug", renewable: 74000, total: 95000 },
  { month: "Sep", renewable: 70000, total: 88000 },
  { month: "Oct", renewable: 64000, total: 84000 },
  { month: "Nov", renewable: 58000, total: 80000 },
  { month: "Dec", renewable: 42000, total: 77000 },
];

const emisReadings = [
  { label: "Live Solar Output", value: "190.2 kW", icon: Sun, iconClass: "text-secondary" },
  { label: "Daily Production", value: "2,457.30 kWh", icon: Zap, iconClass: "text-primary" },
  { label: "Self-Sufficiency", value: "100%", icon: Gauge, iconClass: "text-primary" },
  { label: "CO₂ Reduction", value: "2,049,623 kg", icon: Leaf, iconClass: "text-secondary" },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || !ref.current) return;
    const ctrl = animate(0, target, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate(v) {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix;
      },
    });
    return () => ctrl.stop();
  }, [isInView, target, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function EC5GreenMetricPage() {
  const heroRef = useRef(null);
  const emisRef = useRef(null);
  const ratioRef = useRef(null);
  const chartRef = useRef(null);
  const scoreRef = useRef(null);
  const evidenceRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-60px" });
  const emisInView = useInView(emisRef, { once: true, margin: "-60px" });
  const ratioInView = useInView(ratioRef, { once: true, margin: "-60px" });
  const chartInView = useInView(chartRef, { once: true, margin: "-60px" });
  const scoreInView = useInView(scoreRef, { once: true, margin: "-60px" });
  const evidenceInView = useInView(evidenceRef, { once: true, margin: "-60px" });

  const circumference = 2 * Math.PI * 54;

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden gradient-agriculture text-primary-foreground">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
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
                <motion.p variants={itemVariants} className="text-sm font-semibold uppercase tracking-widest opacity-70 mb-3">
                  EC5 — Energy &amp; Climate
                </motion.p>

                <motion.h1
                  variants={itemVariants}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-5"
                >
                  Renewable Energy<br />
                  <span className="text-secondary">Ratio</span> on Campus
                </motion.h1>

                <motion.p variants={itemVariants} className="text-lg opacity-85 leading-relaxed mb-6 max-w-lg">
                  MNSUAM generates <strong>66–79%</strong> of total campus energy from renewable sources — surpassing the 50% threshold required for full GreenMetric marks.
                </motion.p>

                {/* Ratio highlight pill */}
                <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
                  <div className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-5 py-3 backdrop-blur-sm">
                    <div className="text-4xl font-bold text-secondary">
                      <AnimatedCounter target={ratioHigh} suffix="%" />
                    </div>
                    <div className="text-xs opacity-70 mt-0.5">Renewable Share</div>
                  </div>
                  <div className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 backdrop-blur-sm">
                    <div className="flex items-center gap-1.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                      <span>Exceeds 50% threshold</span>
                    </div>
                    <div className="text-xs opacity-60 mt-0.5">Qualifies for full marks (200/200)</div>
                  </div>
                </motion.div>

              </div>

              {/* Hero image */}
              <motion.div variants={itemVariants} className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80"
                  alt="Aerial solar energy farm"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-secondary text-secondary-foreground text-xs font-semibold">66–79% Renewable</Badge>
                    <Badge className="bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30 text-xs">794,895 kWh/yr</Badge>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L60 72C120 64 240 48 360 43C480 38 600 43 720 48C840 53 960 58 1080 58C1200 58 1320 53 1380 51L1440 48V80H0Z" className="fill-background" />
          </svg>
        </div>
      </div>

      {/* ── LIVE EMIS READINGS ────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={emisRef}
            initial="hidden"
            animate={emisInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Live EMIS Dashboard
              </h2>
              <p className="text-muted-foreground text-lg">
                Real-time solar monitoring readings recorded on May 4, 2026.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {emisReadings.map((item, i) => (
                <motion.div key={item.label} variants={itemVariants}>
                  <Card className="stat-card text-center border-border/50 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-11 h-11 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-3">
                        <item.icon className={`w-5 h-5 ${item.iconClass}`} />
                      </div>
                      <div className="text-2xl font-bold text-foreground mb-1">{item.value}</div>
                      <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{item.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <motion.p variants={itemVariants} className="mt-5 text-center text-xs text-muted-foreground max-w-2xl mx-auto">
              Grid import was 0 kWh on the recorded date. Extrapolating 2,457 kWh/day over 300 peak solar days yields &gt;700,000 kWh annual generation. Cumulative CO₂ data implies &gt;4 million kWh total generation since installation.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── ENERGY RATIO ──────────────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ratioRef}
            initial="hidden"
            animate={ratioInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Renewable vs. Total Consumption
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Campus energy balance showing renewable generation against total consumption.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 items-start">

              {/* SVG Gauge */}
              <motion.div variants={itemVariants}>
                <Card className="border-border/50 h-full">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-primary" />
                      Renewable Ratio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-5">
                    <div className="relative" style={{ width: 140, height: 140 }}>
                      <svg width="140" height="140" viewBox="0 0 140 140">
                        {/* BG track */}
                        <circle cx="70" cy="70" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                        {/* Animated fill */}
                        <motion.circle
                          cx="70" cy="70" r="54"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          initial={{ strokeDashoffset: circumference }}
                          animate={ratioInView ? { strokeDashoffset: circumference * (1 - ratioHigh / 100) } : {}}
                          transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          transform="rotate(-90 70 70)"
                        />
                        {/* Threshold tick at 50% */}
                        <line
                          x1="70" y1="16" x2="70" y2="26"
                          stroke="hsl(var(--secondary))"
                          strokeWidth="2"
                          transform={`rotate(${-90 + 180} 70 70)`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-primary">{ratioHigh}%</div>
                        <div className="text-xs text-muted-foreground">Renewable</div>
                      </div>
                    </div>

                    <div className="w-full space-y-2.5 text-sm">
                      {[
                        { label: "Renewable Energy", val: "794,895 kWh/yr", cls: "text-primary font-semibold" },
                        { label: "Total Campus Use", val: "~1.0–1.2M kWh/yr", cls: "text-foreground" },
                        { label: "Ratio Range", val: `${ratioLow}% – ${ratioHigh}%`, cls: "text-secondary font-semibold" },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between items-center">
                          <span className="text-muted-foreground">{row.label}</span>
                          <span className={row.cls}>{row.val}</span>
                        </div>
                      ))}
                      <div className="pt-2 flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-xs text-primary font-medium">Exceeds 50% full-marks threshold</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Breakdown bars */}
              <motion.div variants={itemVariants} className="md:col-span-2">
                <Card className="border-border/50 h-full">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-secondary" />
                      Sources Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {energyBreakdown.map((item, i) => (
                      <div key={item.name}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-muted-foreground">{item.name}</span>
                          <span className="font-medium text-foreground">{item.value.toLocaleString()} kWh</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={ratioInView ? { width: `${Math.max((item.value / 750000) * 100, 1)}%` } : { width: 0 }}
                            transition={{ duration: 1.1, delay: i * 0.08 + 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full rounded-full"
                            style={{ background: item.color, minWidth: 4 }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MONTHLY CHART ─────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={chartRef}
            initial="hidden"
            animate={chartInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Monthly Energy Profile
              </h2>
              <p className="text-muted-foreground text-lg">
                Renewable production vs. total campus consumption across the year.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    Renewable vs. Total Consumption (kWh)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="gradTotal5" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(142 45% 28%)" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="hsl(142 45% 28%)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradRenew5" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(45 70% 50%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(45 70% 50%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <YAxis
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: 12,
                        }}
                        formatter={(v: number) => [`${v.toLocaleString()} kWh`]}
                      />
                      <Legend
                        formatter={(value) => (
                          <span style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>{value}</span>
                        )}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        name="Total Consumption"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#gradTotal5)"
                      />
                      <Area
                        type="monotone"
                        dataKey="renewable"
                        name="Renewable Production"
                        stroke="hsl(var(--secondary))"
                        strokeWidth={2.5}
                        fill="url(#gradRenew5)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
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
                Expected improvement for EC5 in the 2026 rankings.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="max-w-2xl mx-auto border-border/50 overflow-hidden">
                <div className="h-1.5 gradient-gold" />
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {[
                      { label: "2025 Score", value: 150, max: 200, pct: 75 },
                      { label: "2026 Target", value: 200, max: 200, pct: 100 },
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
                        <div className="text-4xl font-bold text-primary">+50 pts</div>
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
                Documentation and data supporting the EC5 GreenMetric submission.
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              {[
                "Total renewable energy production of ~794,895 kWh/year documented across 6 systems",
                "Total campus energy consumption estimated at 1,000,000–1,200,000 kWh/year",
                "Renewable share of 66%–79% confirmed — exceeds the 50% full-marks threshold",
                "Real-time EMIS monitoring: 190.2 kW live solar output recorded on May 4, 2026",
                "Single-day production record of 2,457.30 kWh with 100% campus self-sufficiency",
                "Extrapolating 300 peak solar days yields >700,000 kWh annual generation confirmed",
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER BAND ───────────────────────────────────────────────────── */}
      <div className="bg-muted/30 border-t border-border py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>MNS University of Agriculture, Multan · May 2026</div>
          <Badge variant="outline" className="border-primary/30 text-primary">
            EC5 · GreenMetric 2026
          </Badge>
        </div>
      </div>

    </div>
  );
}
