"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Eye,
  RefreshCw,
  Settings,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SettingsState = {
  defaultFocus: "all" | "attention" | "requests" | "repairs" | "contacts";
  refreshMinutes: number;
  showTimeline: boolean;
  showTrafficCards: boolean;
  includeContactsInExport: boolean;
  includeTrafficInExport: boolean;
  includeRequestBreakdownInExport: boolean;
};

const storageKey = "raf-sp-super-admin-settings";
type BooleanSettingKey = {
  [Key in keyof SettingsState]: SettingsState[Key] extends boolean ? Key : never;
}[keyof SettingsState];
type NumericSettingKey = {
  [Key in keyof SettingsState]: SettingsState[Key] extends number ? Key : never;
}[keyof SettingsState];

const defaultSettings: SettingsState = {
  defaultFocus: "attention",
  refreshMinutes: 10,
  showTimeline: true,
  showTrafficCards: true,
  includeContactsInExport: true,
  includeTrafficInExport: true,
  includeRequestBreakdownInExport: true,
};

const sectionToggles: Array<{
  key: BooleanSettingKey;
  title: string;
  detail: string;
  icon: LucideIcon;
}> = [
  {
    key: "showTimeline",
    title: "Timeline",
    detail: "Show recent resource movement in the command center.",
    icon: RefreshCw,
  },
  {
    key: "showTrafficCards",
    title: "Traffic cards",
    detail: "Show public and admin view shortcuts.",
    icon: Eye,
  },
];

const exportToggles: Array<{
  key: BooleanSettingKey;
  title: string;
  detail: string;
}> = [
  {
    key: "includeContactsInExport",
    title: "Contacts",
    detail: "Include focal person, email, and phone columns.",
  },
  {
    key: "includeTrafficInExport",
    title: "Traffic",
    detail: "Include public and admin dashboard view columns.",
  },
  {
    key: "includeRequestBreakdownInExport",
    title: "Request breakdown",
    detail: "Include pending, approved, borrowed, overdue, and closed request columns.",
  },
];

function ToggleRow({
  active,
  title,
  detail,
  icon: Icon,
  onToggle,
}: {
  active: boolean;
  title: string;
  detail: string;
  icon?: LucideIcon;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={`flex w-full items-center justify-between gap-4 rounded-lg border p-3 text-left transition ${
        active ? "border-slate-900 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-900 hover:border-slate-400"
      }`}
    >
      <span className="flex min-w-0 items-center gap-3">
        {Icon && (
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active ? "bg-white/10" : "bg-slate-100"}`}>
            <Icon className="h-4 w-4" />
          </span>
        )}
        <span className="min-w-0">
          <span className="block font-semibold">{title}</span>
          <span className={`mt-0.5 block text-xs ${active ? "text-slate-300" : "text-slate-500"}`}>{detail}</span>
        </span>
      </span>
      <Badge variant="outline" className={active ? "border-white/20 bg-white/10 text-white" : "border-slate-200 bg-slate-50 text-slate-700"}>
        {active ? "On" : "Off"}
      </Badge>
    </button>
  );
}

export default function SuperAdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return;

    try {
      setSettings({ ...defaultSettings, ...JSON.parse(raw) });
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings]);

  const setNumericSetting = (key: NumericSettingKey, value: string) => {
    const number = Math.max(0, Number(value) || 0);
    setSettings((current) => ({ ...current, [key]: number }));
  };

  const toggleSetting = (key: BooleanSettingKey) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-start lg:justify-between lg:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-950 lg:text-3xl">Super Admin Settings</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Configure how the command center behaves for this browser: alerts, default filters, sections, refresh timing, and export detail.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/super-admin">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setSettings(defaultSettings)}
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-slate-950">
              <SlidersHorizontal className="h-5 w-5 text-slate-500" />
              Dashboard Behavior
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="defaultFocus">Default matrix filter</Label>
                <Select
                  value={settings.defaultFocus}
                  onValueChange={(value) =>
                    setSettings((current) => ({ ...current, defaultFocus: value as SettingsState["defaultFocus"] }))
                  }
                >
                  <SelectTrigger id="defaultFocus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="attention">Attention</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="requests">Requests</SelectItem>
                    <SelectItem value="repairs">Repairs</SelectItem>
                    <SelectItem value="contacts">Contacts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="refreshMinutes">Refresh reminder minutes</Label>
                <Input
                  id="refreshMinutes"
                  type="number"
                  min={0}
                  value={settings.refreshMinutes}
                  onChange={(event) => setNumericSetting("refreshMinutes", event.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-3">
              {sectionToggles.map((item) => (
                <ToggleRow
                  key={item.key}
                  active={Boolean(settings[item.key])}
                  title={item.title}
                  detail={item.detail}
                  icon={item.icon}
                  onToggle={() => toggleSetting(item.key)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-slate-950">
            <Download className="h-5 w-5 text-slate-500" />
            Export Detail
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {exportToggles.map((item) => (
            <ToggleRow
              key={item.key}
              active={Boolean(settings[item.key])}
              title={item.title}
              detail={item.detail}
              onToggle={() => toggleSetting(item.key)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
