import { useId, useState, type CSSProperties, type ReactNode, useEffect, useRef, type MouseEvent } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Box,
  CircleDollarSign,
  Clock3,
  Download,
  Ellipsis,
  Eye,
  Filter,
  ListChecks,
  Search,
  ShieldCheck,
  ShoppingBag,
  TriangleAlert,
  Users,
  Zap,
  ArrowDownToLine,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  ChevronRight,
  Command,
  LayoutDashboard,
  Moon,
  Sun,
  TrendingUp,
  X,
  Plus
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import "@fontsource-variable/manrope";

export interface GlassyDashboardProps {
  backgroundImage?: string;
  backgroundCredit?: { label: string; href: string };
  workspaceName?: string;
  panelFrost?: number;
  initialTheme?: "light" | "dark";
  onOpenAddModal?: () => void;
  onOpenEmployerForm?: (item: WorkItem) => void;
  onDownloadReportPDF?: () => void;
}

const studioPhoto = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&auto=format&fit=crop&q=80";

const dashboardStyles = `
.gd-app {
  --gd-ink: #0f172a;
  --gd-muted: #475569;
  --gd-line: rgb(37 99 235 / 12%);
  --gd-grid: rgb(37 99 235 / 9%);
  --gd-rim: rgb(255 255 255 / 85%);
  --gd-edge-light: rgb(255 255 255 / 98%);
  --gd-edge-shade: rgb(37 99 235 / 8%);
  --gd-gloss: rgb(255 255 255 / 75%);
  --gd-frame: rgb(255 255 255 / 78%);
  --gd-rail: rgb(240 246 255 / 85%);
  --gd-card: rgb(255 255 255 / 88%);
  --gd-card-light: rgb(255 255 255 / 96%);
  --gd-raised: rgb(255 255 255 / 98%);
  --gd-inner: rgb(241 245 249 / 85%);
  --gd-surface: #ffffff;
  --gd-track: rgb(226 232 240 / 75%);
  --gd-primary: #2563eb;
  --gd-primary-ink: #ffffff;
  --gd-pick: #2563eb;
  --gd-pick-ink: #ffffff;
  --gd-coral: #f43f5e;
  --gd-teal: #10b981;
  --gd-ochre: #d97706;
  --gd-graph-ink: #0f172a;
  --gd-focus: #2563eb;
  --gd-dark-shadow: 22 60 130;
  inline-size: 100%;
  min-inline-size: 0;
  flex: 1 1 100%;
  position: relative;
  isolation: isolate;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  background: #f0f4f9;
  color: var(--gd-ink);
  color-scheme: light;
  font-family: "Manrope Variable", Manrope, system-ui, sans-serif;
  font-size: 13px;
  font-weight: 550;
  font-variant-numeric: tabular-nums;
}
.gd-app[data-theme="dark"] {
  --gd-ink: #f8fafc;
  --gd-muted: #94a3b8;
  --gd-line: rgb(255 255 255 / 12%);
  --gd-grid: rgb(255 255 255 / 10%);
  --gd-rim: rgb(255 255 255 / 20%);
  --gd-edge-light: rgb(255 255 255 / 25%);
  --gd-edge-shade: rgb(0 0 0 / 40%);
  --gd-gloss: rgb(255 255 255 / 10%);
  --gd-frame: rgb(15 23 42 / 70%);
  --gd-rail: rgb(15 23 42 / 80%);
  --gd-card: rgb(30 41 59 / 70%);
  --gd-card-light: rgb(51 65 85 / 50%);
  --gd-raised: rgb(51 65 85 / 80%);
  --gd-inner: rgb(30 41 59 / 80%);
  --gd-surface: #0f172a;
  --gd-track: rgb(51 65 85 / 60%);
  --gd-primary: #3b82f6;
  --gd-primary-ink: #ffffff;
  --gd-pick: #3b82f6;
  --gd-pick-ink: #ffffff;
  --gd-coral: #fb7185;
  --gd-teal: #34d399;
  --gd-ochre: #fbbf24;
  --gd-graph-ink: #f8fafc;
  --gd-focus: #60a5fa;
  --gd-dark-shadow: 0 0 0;
  background: #0b0f19;
  color-scheme: dark;
}

.gd-app *, .gd-app *::before, .gd-app *::after { box-sizing: border-box; }
.gd-app :where(button, input, select) { color: inherit; font: inherit; }
.gd-app :where(button, a, input, select):focus-visible { outline: 2px solid var(--gd-focus); outline-offset: 3px; }
.gd-app a { color: inherit; text-decoration: none; }
.gd-app button { cursor: pointer; }
.gd-app :where(h1, h2, h3, p, figure) { margin: 0; }
.gd-app svg { flex: none; }
.gd-sr { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

.gd-background, .gd-app::before {
  position: fixed;
  z-index: -2;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  pointer-events: none;
}
.gd-background {
  object-fit: cover;
  object-position: center 60%;
  filter: saturate(1.1) brightness(1.02);
  opacity: 0.85;
}
.gd-app::before {
  content: "";
  z-index: -1;
  background: radial-gradient(circle at 10% 20%, rgb(37 99 235 / 12%), transparent 40%),
              radial-gradient(circle at 90% 80%, rgb(56 189 248 / 15%), transparent 45%);
}
.gd-app[data-theme="dark"] .gd-background { filter: saturate(.85) brightness(.45); opacity: 0.6; }
.gd-surround {
  inline-size: calc(100% - 48px);
  max-inline-size: 100%;
  margin-inline: auto;
  padding: 10px 0 6px 0;
  height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.gd-top, .gd-dock {
  border: 1px solid var(--gd-rim);
  background: linear-gradient(165deg, var(--gd-gloss), transparent 32% 73%, var(--gd-gloss)), var(--gd-rail);
  box-shadow: inset 1px 1px 1px var(--gd-edge-light), inset -1px -1px 1px var(--gd-edge-shade),
    inset 0 -2px 5px var(--gd-gloss), 0 10px 30px rgb(var(--gd-dark-shadow) / 10%);
  backdrop-filter: blur(20px) saturate(1.8);
  -webkit-backdrop-filter: blur(20px) saturate(1.8);
}
.gd-top {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 460px) minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  min-block-size: 58px;
  border-radius: 999px;
  padding: 5px 12px 5px 16px;
  margin-bottom: 8px;
}
.gd-brand { display: flex; align-items: center; gap: 10px; min-inline-size: 0; padding-inline-start: 3px; }
.gd-logo {
  inline-size: 38px; block-size: 38px; display: grid; place-items: center;
  border-radius: 50%; background: var(--gd-pick); color: var(--gd-pick-ink);
  box-shadow: inset 0 0 0 1px var(--gd-gloss), 0 4px 12px rgb(37 99 235 / 35%);
}
.gd-logo svg { width: 22px; height: 22px; }
.gd-brand strong { display: block; font-size: 13px; letter-spacing: .15em; line-height: 1.1; font-weight: 850; }
.gd-brand small { display: block; margin-block-start: 3px; font-size: 10px; color: var(--gd-primary); font-weight: 700; }
.gd-ask {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-block-size: 43px;
  max-inline-size: 100%;
  border: 1px solid var(--gd-line);
  border-radius: 999px;
  background: var(--gd-inner);
  box-shadow: inset 0 1px 0 var(--gd-gloss);
  padding: 4px 14px 4px 10px;
  text-align: start;
}
.gd-ask:hover, .gd-icon-button:hover { background: var(--gd-raised); }
.gd-orb {
  flex: none;
  inline-size: 25px;
  block-size: 25px;
  border-radius: 50%;
  background:
    radial-gradient(ellipse at 32% 24%, #ffffff 5%, #38bdf8 25%, transparent 58%),
    radial-gradient(ellipse at 67% 54%, #93c5fd, #2563eb 55%, #1e3a8a 79%);
  box-shadow: inset 0 0 0 .75px rgb(255 255 255 / 85%), inset 0 -2px 5px #1d4ed8, 0 0 0 3px rgb(37 99 235 / 15%), 0 2px 8px rgb(37 99 235 / 35%);
}
.gd-prompt {
  overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
  font-size: 12px; font-weight: 750;
  animation: gd-prompt-in .74s steps(28, end) both;
}
@keyframes gd-prompt-in { from { clip-path: inset(0 100% 0 0); } }
.gd-ask-search { margin-inline-start: auto; width: 15px; height: 15px; color: var(--gd-muted); }
.gd-top-actions { display: flex; justify-content: flex-end; gap: 8px; }
.gd-icon-button {
  position: relative; min-inline-size: 44px; min-block-size: 44px; display: inline-grid; place-items: center;
  border-radius: 999px; border: 1px solid var(--gd-line); padding: 0; background: var(--gd-inner);
  transition: all .2s ease;
}
.gd-icon-button svg { width: 17px; height: 17px; stroke-width: 1.75; }
.gd-notices { background: var(--gd-raised); }
.gd-notices i {
  position: absolute; block-size: 6px; inline-size: 6px; inset: 9px 9px auto auto; border-radius: 50%;
  background: var(--gd-coral); box-shadow: 0 0 0 2px var(--gd-surface);
}

.gd-stage-wrap {
  flex: 1;
  min-height: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0;
}
.gd-stage {
  color: var(--gd-ink);
  border: 1px solid var(--gd-rim);
  border-radius: 30px;
  background:
    linear-gradient(148deg, var(--gd-gloss), transparent 19% 77%, color-mix(in srgb, var(--gd-gloss) 48%, transparent)),
    var(--gd-frame);
  box-shadow: inset 1px 1px 1px var(--gd-edge-light), inset -1px -1px 1px var(--gd-edge-shade),
    inset 0 0 7px var(--gd-gloss),
    0 4px 15px rgb(var(--gd-dark-shadow) / 5%), 0 24px 60px rgb(var(--gd-dark-shadow) / 8%);
  backdrop-filter: blur(var(--gd-panel-frost, 16px)) saturate(1.4);
  -webkit-backdrop-filter: blur(var(--gd-panel-frost, 16px)) saturate(1.4);
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.gd-stage-scroll {
  flex: 1;
  min-height: 0;
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--gd-line) transparent;
  border-radius: inherit;
  padding: clamp(16px, 1.8vw, 26px) clamp(20px, 2.4vw, 36px) 56px;
}
.gd-view-head {
  display: flex; align-items: flex-end; justify-content: space-between; gap: 12px 22px;
  margin-block-end: 22px;
}
.gd-view-head h1 {
  font-size: clamp(28px, 3.2vw, 46px);
  font-weight: 800;
  line-height: 1.03;
  letter-spacing: -.05em;
  color: var(--gd-ink);
}
.gd-view-head p { color: var(--gd-muted); font-size: 13px; margin-block-start: 6px; font-weight: 500; }
.gd-view-actions { display: flex; align-items: center; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }
.gd-period {
  display: inline-flex; align-items: center; padding: 3px; border-radius: 999px;
  border: 1px solid var(--gd-rim); background: var(--gd-inner);
  box-shadow: inset 0 1px 0 var(--gd-gloss);
}
.gd-period button {
  min-block-size: 35px; min-inline-size: 60px; border: 0; border-radius: 999px; background: transparent;
  padding: 0 12px; font-size: 11.5px; font-weight: 750; white-space: nowrap; transition: all .2s;
}
.gd-period button[aria-pressed="true"] { background: var(--gd-primary); color: var(--gd-primary-ink); shadow: 0 2px 8px rgb(37 99 235 / 30%); }
.gd-period button[aria-pressed="false"]:hover { background: var(--gd-inner); }

.gd-primary, .gd-secondary {
  display: inline-flex; justify-content: center; align-items: center; gap: 7px;
  min-block-size: 40px; padding: 7px 14px;
  font-size: 11.5px; font-weight: 790; line-height: 1.2; border-radius: 999px;
  border: 1px solid transparent; transition: all .2s;
}
.gd-primary { background: var(--gd-primary); color: var(--gd-primary-ink); box-shadow: 0 4px 14px rgb(37 99 235 / 35%); }
.gd-secondary { background: var(--gd-raised); border-color: var(--gd-rim); color: var(--gd-ink); }
.gd-primary:hover { filter: brightness(1.12); transform: translateY(-1px); }
.gd-secondary:hover { background: var(--gd-surface); }
.gd-primary svg, .gd-secondary svg { width: 14px; height: 14px; }
.gd-export { white-space: nowrap; }
.gd-content { min-inline-size: 0; }
.gd-analytics, .gd-command-grid, .gd-command-side, .gd-summary, .gd-metric-grid, .gd-analytics-grid { display: grid; gap: 14px; }
.gd-command-grid { grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr) minmax(0, 1.05fr); align-items: stretch; }
.gd-command-side { grid-column: 1; align-content: start; }
.gd-command-grid > .gd-activity { grid-column: 2 / -1; }
.gd-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; padding: 6px; }
.gd-analytics-grid { grid-template-columns: minmax(0, 1.75fr) minmax(0, 1fr); }
.gd-metric-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }

.gd-panel, .gd-metric, .gd-summary {
  min-inline-size: 0;
  border: 1px solid var(--gd-rim);
  border-radius: 24px;
  background: linear-gradient(144deg, var(--gd-card-light), transparent 66%), var(--gd-card);
  box-shadow: inset 0 1px 1px var(--gd-edge-light), inset 0 -1px 1px var(--gd-edge-shade), 0 8px 24px rgb(var(--gd-dark-shadow) / 6%);
}
.gd-summary { border-radius: 24px; background: var(--gd-inner); }
.gd-summary .gd-metric { border-radius: 18px; }
.gd-panel { padding: 18px 20px; }
.gd-panel-head {
  display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start;
  gap: 7px 12px; margin-block-end: 14px;
}
.gd-panel-head h2 { font-size: 15px; font-weight: 810; letter-spacing: -.02em; }
.gd-panel-head p { font-size: 11px; color: var(--gd-muted); margin-block-start: 3px; }
.gd-metric { display: flex; flex-direction: column; justify-content: space-between; min-block-size: 114px; padding: 14px; }
.gd-metric[data-tone="teal"] {
  --gd-coral: #f43f5e;
  --gd-teal: #10b981;
  --gd-muted: #e2e8f0;
  color: #fff;
  border-color: rgb(16 185 129 / 55%);
  background: radial-gradient(ellipse at 5% -20%, #34d399, transparent 68%), linear-gradient(145deg, #059669, #047857);
  box-shadow: inset 0 1px 2px rgb(209 250 229 / 45%), 0 8px 18px rgb(5 150 105 / 25%);
}
.gd-metric-head { display: flex; justify-content: space-between; align-items: center; gap: 4px; min-inline-size: 0; font-size: 11px; font-weight: 750; }
.gd-metric-icon, .gd-list-icon {
  display: grid; place-items: center; flex: none; color: inherit;
  inline-size: 30px; block-size: 30px; border-radius: 12px;
  background: var(--gd-inner); box-shadow: inset 0 1px 0 var(--gd-gloss);
}
.gd-metric-icon svg, .gd-list-icon svg { width: 15px; height: 15px; }
.gd-metric[data-tone="teal"] .gd-metric-icon { background: rgb(255 255 255 / 20%); }
.gd-metric-value { display: block; font-size: clamp(24px, 2.4vw, 36px); line-height: 1.05; margin-block: 4px 8px; letter-spacing: -.05em; font-weight: 820; }
.gd-summary .gd-metric-value { font-size: clamp(22px, 2vw, 32px); }
.gd-metric-caption, .gd-balance-change { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; color: var(--gd-muted); font-size: 10.5px; font-weight: 650; }
.gd-delta {
  display: inline-flex; align-items: center; gap: 2px; color: var(--gd-teal); font-weight: 850;
  border-radius: 6px; padding: 2px 5px;
  background: color-mix(in srgb, var(--gd-teal) 14%, transparent);
}
.gd-delta[data-attention="true"] { color: var(--gd-coral); background: color-mix(in srgb, var(--gd-coral) 12%, transparent); }
.gd-delta svg { width: 11px; height: 11px; stroke-width: 2.4; }

.gd-balance .gd-panel-head { align-items: center; margin-block-end: 9px; }
.gd-unit { border-radius: 6px; padding: 4px 8px; background: var(--gd-raised); font-size: 10px; font-weight: 810; color: var(--gd-primary); }
.gd-balance-number { font-size: clamp(30px, 3.9vw, 56px); font-weight: 850; letter-spacing: -.07em; line-height: 1.02; color: var(--gd-ink); }
.gd-balance-change { margin-block-start: 7px; }
.gd-balance-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-block: 14px 12px; }
.gd-streams { display: flex; border-radius: 14px; background: var(--gd-inner); padding: 8px 4px; }
.gd-streams div { flex: 1; min-inline-size: 0; padding: 0 8px; }
.gd-streams div + div { border-inline-start: 1px solid var(--gd-line); }
.gd-streams span, .gd-streams strong { display: block; }
.gd-streams span { font-size: 9.5px; color: var(--gd-muted); }
.gd-streams strong { font-size: 11.5px; font-weight: 810; margin-block-start: 4px; }
.gd-capacity .gd-panel-head, .gd-approvals .gd-panel-head { margin-block-end: 10px; }
.gd-capacity-track, .gd-mix-track { display: block; height: 8px; border-radius: 999px; overflow: hidden; background: var(--gd-track); }
.gd-capacity-track .gd-fill { display: block; block-size: 100%; border-radius: inherit; background: var(--gd-primary); transform-origin: left center; }
.gd-capacity-label { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px; color: var(--gd-muted); font-size: 10px; margin-top: 8px; }
.gd-capacity-label strong { color: var(--gd-ink); }
.gd-approval-content { display: flex; align-items: center; gap: 10px; min-inline-size: 0; }
.gd-approval-content .gd-list-icon { inline-size: 38px; block-size: 38px; color: var(--gd-primary); background: color-mix(in srgb, var(--gd-primary) 12%, var(--gd-inner)); }
.gd-approval-content div { flex: 1; min-inline-size: 0; }
.gd-approval-content strong, .gd-approval-content small { display: block; }
.gd-approval-content strong { font-size: 12.5px; font-weight: 810; }
.gd-approval-content small { margin-top: 3px; font-size: 10.5px; color: var(--gd-muted); }
.gd-statement .gd-panel-head { margin-block-end: 8px; }

.gd-table-tools { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; max-inline-size: 100%; }
.gd-search, .gd-filter {
  display: inline-flex; align-items: center; gap: 6px; border: 1px solid var(--gd-line); border-radius: 12px;
  background: var(--gd-inner); min-block-size: 36px; padding: 0 10px;
}
.gd-search svg, .gd-filter svg { width: 13px; height: 13px; color: var(--gd-muted); }
.gd-search input { width: 120px; flex: 1; min-inline-size: 0; border: 0; background: transparent; min-block-size: 33px; }
.gd-search input::placeholder { color: var(--gd-muted); opacity: 1; }
.gd-search input, .gd-filter select { font-size: 11px; }
.gd-filter select { border: 0; background: transparent; padding: 5px 0; min-inline-size: 0; }
.gd-filter select option { color: var(--gd-ink); background: var(--gd-surface); }
.gd-search:focus-within, .gd-filter:focus-within { outline: 2px solid var(--gd-focus); }
.gd-app .gd-search input:focus-visible, .gd-app .gd-filter select:focus-visible { outline: none; }
.gd-table-scroll { max-inline-size: 100%; overflow: auto; scrollbar-width: thin; }
.gd-table-scroll table { inline-size: 100%; border-spacing: 0; text-align: start; }
.gd-table-scroll th, .gd-table-scroll td { padding: 10px 12px; text-align: start; }
.gd-table-scroll th { background: var(--gd-inner); font-size: 10.5px; color: var(--gd-muted); font-weight: 800; }
.gd-table-scroll th:first-child { border-radius: 10px 0 0 10px; }
.gd-table-scroll th:last-child { border-radius: 0 10px 10px 0; }
.gd-table-scroll td { white-space: nowrap; font-size: 11.5px; }
.gd-table-scroll td:first-child { font-weight: 750; }
.gd-table-scroll tr + tr td { border-top: 1px solid var(--gd-line); }
.gd-status {
  --gd-status-color: var(--gd-graph-ink);
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 8px; border-radius: 999px; font-size: 10px; font-weight: 790;
  background: color-mix(in srgb, var(--gd-status-color) 12%, var(--gd-inner));
  color: var(--gd-status-color); white-space: nowrap;
}
.gd-status[data-state="teal"] { --gd-status-color: var(--gd-teal); }
.gd-status[data-state="coral"] { --gd-status-color: var(--gd-coral); }
.gd-status i { inline-size: 5px; block-size: 5px; border-radius: 50%; background: currentColor; }
.gd-empty { padding: 12px 3px; color: var(--gd-muted); font-size: 12px; }

.gd-app [data-tone="ink"] { --gd-series: var(--gd-graph-ink); }
.gd-app [data-tone="coral"] { --gd-series: var(--gd-coral); }
.gd-app [data-tone="teal"] { --gd-series: var(--gd-teal); }
.gd-app [data-tone="ochre"] { --gd-series: var(--gd-primary); }
.gd-legend { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; color: var(--gd-muted); }
.gd-legend span, .gd-device-list button span:first-child { display: inline-flex; align-items: center; gap: 6px; font-size: 10.5px; font-weight: 740; }
.gd-legend i, .gd-device-list button span:first-child i { inline-size: 7px; block-size: 7px; border-radius: 50%; background: var(--gd-series); }
.gd-stack-meta { display: flex; justify-content: space-between; align-items: center; height: 20px; gap: 4px; }
.gd-chart-readout { font-size: 10.5px; font-weight: 830; white-space: nowrap; }
.gd-stack-plot { display: grid; grid-template-columns: repeat(var(--gd-series-count), minmax(0, 1fr)); gap: 5px; block-size: 194px; margin-top: 6px; }
.gd-command-chart .gd-stack-plot { block-size: 144px; }
.gd-stack-column { display: flex; flex-direction: column; align-items: center; min-inline-size: 0; border: 0; border-radius: 8px; background: transparent; padding: 3px 0 0; }
.gd-stack-column:is(:focus-visible, :hover, [aria-pressed="true"]) { background: var(--gd-inner); }
.gd-stack-track { display: flex; justify-content: center; align-items: end; flex: 1; inline-size: 100%; border-bottom: 1px solid var(--gd-line); }
.gd-stack-bar {
  display: flex; flex-direction: column; transform-origin: center bottom;
  inline-size: min(65%, 36px); min-inline-size: 6px; border-radius: 6px 6px 3px 3px; overflow: hidden;
}
.gd-stack-bar i { display: block; flex-basis: 0; background: var(--gd-series); min-block-size: 2px; }
.gd-stack-bar i:first-child { background: repeating-linear-gradient(138deg, var(--gd-series) 0 4px, color-mix(in srgb, var(--gd-series) 76%, white) 4px 6px); }
.gd-stack-label { font-size: 9.5px; color: var(--gd-muted); margin-top: 7px; white-space: nowrap; }
.gd-revenue-main { display: grid; grid-template-columns: 38px minmax(0, 1fr); }
.gd-chart-y { display: flex; flex-direction: column; justify-content: space-between; padding-block: 0; font-size: 10px; color: var(--gd-muted); }
.gd-line-plot { position: relative; min-inline-size: 0; block-size: 208px; }
.gd-line-plot svg { display: block; width: 100%; height: 100%; overflow: visible; }
.gd-grid-line { stroke: var(--gd-grid); stroke-dasharray: 3 4; vector-effect: non-scaling-stroke; }
.gd-chart-path { fill: none; stroke: var(--gd-series); stroke-width: 2.5; stroke-linecap: round; vector-effect: non-scaling-stroke; }
.gd-line-cursor { stroke: var(--gd-muted); stroke-dasharray: 2 4; vector-effect: non-scaling-stroke; }
.gd-chart-zones { position: absolute; inset: 0; display: flex; align-items: stretch; }
.gd-chart-zones button { flex: 1; min-inline-size: 0; border: 0; background: transparent; padding: 0; border-radius: 2px; }
.gd-line-tooltip {
  pointer-events: none; position: absolute; top: 6px; left: clamp(70px, var(--gd-tooltip-x), calc(100% - 70px)); translate: -50% 0;
  display: grid; gap: 3px; min-inline-size: 140px; padding: 8px 10px; background: var(--gd-surface);
  border: 1px solid var(--gd-line); border-radius: 10px; font-size: 10.5px; box-shadow: 0 6px 16px rgb(var(--gd-dark-shadow) / 12%);
}
.gd-line-tooltip span { display: flex; justify-content: space-between; gap: 10px; }
.gd-chart-axis { display: flex; justify-content: space-between; margin: 9px 0 0 38px; font-size: 9.5px; color: var(--gd-muted); }
.gd-device { display: grid; gap: 10px; justify-items: stretch; }
.gd-device-ring { position: relative; inline-size: min(100%, 150px); aspect-ratio: 1; justify-self: center; }
.gd-device-ring svg { display: block; inline-size: 100%; block-size: 100%; }
.gd-device-segment { stroke: var(--gd-series); transition: opacity .2s ease; }
.gd-device-segment[data-muted="true"] { opacity: .29; }
.gd-device-total { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; pointer-events: none; }
.gd-device-total strong { font-size: 24px; line-height: 1.05; letter-spacing: -.05em; font-weight: 850; }
.gd-device-total > span { font-size: 10px; margin-top: 5px; color: var(--gd-muted); }
.gd-device-list { display: grid; gap: 3px; }
.gd-device-list button {
  display: grid; grid-template-columns: 80px minmax(0, 1fr) 34px; gap: 8px; align-items: center;
  min-block-size: 32px; text-align: start; background: transparent; border: 0; border-radius: 8px; padding: 4px 8px;
}
.gd-device-list button:is(:hover, [aria-pressed="true"]) { background: var(--gd-inner); }
.gd-device-list button strong { text-align: end; font-weight: 850; font-size: 11px; }
.gd-mix-track { height: 5px; }
.gd-mix-track .gd-fill { display: block; block-size: 100%; border-radius: inherit; background: var(--gd-series); transform-origin: left center; }

.gd-lanes { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
.gd-lanes[data-filtered="true"] { grid-template-columns: minmax(0, 1fr); }
.gd-lane { min-inline-size: 0; border: 1px solid var(--gd-line); background: var(--gd-inner); padding: 8px; border-radius: 18px; }
.gd-lane header { display: flex; align-items: center; gap: 6px; padding: 4px 6px 10px; }
.gd-lane header i { display: inline-grid; place-items: center; border-radius: 8px; width: 24px; height: 24px; color: var(--gd-series); background: color-mix(in srgb, var(--gd-series) 13%, transparent); }
.gd-lane header svg { width: 14px; height: 14px; }
.gd-lane header h3 { min-inline-size: 0; font-size: 11.5px; font-weight: 840; }
.gd-lane header span { margin-inline-start: auto; color: var(--gd-muted); font-size: 10px; font-weight: 700; background: var(--gd-raised); padding: 2px 6px; border-radius: 999px; }
.gd-work-item {
  display: grid; gap: 5px; width: 100%; text-align: start; border-radius: 14px; padding: 11px;
  border: 1px solid var(--gd-rim); background: var(--gd-card);
  box-shadow: inset 0 1px 0 var(--gd-gloss), 0 3px 8px rgb(var(--gd-dark-shadow) / 4%);
  transition: all .2s;
}
.gd-work-item + .gd-work-item { margin-top: 8px; }
.gd-work-item:hover { background: var(--gd-raised); transform: translateY(-1px); box-shadow: 0 6px 14px rgb(var(--gd-dark-shadow) / 8%); }
.gd-work-titlerow, .gd-work-meta { display: flex; align-items: flex-start; justify-content: space-between; gap: 6px; }
.gd-work-titlerow strong { font-size: 12px; font-weight: 820; color: var(--gd-ink); }
.gd-work-titlerow svg { width: 14px; height: 14px; color: var(--gd-muted); }
.gd-work-detail { font-size: 10.5px; line-height: 1.42; color: var(--gd-muted); }
.gd-work-meta { font-size: 9.5px; font-weight: 750; margin-top: 3px; color: var(--gd-muted); }

.gd-dock {
  position: absolute; z-index: 3;
  display: flex; align-items: center; gap: 4px; padding: 5px; border-radius: 999px;
}
.gd-dock-side { flex-direction: column; left: -26px; top: clamp(66px, 16vh, 153px); }
.gd-dock-bottom { position: relative; left: auto; bottom: auto; translate: none; z-index: 10; }
.gd-bottom-dock-container {
  display: flex; justify-content: center; align-items: center;
  padding: 6px 0 2px 0; flex-shrink: 0; z-index: 20;
}
.gd-carousel-panel { grid-column: 1 / -1; }
.gd-dock a {
  z-index: 1; position: relative; display: flex; gap: 7px; justify-content: center; align-items: center;
  min-inline-size: 42px; min-block-size: 42px; padding: 0 14px; border-radius: 999px;
  font-size: 11.5px; font-weight: 800; white-space: nowrap; color: var(--gd-ink);
}
.gd-dock-side a { padding: 0; }
.gd-dock a svg { width: 17px; height: 17px; stroke-width: 1.9; }
.gd-dock a[aria-current="page"] { color: var(--gd-pick-ink); }
.gd-dock a:not([aria-current="page"]):hover { background: var(--gd-inner); }
.gd-dock-indicator {
  position: absolute; inset: 0 auto auto 0; pointer-events: none; visibility: hidden;
  border-radius: 999px; background: var(--gd-pick); box-shadow: inset 0 1px 0 white, 0 4px 12px rgb(37 99 235 / 40%);
}
.gd-dock-indicator[data-ready="true"] { visibility: visible; transition: transform .36s cubic-bezier(.24, .89, .26, 1), width .36s cubic-bezier(.24, .89, .26, 1), height .36s cubic-bezier(.24, .89, .26, 1); }
.gd-dock-side .gd-dock-text, .gd-dock-short { display: none; }
.gd-dock-tip {
  display: none; position: absolute; left: calc(100% + 8px); z-index: 1; pointer-events: none;
  color: var(--gd-ink); background: var(--gd-surface); padding: 6px 10px; border: 1px solid var(--gd-rim);
  border-radius: 8px; box-shadow: 0 4px 12px rgb(var(--gd-dark-shadow) / 15%); font-size: 11px;
}
.gd-dock-side a:is(:hover, :focus-visible) .gd-dock-tip { display: inline; }

.gd-dialog {
  max-inline-size: min(calc(100% - 26px), 520px); inline-size: 100%;
  border-radius: 28px; border: 1px solid var(--gd-rim); color: var(--gd-ink); padding: 0;
  background: var(--gd-surface); box-shadow: 0 24px 80px rgb(var(--gd-dark-shadow) / 30%);
}
.gd-dialog::backdrop { background: rgb(15 23 42 / 40%); backdrop-filter: blur(6px); }
.gd-dialog-inner { padding: 22px; }
.gd-dialog-inner > header { display: flex; gap: 10px; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.gd-dialog-inner h2 { font-size: 22px; font-weight: 830; letter-spacing: -.04em; }
.gd-command-input { inline-size: 100%; padding-inline: 12px; margin-bottom: 10px; min-block-size: 46px; }
.gd-command-input input { min-block-size: 42px; font-size: 13.5px; }
.gd-quick-list { display: grid; gap: 6px; }
.gd-quick-list button {
  display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 12px;
  text-align: start; border: 1px solid var(--gd-line); border-radius: 12px; background: var(--gd-inner);
  transition: all .2s;
}
.gd-quick-list button:hover { background: var(--gd-raised); transform: translateX(2px); }
.gd-quick-list button svg { width: 16px; height: 16px; color: var(--gd-muted); }
.gd-quick-list button div { flex: 1; }
.gd-quick-list strong, .gd-quick-list small { display: block; }
.gd-quick-list small { color: var(--gd-muted); margin-top: 2px; font-size: 11px; }
.gd-work-dialog-description { margin: 12px 0; font-size: 12px; color: var(--gd-muted); }
.gd-work-facts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-bottom: 16px; }
.gd-work-facts div { border: 1px solid var(--gd-line); border-radius: 12px; padding: 10px; background: var(--gd-inner); }
.gd-work-facts dt { font-size: 10.5px; color: var(--gd-muted); }
.gd-work-facts dd { margin: 4px 0 0; font-weight: 800; font-size: 12px; }

@media (max-width: 1060px) {
  .gd-surround { inline-size: calc(100% - 74px); }
  .gd-stage-scroll { padding-inline: 28px; }
  .gd-command-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
  .gd-command-grid > .gd-command-chart { grid-column: 1; }
  .gd-command-side { grid-column: 2; }
  .gd-command-grid > .gd-activity { grid-column: 1 / -1; }
}
@media (max-width: 760px) {
  .gd-surround { padding-top: 11px; padding-bottom: calc(73px + env(safe-area-inset-bottom)); inline-size: calc(100% - 24px); }
  .gd-top { grid-template-columns: minmax(0, 1fr) auto; padding: 7px 10px; gap: 6px 12px; border-radius: 22px; }
  .gd-brand { padding-inline-start: 3px; }
  .gd-ask { grid-area: 2 / 1 / 3 / -1; min-block-size: 41px; }
  .gd-top-actions { grid-area: 1 / 2; }
  .gd-top-actions .gd-icon-button { width: 41px; min-inline-size: 41px; min-block-size: 41px; }
  .gd-stage { border-radius: 24px; }
  .gd-stage-scroll { block-size: auto; padding: 16px 14px 18px; overflow: visible; }
  .gd-view-head { align-items: flex-start; flex-direction: column; gap: 10px; margin-bottom: 14px; }
  .gd-view-head p { font-size: 12px; margin-top: 4px; }
  .gd-view-actions { justify-content: flex-start; }
  .gd-command-grid, .gd-analytics-grid { grid-template-columns: minmax(0, 1fr); }
  .gd-command-side, .gd-command-grid > .gd-activity { grid-column: 1; }
  .gd-metric-grid, .gd-lanes { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .gd-dock-side { display: none; }
  .gd-dock-bottom { position: fixed; inset: auto 11px calc(9px + env(safe-area-inset-bottom)); translate: none; justify-content: space-between; }
  .gd-dock-bottom a { flex: 1; flex-direction: column; gap: 2px; padding: 4px 6px; min-block-size: 48px; line-height: 1.2; font-size: 10px; }
  .gd-dock-bottom a svg { width: 16px; height: 16px; }
  .gd-dock-bottom .gd-dock-text { display: none; }
  .gd-dock-bottom .gd-dock-short { display: inline; }
  .gd-footer { padding-top: 10px; }
  .gd-period button { min-block-size: 40px; }
  .gd-primary, .gd-secondary { min-block-size: 42px; }
}
@media (max-width: 420px) {
  .gd-panel { padding: 14px; }
  .gd-metric { padding: 10px; }
  .gd-summary { gap: 6px; padding: 6px; }
  .gd-chart-axis span:nth-child(even) { visibility: hidden; }
  .gd-chart-y { font-size: 9px; }
  .gd-stack-label { font-size: 8px; }
  .gd-lanes { grid-template-columns: 1fr; }
  .gd-table-scroll table { min-inline-size: 280px; }
  .gd-table-scroll th, .gd-table-scroll td { padding-inline: 8px; }
  .gd-table-scroll td { font-size: 10.5px; }
}
`;

const periods = ["7 days", "30 days", "90 days"] as const;
type Period = typeof periods[number];

const analytics = {
  "7 days": {
    revenue: 556, orders: 110, visitors: 90, refunds: 114, automation: 488, subscribers: 556,
    revenueChange: "+6.4%", orderChange: "+2.0%", visitorChange: "-4.8%", refundChange: "+1.0%",
    axis: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    collected: [12, 16, 14, 18, 22, 26, 24, 21, 28, 30, 23, 32],
    costs: [9, 12, 10, 14, 17, 19, 18, 16, 20, 21, 18, 22],
    desktop: [63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63],
    devices: [63, 12, 11], // Middle 63%, Lead 12%, Head 11%
  },
  "30 days": {
    revenue: 556, orders: 110, visitors: 90, refunds: 114, automation: 488, subscribers: 556,
    revenueChange: "+6.4%", orderChange: "+2.0%", visitorChange: "-4.8%", refundChange: "+1.0%",
    axis: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    collected: [14, 18, 15, 20, 25, 29, 26, 24, 30, 32, 25, 35],
    costs: [10, 13, 11, 15, 18, 21, 19, 18, 22, 23, 19, 24],
    desktop: [63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63],
    devices: [63, 12, 11],
  },
  "90 days": {
    revenue: 556, orders: 110, visitors: 90, refunds: 114, automation: 488, subscribers: 556,
    revenueChange: "+6.4%", orderChange: "+2.0%", visitorChange: "-4.8%", refundChange: "+1.0%",
    axis: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    collected: [15, 20, 18, 22, 28, 32, 29, 27, 34, 36, 28, 38],
    costs: [11, 15, 13, 16, 20, 23, 21, 20, 24, 25, 21, 26],
    desktop: [63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63],
    devices: [63, 12, 11],
  },
} satisfies Record<Period, {
  revenue: number; orders: number; visitors: number; refunds: number; automation: number; subscribers: number;
  revenueChange: string; orderChange: string; visitorChange: string; refundChange: string;
  axis: string[]; collected: number[]; costs: number[]; desktop: number[]; devices: number[];
}>;

const automationActivity = [
  { label: "Jan", complete: 28, review: 14 },
  { label: "Feb", complete: 42, review: 18 },
  { label: "Mar", complete: 32, review: 16 },
  { label: "Apr", complete: 36, review: 18 },
  { label: "May", complete: 44, review: 20 },
  { label: "Jun", complete: 52, review: 24 },
  { label: "Jul", complete: 46, review: 20 },
  { label: "Aug", complete: 40, review: 18 },
  { label: "Sep", complete: 48, review: 22 },
  { label: "Oct", complete: 54, review: 26 },
  { label: "Nov", complete: 42, review: 19 },
  { label: "Dec", complete: 50, review: 25 },
];

export type WorkStatus = "Needs review" | "Scheduled" | "Running" | "Exceptions";
const workStatuses: WorkStatus[] = ["Needs review", "Scheduled", "Running", "Exceptions"];

export type WorkItem = {
  id: string;
  name: string;
  description: string;
  tool: string;
  owner: string;
  status: WorkStatus;
  timestamp: string;
};

const initialWork: WorkItem[] = [
  { id: "NB-BGV-1001", name: "Rohan Sharma", description: "Infosys Technologies verification complete. Positive conduct confirmed.", tool: "Infosys", owner: "Pooja Kulkarni", status: "Running", timestamp: "Today 04:10 PM" },
  { id: "NB-BGV-1002", name: "Ananya Verma", description: "Wipro Digital verification opened by employer representative.", tool: "Wipro", owner: "BGV Operations", status: "Scheduled", timestamp: "Today 01:20 PM" },
  { id: "NB-BGV-1003", name: "Vikramaditya Rao", description: "Accenture India verification email dispatched with secure token.", tool: "Accenture", owner: "HR Team", status: "Scheduled", timestamp: "Today 11:15 AM" },
  { id: "NB-BGV-1004", name: "Priya Sundaram", description: "Draft created for Zomato Media prior employment.", tool: "Zomato", owner: "HR Ops", status: "Needs review", timestamp: "Today 03:20 PM" },
  { id: "NB-BGV-1005", name: "Kunal Deshmukh", description: "TCS verification link expired after 30-day window without response.", tool: "TCS", owner: "Compliance", status: "Exceptions", timestamp: "15 Jan" },
];

const recentActivity = [
  { id: "NB-BGV-1001", event: "Rohan Sharma verified as Eligible", source: "Infosys", status: "Complete", time: "16:10" },
  { id: "NB-BGV-1002", event: "Verification link opened", source: "Wipro", status: "Running", time: "13:20" },
  { id: "NB-BGV-1003", event: "Verification email dispatched", source: "Accenture", status: "Scheduled", time: "11:15" },
  { id: "NB-BGV-1004", event: "Draft created by Neha Kapoor", source: "Zomato", status: "Needs review", time: "15:20" },
  { id: "NB-BGV-1005", event: "Verification window expired", source: "TCS", status: "Exceptions", time: "18 Jan" },
] as const;

const number = new Intl.NumberFormat("en-US");
const formatCompact = (val: number) => val.toString();

type ChartTone = "coral" | "ink" | "teal" | "ochre";
type CountFormat = "number" | "usd" | "compact" | "percent";

const formatCount: Record<CountFormat, (value: number) => string> = {
  number: (value) => number.format(Math.round(value)),
  usd: (value) => number.format(Math.round(value)),
  compact: (value) => formatCompact(Math.round(value)),
  percent: (value) => `${value.toFixed(1)}%`,
};

function Counter({ value, format = "number" }: { value: number; format?: CountFormat }) {
  const text = formatCount[format](value);
  return (
    <>
      <span data-gd-count={value} data-format={format} aria-hidden="true">
        {text}
      </span>
      <span className="gd-sr">{text}</span>
    </>
  );
}

function Legend({ entries }: { entries: { label: string; tone: ChartTone }[] }) {
  return (
    <div className="gd-legend">
      {entries.map(({ label, tone }) => (
        <span key={label}>
          <i data-tone={tone} aria-hidden="true" />
          {label}
        </span>
      ))}
    </div>
  );
}

type Stack = { label: string; lower: number; upper: number };

function StackChart({
  items,
  labels,
  tones,
  format,
  title,
}: {
  items: Stack[];
  labels: [string, string];
  tones: [ChartTone, ChartTone];
  format: (value: number) => string;
  title: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...items.map((item) => item.lower + item.upper)) * 1.11;
  const selected = active === null ? undefined : items[active];

  return (
    <figure className="gd-stack" aria-label={title}>
      <div className="gd-stack-meta">
        <Legend entries={labels.map((label, index) => ({ label, tone: tones[index] }))} />
        {selected && (
          <span className="gd-chart-readout">
            {selected.label} · {format(selected.lower + selected.upper)}
          </span>
        )}
      </div>
      <div
        className="gd-stack-plot"
        style={{ "--gd-series-count": items.length } as CSSProperties}
        onMouseLeave={() => setActive(null)}
      >
        {items.map((item, index) => (
          <button
            type="button"
            className="gd-stack-column"
            key={item.label}
            aria-label={`${item.label}: ${format(item.lower)} ${labels[0]}, ${format(item.upper)} ${labels[1]}`}
            aria-pressed={active === index}
            onFocus={() => setActive(index)}
            onBlur={() => setActive(null)}
            onMouseEnter={() => setActive(index)}
            onClick={() => setActive(index)}
          >
            <span className="gd-stack-track" aria-hidden="true">
              <span className="gd-stack-bar" style={{ height: `${((item.lower + item.upper) / max) * 100}%` }}>
                <i data-tone={tones[1]} style={{ flexGrow: item.upper }} />
                <i data-tone={tones[0]} style={{ flexGrow: item.lower }} />
              </span>
            </span>
            <span className="gd-stack-label" aria-hidden="true">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </figure>
  );
}

type Point = [number, number];

function curve(points: Point[]) {
  return points.reduce((path, [x, y], index) => {
    if (index === 0) return `M ${x} ${y}`;
    const [previousX, previousY] = points[index - 1];
    const midpoint = (x + previousX) / 2;
    return `${path} C ${midpoint} ${previousY}, ${midpoint} ${y}, ${x} ${y}`;
  }, "");
}

function RevenueChart({ labels, revenue, costs }: { labels: string[]; revenue: number[]; costs: number[] }) {
  const fillId = `revenue-fill-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [active, setActive] = useState<number | null>(null);
  const plotHeight = 204;
  const width = 600;
  const max = Math.ceil((Math.max(...revenue, ...costs) * 1.14) / 2.5) * 2.5;
  const points = (values: number[]): Point[] =>
    values.map((value, index) => [
      (index * width) / Math.max(1, values.length - 1),
      plotHeight - (value / max) * plotHeight,
    ]);
  const revenuePoints = points(revenue);
  const costPoints = points(costs);
  const revenueLine = curve(revenuePoints);
  const last = ((revenuePoints.length - 1) * width) / Math.max(1, revenuePoints.length - 1);
  const point = active === null ? undefined : revenuePoints[active];
  const costPoint = active === null ? undefined : costPoints[active];
  const ticks = [max, max * 0.75, max * 0.5, max * 0.25, 0];

  return (
    <figure className="gd-revenue-chart" aria-label="Verifications volume over time">
      <div className="gd-revenue-main">
        <div className="gd-chart-y" aria-hidden="true">
          {ticks.map((value) => (
            <span key={value}>{value === 0 ? "0" : `${Number(value.toFixed(0))}`}</span>
          ))}
        </div>
        <div className="gd-line-plot" onMouseLeave={() => setActive(null)}>
          <svg viewBox={`0 0 ${width} ${plotHeight}`} preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id={fillId} x1="0" x2="0" y1="0" y2="1" gradientUnits="objectBoundingBox">
                <stop offset="0" stopColor="var(--gd-primary)" stopOpacity="0.30" />
                <stop offset="1" stopColor="var(--gd-primary)" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {ticks.map((tick, index) => (
              <line
                className="gd-grid-line"
                key={tick}
                x1="0"
                x2={width}
                y1={(plotHeight * index) / 4}
                y2={(plotHeight * index) / 4}
              />
            ))}
            <g className="gd-line-reveal">
              <path d={`${revenueLine} L ${last} ${plotHeight} H 0 Z`} fill={`url(#${fillId})`} />
              <path className="gd-chart-path" data-tone="ochre" d={revenueLine} />
              <path className="gd-chart-path" data-tone="ink" d={curve(costPoints)} />
            </g>
            {point && costPoint && (
              <g>
                <line className="gd-line-cursor" x1={point[0]} x2={point[0]} y1="0" y2={plotHeight} />
                <circle cx={point[0]} cy={point[1]} r="4" fill="var(--gd-primary)" />
                <circle cx={costPoint[0]} cy={costPoint[1]} r="4" fill="var(--gd-graph-ink)" />
              </g>
            )}
          </svg>
          <div className="gd-chart-zones">
            {labels.map((label, index) => (
              <button
                type="button"
                key={label}
                aria-label={`${label}, verified ${revenue[index]}, pending ${costs[index]}`}
                aria-pressed={active === index}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(null)}
                onMouseEnter={() => setActive(index)}
                onClick={() => setActive(index)}
              />
            ))}
          </div>
          {active !== null && (
            <div
              className="gd-line-tooltip"
              style={{ "--gd-tooltip-x": `${(active / (labels.length - 1)) * 100}%` } as CSSProperties}
            >
              <strong>{labels[active]}</strong>
              <span>
                Verified <b>{revenue[active]}</b>
              </span>
              <span>
                Pending <b>{costs[active]}</b>
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="gd-chart-axis" aria-hidden="true">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </figure>
  );
}

const deviceLabels = ["Middle Grade", "Lead", "Head"];
const deviceTones: ChartTone[] = ["ochre", "ink", "teal"];

function DeviceChart({ mix, visitors }: { mix: number[]; visitors: number }) {
  const maskId = `gd-ring-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="gd-device" aria-label="Employees breakdown">
      <div className="gd-device-ring">
        <svg viewBox="0 0 124 124" aria-hidden="true">
          <defs>
            <mask id={maskId}>
              <circle
                className="gd-donut-draw"
                cx="62"
                cy="62"
                r="47"
                fill="none"
                stroke="white"
                strokeWidth="15"
                pathLength="100"
                strokeDasharray="100 0"
                transform="rotate(-90 62 62)"
              />
            </mask>
          </defs>
          <circle cx="62" cy="62" r="47" fill="none" stroke="var(--gd-track)" strokeWidth="14" />
          <g mask={`url(#${maskId})`} transform="rotate(-90 62 62)">
            {mix.map((ratio, index) => (
              <circle
                key={deviceLabels[index]}
                cx="62"
                cy="62"
                r="47"
                pathLength="100"
                fill="none"
                strokeWidth="14"
                data-tone={deviceTones[index]}
                className="gd-device-segment"
                data-muted={active !== null && index !== active}
                strokeDasharray={`${Math.max(0, ratio - 1.1)} 100`}
                strokeDashoffset={-mix.slice(0, index).reduce((sum, value) => sum + value, 0)}
              />
            ))}
          </g>
        </svg>
        <div className="gd-device-total">
          <strong>{active === null ? <Counter value={visitors} /> : number.format(Math.round((visitors * mix[active]) / 100))}</strong>
          <span>{active === null ? "Employees" : deviceLabels[active]}</span>
        </div>
      </div>
      <div className="gd-device-list">
        {mix.map((ratio, index) => (
          <button
            type="button"
            key={deviceLabels[index]}
            aria-pressed={active === index}
            aria-label={`${deviceLabels[index]}, ${ratio}% of candidates`}
            onClick={() => setActive(active === index ? null : index)}
          >
            <span>
              <i data-tone={deviceTones[index]} aria-hidden="true" />
              {deviceLabels[index]}
            </span>
            <span className="gd-mix-track" aria-hidden="true">
              <i className="gd-fill" data-tone={deviceTones[index]} style={{ width: `${ratio}%` }} />
            </span>
            <strong>{ratio}%</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  action,
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`gd-panel ${className}`} data-gd-enter>
      <header className="gd-panel-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

type View = "command" | "trends" | "metrics" | "operations";

type MetricProps = {
  title: string;
  icon: ReactNode;
  value: number;
  format?: CountFormat;
  change?: string;
  detail?: string;
  tone?: "teal" | "coral";
};

function Metric({ title, icon, value, format, change, detail, tone }: MetricProps) {
  return (
    <article className="gd-metric" data-tone={tone} data-gd-enter>
      <div className="gd-metric-head">
        <span>{title}</span>
        <span className="gd-metric-icon" aria-hidden="true">
          {icon}
        </span>
      </div>
      <strong className="gd-metric-value">
        <Counter value={value} format={format} />
      </strong>
      <div className="gd-metric-caption">
        {change && (
          <span className="gd-delta" data-attention={tone === "coral"}>
            {change.startsWith("−") || change.startsWith("-") ? (
              <ArrowDownRight aria-hidden="true" />
            ) : (
              <ArrowUpRight aria-hidden="true" />
            )}
            {change}
          </span>
        )}
        <span>{detail ?? "vs last year"}</span>
      </div>
    </article>
  );
}

function Badge({ status }: { status: string }) {
  const color =
    status === "Complete" || status === "Running"
      ? "teal"
      : status === "Needs review" || status === "Exceptions"
      ? "coral"
      : "ink";
  return (
    <span className="gd-status" data-state={color}>
      <i aria-hidden="true" />
      {status}
    </span>
  );
}

function Activity() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const show = recentActivity.filter(
    (item) =>
      [item.event, item.source, item.status].join(" ").toLowerCase().includes(query.trim().toLowerCase()) &&
      (status === "All statuses" || item.status === status)
  );

  return (
    <Panel
      title="Recent BGV Activity"
      className="gd-activity"
      action={
        <div className="gd-table-tools">
          <label className="gd-search">
            <Search aria-hidden="true" />
            <input
              type="search"
              placeholder="Search candidate..."
              aria-label="Search activity"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="gd-filter">
            <Filter aria-hidden="true" />
            <select aria-label="Filter activity" value={status} onChange={(event) => setStatus(event.target.value)}>
              {["All statuses", "Complete", "Needs review", "Scheduled", "Exceptions"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      }
    >
      <div className="gd-table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Candidate / Action</th>
              <th scope="col">Employer</th>
              <th scope="col">Status</th>
              <th scope="col">Time</th>
            </tr>
          </thead>
          <tbody>
            {show.map((item) => (
              <tr key={item.id}>
                <td>{item.event}</td>
                <td>{item.source}</td>
                <td>
                  <Badge status={item.status} />
                </td>
                <td>{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {show.length === 0 && (
        <p className="gd-empty" role="status">
          No matching activity found.
        </p>
      )}
    </Panel>
  );
}

function CommandView({ period, open }: { period: Period; open: (view: View) => void }) {
  const stats = analytics[period];
  const streams = [
    { label: "Engineering", ratio: 0.63 },
    { label: "Sales & BD", ratio: 0.22 },
    { label: "Product & UX", ratio: 0.15 },
  ];
  const sources = streams.map(({ label, ratio }) => ({ label, value: Math.round(stats.revenue * ratio) }));
  return (
    <div className="gd-command-grid">
      <Panel title="Total Employees" className="gd-balance" action={<span className="gd-unit">LIVE</span>}>
        <div className="gd-balance-number">
          <Counter value={stats.revenue} format="compact" />
        </div>
        <div className="gd-balance-change">
          <span className="gd-delta">
            <ArrowUpRight aria-hidden="true" />
            {stats.revenueChange}
          </span>
          <span>vs last year</span>
        </div>
        <div className="gd-balance-actions">
          <button type="button" className="gd-primary" onClick={() => open("trends")}>
            View Trends <ArrowUpRight aria-hidden="true" />
          </button>
          <button type="button" className="gd-secondary" onClick={() => open("metrics")}>
            View Metrics <ArrowRight aria-hidden="true" />
          </button>
        </div>
        <div className="gd-streams" aria-label="Department Breakdown">
          {sources.map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </Panel>
      <div className="gd-summary">
        <Metric title="New Employees" icon={<Zap />} value={stats.orders} change="+2%" tone="teal" />
        <Metric title="Resigned Employees" icon={<Users />} value={stats.visitors} change="-4.8%" tone="coral" />
        <Metric title="Vacancies" icon={<ArrowUpRight />} value={stats.refunds} change="+1%" tone="teal" />
        <Metric title="Resolved BGVs" icon={<ListChecks />} value={114} detail="100% verified" />
      </div>
      <Panel
        title="Employees by Grade"
        subtitle="12-Month stacked volume and verification completions"
        className="gd-command-chart"
      >
        <StackChart
          items={automationActivity.map((item) => ({ label: item.label, lower: item.complete, upper: item.review }))}
          labels={["Verified", "In Progress"]}
          tones={["ink", "ochre"]}
          format={number.format}
          title="Employees volume by month"
        />
      </Panel>
      <div className="gd-command-side">
        <Panel title="Verification Target" className="gd-capacity">
          <div
            className="gd-capacity-track"
            role="meter"
            aria-label="Monthly capacity"
            aria-valuenow={488}
            aria-valuemin={0}
            aria-valuemax={556}
          >
            <span className="gd-fill" style={{ width: `${(488 / 556) * 100}%` }} />
          </div>
          <div className="gd-capacity-label">
            <span>
              <strong>488</strong> processed
            </span>
            <span>556 total candidates</span>
          </div>
        </Panel>
        <Panel title="Verifier Approvals" subtitle="Responses awaiting HR review" className="gd-approvals">
          <div className="gd-approval-content">
            <span className="gd-list-icon">
              <ShieldCheck aria-hidden="true" />
            </span>
            <div>
              <strong>Pending Submissions</strong>
              <small>Review employer responses</small>
            </div>
            <button
              type="button"
              className="gd-icon-button"
              aria-label="Open Operations Board"
              onClick={() => open("operations")}
            >
              <ArrowUpRight aria-hidden="true" />
            </button>
          </div>
        </Panel>
      </div>

      <Activity />
    </div>
  );
}

function AnalyticsMetrics({ period, trend }: { period: Period; trend?: boolean }) {
  const stats = analytics[period];
  return (
    <div className="gd-metric-grid">
      <Metric title="Total Candidates" icon={<CircleDollarSign />} value={stats.revenue} format="compact" change={stats.revenueChange} tone="teal" />
      {trend ? (
        <>
          <Metric title="Avg Turnaround (TAT)" icon={<Clock3 />} value={2.4} detail="days to response" />
          <Metric title="Confirmation Rate" icon={<Box />} value={96.2} format="percent" detail="positive remarks" />
          <Metric title="Pending Review" icon={<ListChecks />} value={stats.visitors} change="-4.8%" tone="coral" />
        </>
      ) : (
        <>
          <Metric title="New Requests" icon={<ShoppingBag />} value={stats.orders} change={stats.orderChange} />
          <Metric title="Pending Responses" icon={<Eye />} value={stats.visitors} change={stats.visitorChange} tone="coral" />
          <Metric title="Closed Successfully" icon={<ArrowUpRight />} value={stats.refunds} change={stats.refundChange} />
        </>
      )}
    </div>
  );
}

function AnalyticsView({
  period,
  type,
  download,
}: {
  period: Period;
  type: "trends" | "metrics";
  download: () => void;
}) {
  const stats = analytics[period];
  const trend = type === "trends";
  return (
    <div className="gd-analytics">
      <AnalyticsMetrics period={period} trend={trend} />
      <div className="gd-analytics-grid">
        <Panel
          title={trend ? "Verifications Trend (Sent vs Responded)" : "Employees by Project Category"}
          subtitle={trend ? "Compare outgoing requests vs employer responses" : "Volume comparison across Akma, Doto, HR Dev, Admin"}
          action={trend && <Legend entries={[{ label: "Verified", tone: "ochre" }, { label: "Pending", tone: "ink" }]} />}
        >
          {trend ? (
            <RevenueChart labels={stats.axis} revenue={stats.collected} costs={stats.costs} />
          ) : (
            <StackChart
              title="Project distributions"
              labels={["Beginning of Year", "End of Year"]}
              tones={["ink", "ochre"]}
              format={number.format}
              items={[
                { label: "Akma", lower: 275, upper: 320 },
                { label: "Doto", lower: 215, upper: 275 },
                { label: "HR Dev", lower: 135, upper: 175 },
                { label: "Admin", lower: 115, upper: 190 },
              ]}
            />
          )}
        </Panel>
        <Panel title="Employees by Grade" className="gd-device-panel">
          <DeviceChart mix={stats.devices} visitors={stats.revenue} />
        </Panel>
      </div>
      {trend ? (
        <Panel title="BGV Compliance Snapshot" className="gd-statement">
          <div className="gd-approval-content">
            <span className="gd-list-icon">
              <Clock3 aria-hidden="true" />
            </span>
            <div>
              <strong>Audit Trail & Verification Records</strong>
              <small>Export certified compliance CSV report</small>
            </div>
            <button
              type="button"
              className="gd-icon-button"
              aria-label="Download BGV report"
              onClick={download}
            >
              <Download aria-hidden="true" />
            </button>
          </div>
        </Panel>
      ) : (
        <Activity />
      )}
    </div>
  );
}

const statusStyle: Record<WorkStatus, { icon: ReactNode; tone: "teal" | "coral" | "ochre" | "ink" }> = {
  "Needs review": { icon: <ListChecks />, tone: "coral" },
  Scheduled: { icon: <Clock3 />, tone: "ochre" },
  Running: { icon: <Zap />, tone: "teal" },
  Exceptions: { icon: <TriangleAlert />, tone: "ink" },
};

function OperationsView({ work, inspect }: { work: WorkItem[]; inspect: (item: WorkItem) => void }) {
  const [filter, setFilter] = useState<WorkStatus | "All lanes">("All lanes");
  const review = work.filter((item) => item.status === "Needs review").length;
  const tools = new Set(work.map((item) => item.tool)).size;
  const lanes = filter === "All lanes" ? workStatuses : [filter];
  return (
    <div className="gd-analytics">
      <div className="gd-metric-grid">
        <Metric title="Total Candidates" icon={<CircleDollarSign />} value={556} format="compact" detail="under verification" tone="teal" />
        <Metric title="Active Workflows" icon={<Zap />} value={work.length} detail="in live progress" />
        <Metric title="Awaiting HR Review" icon={<ListChecks />} value={review} detail="pending employer review" />
        <Metric title="Verified Employers" icon={<ShieldCheck />} value={tools} detail="participating companies" />
      </div>
      <Panel
        title="BGV Operations Board"
        subtitle="Track request lifecycles: Drafts, Sent Requests, Opened, and Completed Verifications."
        className="gd-board"
        action={
          <label className="gd-filter">
            <Filter aria-hidden="true" />
            <select
              aria-label="Filter operations lanes"
              value={filter}
              onChange={(event) => setFilter(event.target.value as WorkStatus | "All lanes")}
            >
              {["All lanes", ...workStatuses].map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>
        }
      >
        <div className="gd-lanes" data-filtered={filter !== "All lanes"}>
          {lanes.map((lane) => {
            const items = work.filter((item) => item.status === lane);
            return (
              <section className="gd-lane" key={lane} aria-label={lane}>
                <header>
                  <i data-tone={statusStyle[lane].tone} aria-hidden="true">
                    {statusStyle[lane].icon}
                  </i>
                  <h3>{lane}</h3>
                  <span>{items.length}</span>
                </header>
                {items.map((item) => (
                  <button className="gd-work-item" type="button" onClick={() => inspect(item)} key={item.id}>
                    <span className="gd-work-titlerow">
                      <strong>{item.name}</strong>
                      <Ellipsis aria-hidden="true" />
                    </span>
                    <span className="gd-work-detail">{item.description}</span>
                    <span className="gd-work-meta">
                      <span>{item.tool}</span>
                      <span>{item.timestamp}</span>
                    </span>
                  </button>
                ))}
                {items.length === 0 && <p className="gd-empty">Queue clear.</p>}
              </section>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

function useNavigationReducedMotion(motion: boolean) {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    media.addEventListener("change", update);
    update();
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced || !motion;
}

gsap.registerPlugin(useGSAP);

const views = [
  { id: "command", label: "Executive Dashboard", short: "Dashboard", icon: LayoutDashboard, description: "Overview of candidate employment verifications and metrics.", prompt: "Show me verification summary." },
  { id: "trends", label: "Verification Trends", short: "Trends", icon: TrendingUp, description: "Analyze sent vs completed verification requests over time.", prompt: "How are verification TATs trending?" },
  { id: "metrics", label: "Analytics & Grades", short: "Metrics", icon: BarChart3, description: "Department, project category, and grade-level verifications.", prompt: "Show employees breakdown by projects." },
  { id: "operations", label: "BGV Operations Board", short: "Operations", icon: BriefcaseBusiness, description: "Track active candidate workflows, reminders, and employer forms.", prompt: "Which verification requests need review?" },
] as const;

const routeOrder: View[] = views.map((view) => view.id);

function routeFromHash(): View {
  if (typeof location === "undefined") return "command";
  const id = location.hash.slice(1);
  return routeOrder.find((view) => view === id) ?? "command";
}

function saveCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function Dock({
  active,
  side = false,
  select,
}: {
  active: View;
  side?: boolean;
  select: (view: View) => void;
}) {
  const nav = useRef<HTMLElement>(null);
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = nav.current;
    const indicator = marker.current;
    if (!container || !indicator) return;
    const adjust = () => {
      const current = container.querySelector<HTMLElement>('[aria-current="page"]');
      if (!current) return;
      indicator.style.width = `${current.offsetWidth}px`;
      indicator.style.height = `${current.offsetHeight}px`;
      indicator.style.transform = `translate(${current.offsetLeft}px, ${current.offsetTop}px)`;
      indicator.dataset.ready = "true";
    };
    const observer = new ResizeObserver(adjust);
    observer.observe(container);
    container.querySelectorAll("a").forEach((link) => observer.observe(link));
    adjust();
    return () => observer.disconnect();
  }, [active]);

  const onSelect = (event: MouseEvent<HTMLAnchorElement>, id: View) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    event.preventDefault();
    select(id);
  };

  return (
    <nav
      ref={nav}
      className={side ? "gd-dock gd-dock-side" : "gd-dock gd-dock-bottom"}
      aria-label={side ? "Workspace shortcuts" : "Workspace views"}
    >
      <span ref={marker} className="gd-dock-indicator" aria-hidden="true" />
      {views.map(({ id, label, short, icon: Icon }) => (
        <a
          href={`#${id}`}
          key={id}
          aria-label={label}
          aria-current={active === id ? "page" : undefined}
          onClick={(event) => onSelect(event, id)}
        >
          <Icon aria-hidden="true" />
          <span className="gd-dock-text" aria-hidden="true">
            {label}
          </span>
          <span className="gd-dock-short" aria-hidden="true">
            {short}
          </span>
          {side && (
            <span className="gd-dock-tip" aria-hidden="true">
              {label}
            </span>
          )}
        </a>
      ))}
    </nav>
  );
}

function Dialog({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const label = useId();
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    dialog?.querySelector("input")?.focus();
  }, []);
  return (
    <dialog
      className="gd-dialog"
      ref={ref}
      aria-labelledby={label}
      onClose={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <section className="gd-dialog-inner">
        <header>
          <h2 id={label}>{title}</h2>
          <button
            type="button"
            className="gd-icon-button"
            aria-label="Close dialog"
            onClick={() => ref.current?.close()}
          >
            <X aria-hidden="true" />
          </button>
        </header>
        {children}
      </section>
    </dialog>
  );
}

function QuickActions({
  workspaceName,
  select,
  close,
}: {
  workspaceName: string;
  select: (view: View) => void;
  close: () => void;
}) {
  const [query, setQuery] = useState("");
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const results = views.filter((view) =>
    terms.every((term) => `${view.label} ${view.description} ${view.prompt}`.toLowerCase().includes(term))
  );
  return (
    <Dialog title={"Search " + workspaceName} close={close}>
      <label className="gd-search gd-command-input">
        <Search aria-hidden="true" />
        <input
          type="search"
          aria-label="Find a dashboard view"
          placeholder="Search views, candidates, or reports"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <div className="gd-quick-list">
        {results.map(({ label, id, description, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              close();
              select(id);
            }}
          >
            <Icon aria-hidden="true" />
            <div>
              <strong>{label}</strong>
              <small>{description}</small>
            </div>
            <ChevronRight aria-hidden="true" />
          </button>
        ))}
        {results.length === 0 && (
          <p className="gd-empty" role="status">
            No matching views found.
          </p>
        )}
      </div>
    </Dialog>
  );
}

type Modal = "search" | "notifications" | { itemId: string } | null;

export function GlassyDashboard({
  backgroundImage = studioPhoto,
  backgroundCredit: _backgroundCredit,
  workspaceName = "axis",
  panelFrost = 16,
  initialTheme = "light",
  onOpenAddModal,
  onOpenEmployerForm,
  onDownloadReportPDF,
}: GlassyDashboardProps = {}) {
  const [view, setView] = useState<View>(routeFromHash);
  const [active, setActive] = useState(view);
  const [period, setPeriod] = useState<Period>("30 days");
  const [theme, setTheme] = useState(initialTheme);
  useEffect(() => setTheme(initialTheme), [initialTheme]);
  const [modal, setModal] = useState<Modal>(null);
  const [work, setWork] = useState(initialWork);
  const [readNotices, setReadNotices] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const scrollArea = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const pending = useRef<View>(view);
  const exit = useRef<gsap.core.Tween | null>(null);
  const reduced = useNavigationReducedMotion(true);
  const { contextSafe } = useGSAP({ scope: root });

  const changeView = contextSafe((next: View) => {
    if (pending.current === next) return;
    pending.current = next;
    setActive(next);
    exit.current?.kill();
    if (reduced || !content.current) {
      setView(next);
      return;
    }
    if (next === view) {
      exit.current = gsap.to(content.current, { opacity: 1, filter: "blur(0px)", duration: 0.18, clearProps: "opacity,filter" });
      return;
    }
    exit.current = gsap.to(content.current, {
      opacity: 0,
      filter: "blur(8px)",
      duration: 0.14,
      ease: "power1.in",
      onComplete: () => setView(next),
    });
  });

  function selectView(next: View) {
    if (location.hash !== `#${next}`) history.pushState(null, "", `#${next}`);
    changeView(next);
  }

  useEffect(() => {
    const restore = () => changeView(routeFromHash());
    addEventListener("popstate", restore);
    addEventListener("hashchange", restore);
    return () => {
      removeEventListener("popstate", restore);
      removeEventListener("hashchange", restore);
    };
  }, [changeView]);

  useEffect(() => {
    scrollArea.current?.scrollTo({ top: 0 });
    if (root.current && root.current.getBoundingClientRect().top < -20) root.current.scrollIntoView({ block: "start" });
  }, [view]);

  useGSAP(
    () => {
      const layer = content.current;
      if (!layer) return;
      const counts = layer.querySelectorAll<HTMLElement>("[data-gd-count]");
      gsap.set(layer, { clearProps: "opacity,filter" });
      if (reduced) {
        counts.forEach((el) => {
          el.textContent = formatCount[el.dataset.format as CountFormat](Number(el.dataset.gdCount));
        });
        return;
      }
      const animate = gsap.timeline({ defaults: { ease: "power3.out" } });
      animate.fromTo(layer, { opacity: 0.55, filter: "blur(5px)" }, { opacity: 1, filter: "blur(0px)", clearProps: "opacity,filter", duration: 0.32 }, 0);
      animate.from("[data-gd-enter]", { y: 18, opacity: 0, stagger: 0.045, duration: 0.5, clearProps: "transform,opacity" }, 0.035);
      const bars = layer.querySelectorAll(".gd-stack-bar");
      const line = layer.querySelector(".gd-line-reveal");
      const ring = layer.querySelector(".gd-donut-draw");
      const meters = layer.querySelectorAll(".gd-fill");
      if (bars.length) animate.from(bars, { scaleY: 0, stagger: 0.034, duration: 0.46, clearProps: "transform" }, 0.17);
      if (line) animate.fromTo(line, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.74, clearProps: "clipPath" }, 0.14);
      if (ring) animate.fromTo(ring, { attr: { "stroke-dasharray": "0 100" } }, { attr: { "stroke-dasharray": "100 0" }, duration: 0.76 }, 0.16);
      if (meters.length) animate.from(meters, { scaleX: 0, duration: 0.58, stagger: 0.045, clearProps: "transform" }, 0.18);
      counts.forEach((el, index) => {
        const value = Number(el.dataset.gdCount);
        const format = formatCount[el.dataset.format as CountFormat];
        const counter = { value: 0 };
        animate.to(counter, { value, duration: 0.75, onUpdate: () => { el.textContent = format(counter.value); } }, 0.09 + index * 0.02);
      });
    },
    { scope: content, dependencies: [view, period, reduced], revertOnUpdate: true }
  );

  const current = views.find((item) => item.id === view)!;
  const workItem = typeof modal === "object" && modal ? work.find((item) => item.id === modal.itemId) : undefined;
  const reviewCount = work.filter((item) => item.status === "Needs review").length;
  const close = () => setModal(null);
  const inspect = (item: WorkItem) => setModal({ itemId: item.id });
  const downloadReport = () => {
    if (onDownloadReportPDF) {
      onDownloadReportPDF();
      return;
    }
    const stats = analytics[period];
    saveCsv(`netbounce-bgv-report-${period.replace(" ", "-")}.csv`, [
      ["Period Month", "Verified", "Pending"],
      ...stats.axis.map((label, index) => [label, stats.collected[index], stats.costs[index]]),
    ]);
  };
  const downloadWork = () =>
    saveCsv("netbounce-bgv-operations.csv", [
      ["Candidate ID", "Candidate Name", "Previous Employer", "Verifier", "Status", "Time"],
      ...work.map((item) => [item.id, item.name, item.tool, item.owner, item.status, item.timestamp]),
    ]);

  return (
    <div
      className="gd-app"
      data-theme={theme}
      ref={root}
      style={{ "--gd-panel-frost": Math.max(0, Math.min(36, panelFrost)) + "px" } as CSSProperties}
    >
      <style>{dashboardStyles}</style>
      <img className="gd-background" src={backgroundImage} alt="" aria-hidden="true" fetchPriority="high" />
      <div className="gd-surround">
        <header className="gd-top">
          <div className="gd-brand">
            <span className="gd-logo" aria-hidden="true">
              <svg viewBox="0 0 28 28" fill="none">
                <path d="m5 22 7.4-16h3.2L23 22h-4l-5-11.4L9 22H5Z" fill="currentColor" />
                <path d="M10 18h8l1.4 3h-10.8l1.4-3Z" fill="currentColor" />
              </svg>
            </span>
            <div>
              <strong>{workspaceName}</strong>
              <small>NETBOUNCE BGV</small>
            </div>
          </div>
          <button
            type="button"
            className="gd-ask"
            aria-label={"Search " + workspaceName + " views"}
            onClick={() => setModal("search")}
          >
            <span className="gd-orb" aria-hidden="true" />
            <span className="gd-prompt" key={view}>
              {current.prompt}
            </span>
            <Search aria-hidden="true" className="gd-ask-search" />
          </button>
          <div className="gd-top-actions">
            {onOpenAddModal && (
              <button
                type="button"
                className="gd-icon-button"
                title="Add New BGV Request"
                aria-label="Add New BGV Request"
                onClick={onOpenAddModal}
                style={{ background: "var(--gd-primary)", color: "white" }}
              >
                <Plus aria-hidden="true" />
              </button>
            )}
            <button
              title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
              type="button"
              className="gd-icon-button"
              aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
            </button>
            <button
              type="button"
              className="gd-icon-button gd-notices"
              aria-label="Notifications"
              onClick={() => {
                setReadNotices(true);
                setModal("notifications");
              }}
            >
              <Bell aria-hidden="true" />
              {!readNotices && reviewCount > 0 && <i aria-hidden="true" />}
            </button>
          </div>
        </header>

        <div className="gd-stage-wrap">
          <Dock active={active} side select={selectView} />
          <main className="gd-stage">
            <div className="gd-stage-scroll" ref={scrollArea}>
              <header className="gd-view-head">
                <div>
                  <h1>{current.label}</h1>
                  <p>{current.description}</p>
                </div>
                <div className="gd-view-actions">
                  {view !== "operations" && (
                    <div className="gd-period" role="group" aria-label="Reporting period">
                      {periods.map((item) => (
                        <button
                          type="button"
                          key={item}
                          aria-pressed={item === period}
                          onClick={() => setPeriod(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                  {(view === "operations" || view === "trends") && (
                    <button
                      type="button"
                      className="gd-primary gd-export"
                      onClick={view === "operations" ? downloadWork : downloadReport}
                    >
                      <ArrowDownToLine aria-hidden="true" />
                      Export CSV
                    </button>
                  )}
                  {view === "command" && onDownloadReportPDF && (
                    <button type="button" className="gd-primary gd-export" onClick={onDownloadReportPDF}>
                      <Download aria-hidden="true" />
                      Export PDF
                    </button>
                  )}
                </div>
              </header>
              <div className="gd-content" ref={content} key={view} data-view={view}>
                {view === "command" && <CommandView period={period} open={selectView} />}
                {(view === "trends" || view === "metrics") && (
                  <AnalyticsView period={period} type={view} download={downloadReport} />
                )}
                {view === "operations" && <OperationsView work={work} inspect={inspect} />}
              </div>
            </div>
          </main>
        </div>
        <div className="gd-bottom-dock-container">
          <Dock active={active} select={selectView} />
        </div>
      </div>

      {modal === "search" && <QuickActions workspaceName={workspaceName} select={selectView} close={close} />}
      {modal === "notifications" && (
        <Dialog title="BGV Action Items" close={close}>
          <div className="gd-quick-list">
            {work
              .filter((item) => item.status === "Needs review")
              .map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    selectView("operations");
                    inspect(item);
                  }}
                >
                  <Bell aria-hidden="true" />
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.description}</small>
                  </div>
                  <ArrowRight aria-hidden="true" />
                </button>
              ))}
            {reviewCount === 0 && <p className="gd-empty">You’re all caught up. No pending reviews.</p>}
          </div>
        </Dialog>
      )}
      {workItem && (
        <Dialog key={workItem.id} title={workItem.name} close={close}>
          <Badge status={workItem.status} />
          <p className="gd-work-dialog-description">{workItem.description}</p>
          <dl className="gd-work-facts">
            <div>
              <dt>Previous Employer</dt>
              <dd>{workItem.tool}</dd>
            </div>
            <div>
              <dt>Verifier Contact</dt>
              <dd>{workItem.owner}</dd>
            </div>
            <div>
              <dt>Reference ID</dt>
              <dd>{workItem.id}</dd>
            </div>
          </dl>
          <div style={{ display: "flex", gap: "8px" }}>
            {onOpenEmployerForm && (
              <button
                type="button"
                className="gd-secondary"
                onClick={() => {
                  close();
                  onOpenEmployerForm(workItem);
                }}
              >
                Open Employer Form
              </button>
            )}
            {workItem.status === "Needs review" && (
              <button
                type="button"
                className="gd-primary"
                onClick={() => {
                  setWork((items) =>
                    items.map((item) => (item.id === workItem.id ? { ...item, status: "Scheduled" } : item))
                  );
                  close();
                }}
              >
                Mark Verified & Approved <Command aria-hidden="true" />
              </button>
            )}
          </div>
        </Dialog>
      )}
    </div>
  );
}

export default GlassyDashboard;
