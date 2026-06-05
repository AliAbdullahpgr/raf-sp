"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import {
  Wifi,
  Router,
  Users,
  Network,
  Shield,
  Activity,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Cpu,
  GraduationCap,
  Building2,
  UserCog,
  Presentation,
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

const wlans = [
  {
    id: 1,
    name: "Faculty",
    clients: 872,
    clientsLabel: "872 clients",
    security: "WPA2-PSK",
    purpose: "Academic & Research Staff",
    icon: Users,
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    chartColor: "hsl(142 45% 28%)",
    description:
      "Largest user group on campus — academic and research staff accessing LMS, research portals, and collaboration tools.",
  },
  {
    id: 2,
    name: "STUDENT",
    clients: 363,
    clientsLabel: "363 clients",
    security: "WPA2-PSK",
    purpose: "Student E-Learning",
    icon: GraduationCap,
    colorClass: "text-secondary",
    bgClass: "bg-secondary/10",
    chartColor: "hsl(45 70% 50%)",
    description:
      "Dedicated student network supporting e-learning, online resources, and digital coursework across the campus.",
  },
  {
    id: 3,
    name: "Administration",
    clients: 83,
    clientsLabel: "83 clients",
    security: "WPA2-PSK",
    purpose: "Administrative Offices",
    icon: Building2,
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    chartColor: "hsl(142 45% 38%)",
    description:
      "Powers paperless administration, digital records, and online workflow across administrative departments.",
  },
  {
    id: 4,
    name: "CAMP-OFFICE-Two",
    clients: 0,
    clientsLabel: "Active",
    security: "WPA2-PSK",
    purpose: "Campus Office Network",
    icon: Network,
    colorClass: "text-secondary",
    bgClass: "bg-secondary/10",
    chartColor: "hsl(25 80% 50%)",
    description:
      "Secondary campus office segment providing connectivity for satellite offices and operational units.",
  },
  {
    id: 5,
    name: "Officers",
    clients: 7,
    clientsLabel: "7 clients",
    security: "WPA2-PSK",
    purpose: "Senior Management",
    icon: UserCog,
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    chartColor: "hsl(90 40% 45%)",
    description:
      "Secure network segment reserved for senior management and decision-makers for data-driven governance.",
  },
  {
    id: 6,
    name: "Meeting",
    clients: 3,
    clientsLabel: "3 clients",
    security: "WPA2-PSK",
    purpose: "Conference & Meeting Rooms",
    icon: Presentation,
    colorClass: "text-secondary",
    bgClass: "bg-secondary/10",
    chartColor: "hsl(180 40% 40%)",
    description:
      "Connectivity for conference and meeting rooms, enabling virtual meetings and reducing travel-related emissions.",
  },
];

// Clients per WLAN (only those with reported client counts)
const pieData = wlans
  .filter((w) => w.clients > 0)
  .map((w) => ({
    name: w.name,
    value: w.clients,
    color: w.chartColor,
  }));

// Top applications by bandwidth (GB)
const appData = [
  { name: "ssl / https", usage: 1113, color: "hsl(142 45% 28%)" },
  { name: "google-services", usage: 342, color: "hsl(45 70% 50%)" },
  { name: "youtube", usage: 313, color: "hsl(25 80% 50%)" },
  { name: "ms-services", usage: 166, color: "hsl(142 45% 45%)" },
  { name: "http / web", usage: 82, color: "hsl(180 40% 40%)" },
];

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

export function GD6WiFiICTPage() {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const wlansRef = useRef(null);
  const chartsRef = useRef(null);
  const scoreRef = useRef(null);
  const evidenceRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-60px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });
  const wlansInView = useInView(wlansRef, { once: true, margin: "-60px" });
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
                  GD6 — Education &amp; Research · ICT
                </motion.p>

                {/* Title */}
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-5"
                >
                  ICT for Sustainability<br />
                  <span className="text-secondary">Monitoring</span> &amp; Evaluation
                </motion.h1>

                {/* Description */}
                <motion.p variants={itemVariants} className="text-lg opacity-85 leading-relaxed mb-8 max-w-lg">
                  MNS University of Agriculture, Multan operates an <strong>enterprise-grade campus Wi-Fi network</strong> on a Cisco 3500 Series WLC — 96 access points, 6 role-based WLANs, and ~1,348 concurrent users powering a paperless, data-driven campus.
                </motion.p>

              </div>

              {/* Hero image */}
              <motion.div
                variants={itemVariants}
                className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80"
                  alt="Enterprise network infrastructure and server room"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-secondary text-secondary-foreground text-xs font-semibold">96 Access Points</Badge>
                    <Badge className="bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30 text-xs">6 Dedicated WLANs</Badge>
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
            { label: "Access Points", value: "96 APs", sub: "75 operational campus-wide", icon: Router, iconClass: "text-secondary" },
            { label: "Active Clients", value: "~1,348", sub: "Concurrent users", icon: Users, iconClass: "text-secondary" },
            { label: "Dedicated WLANs", value: "6", sub: "Role-based segmentation", icon: Network, iconClass: "text-primary" },
            { label: "GreenMetric Score", value: "50/50", sub: "Full marks target GD6", icon: TrendingUp, iconClass: "text-primary" },
          ].map((stat) => (
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

      {/* ── INFRASTRUCTURE HIGHLIGHTS ─────────────────────────────────────── */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Wireless Controller", value: "Cisco 3500 Series WLC", sub: "Enterprise-grade, centrally managed", icon: Cpu },
              { label: "AP Models Deployed", value: "AIR-AP3802 / 8321 / 1832I", sub: "802.11ac Wave 2 capable", icon: Wifi },
              { label: "Dual-Band Coverage", value: "2.4 GHz + 5 GHz", sub: "High capacity, low interference", icon: Activity },
              { label: "Network Security", value: "WPA2-PSK", sub: "Across all 6 SSIDs", icon: Shield },
            ].map((item) => (
              <Card key={item.label} className="border-border/50 bg-muted/20">
                <CardContent className="p-5">
                  <item.icon className="w-5 h-5 text-primary mb-3" />
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{item.label}</div>
                  <div className="text-sm font-bold text-foreground">{item.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{item.sub}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── WLAN GRID ─────────────────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={wlansRef}
            initial="hidden"
            animate={wlansInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                6 Dedicated WLANs — Role-Based Segmentation
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The campus network is segmented into six secure, role-based wireless networks, each serving a distinct user group across the university.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {wlans.map((w) => (
                <motion.div key={w.id} variants={itemVariants}>
                  <Card className="h-full card-hover border-border/50 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className={`w-10 h-10 rounded-full ${w.bgClass} flex items-center justify-center`}>
                          <w.icon className={`w-5 h-5 ${w.colorClass}`} />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {w.purpose}
                        </Badge>
                      </div>
                      <CardTitle className="text-base text-foreground group-hover:text-primary transition-colors">
                        {w.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {w.description}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-border/50 text-sm">
                        <div>
                          <span className="text-muted-foreground">Security: </span>
                          <span className="font-semibold text-foreground">{w.security}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-muted-foreground">Users: </span>
                          <span className={`font-semibold ${w.colorClass}`}>{w.clientsLabel}</span>
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
                ICT Activity Monitoring
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Real-time usage analytics captured from the live Cisco WLC dashboard.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Bar Chart — top applications by bandwidth */}
              <motion.div variants={itemVariants}>
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary" />
                      Top Applications by Bandwidth (GB)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={appData} margin={{ top: 5, right: 10, left: 0, bottom: 72 }}>
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
                          tickFormatter={(v) => `${v} GB`}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            fontSize: 12,
                          }}
                          formatter={(v: number) => [`${v.toLocaleString()} GB`, "Usage"]}
                        />
                        <Bar dataKey="usage" shape={<CustomBar />} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Pie Chart — clients per WLAN */}
              <motion.div variants={itemVariants}>
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-secondary" />
                      Active Clients by Network
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
                          formatter={(v: number) => [`${v.toLocaleString()} clients`]}
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
                Expected improvement for the GD category (Wi-Fi / ICT indicators) in 2026.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="max-w-2xl mx-auto border-border/50 overflow-hidden">
                <div className="h-1.5 gradient-gold" />
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {[
                      { label: "2025 Score (GD6 + GD7)", value: 0, max: 100, pct: 0 },
                      { label: "2026 Target (GD6 + GD7)", value: 100, max: 100, pct: 100 },
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
                        <div className="text-4xl font-bold text-primary">+100 pts</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">GD6 + GD7</div>
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
                Documentation and live data supporting the GD6 ICT GreenMetric submission.
              </p>
            </motion.div>

            <motion.div variants={containerVariants} className="max-w-3xl mx-auto">
              {[
                "Enterprise-grade Cisco 3500 Series WLC managing 96 access points (75 operational) campus-wide",
                "6 role-based WLANs (Faculty, Student, Administration, Camp-Office, Officers, Meeting) with WPA2-PSK security",
                "~1,348 concurrent active clients across academic, administrative, residential, and research facilities",
                "Live WLC monitoring dashboard providing continuous real-time ICT activity tracking (June 3, 2026)",
                "Bandwidth analytics show secure HTTPS (1,113 GB), Google Workspace, and Microsoft 365 collaboration traffic",
                "ICT enables paperless administration, remote LMS access, and real-time solar EMIS dashboard monitoring",
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
          <div>MNS University of Agriculture, Multan · June 2026</div>
          <Badge variant="outline" className="border-primary/30 text-primary">
            GD6 · GreenMetric 2026
          </Badge>
        </div>
      </div>

    </div>
  );
}
