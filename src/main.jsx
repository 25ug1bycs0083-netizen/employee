import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight, Bell, CalendarDays, Check, ChevronDown, ChevronLeft,
  ChevronRight, CircleHelp, Clock3, Download, FileText, Filter, LayoutDashboard,
  Menu, MoreHorizontal, Plus, Search, Settings, SlidersHorizontal, UserRound,
  Users, X, XCircle
} from "lucide-react";
import "./styles.css";

const initialRequests = [
  { id: 1, employee: "Maya Johnson", initials: "MJ", type: "Annual leave", dates: "Jun 24 – Jun 28, 2024", days: 5, submitted: "Jun 10, 2024", status: "Pending", color: "lavender" },
  { id: 2, employee: "Ethan Williams", initials: "EW", type: "Sick leave", dates: "Jun 18 – Jun 19, 2024", days: 2, submitted: "Jun 17, 2024", status: "Approved", color: "peach" },
  { id: 3, employee: "Olivia Smith", initials: "OS", type: "Annual leave", dates: "Jun 20 – Jun 21, 2024", days: 2, submitted: "Jun 06, 2024", status: "Approved", color: "mint" },
  { id: 4, employee: "Noah Brown", initials: "NB", type: "Personal leave", dates: "Jun 14, 2024", days: 1, submitted: "Jun 12, 2024", status: "Rejected", color: "sky" },
  { id: 5, employee: "Ava Davis", initials: "AD", type: "Annual leave", dates: "Jul 01 – Jul 05, 2024", days: 5, submitted: "Jun 13, 2024", status: "Pending", color: "rose" }
];

const employees = [
  { name: "Maya Johnson", role: "Product Designer", department: "Design", email: "maya.johnson@acme.io", joined: "Jan 12, 2022", initials: "MJ", color: "lavender" },
  { name: "Ethan Williams", role: "Frontend Engineer", department: "Engineering", email: "ethan.williams@acme.io", joined: "Mar 03, 2021", initials: "EW", color: "peach" },
  { name: "Olivia Smith", role: "Marketing Manager", department: "Marketing", email: "olivia.smith@acme.io", joined: "Aug 22, 2022", initials: "OS", color: "mint" },
  { name: "Noah Brown", role: "Backend Engineer", department: "Engineering", email: "noah.brown@acme.io", joined: "Nov 17, 2023", initials: "NB", color: "sky" },
  { name: "Ava Davis", role: "Content Strategist", department: "Marketing", email: "ava.davis@acme.io", joined: "Feb 09, 2024", initials: "AD", color: "rose" }
];

const balances = [
  { label: "Annual leave", used: 8, total: 20, color: "purple" },
  { label: "Sick leave", used: 3, total: 10, color: "orange" },
  { label: "Personal leave", used: 1, total: 5, color: "blue" }
];

function Avatar({ initials, color = "lavender", large = false }) {
  return <span className={`avatar ${color} ${large ? "large" : ""}`}>{initials}</span>;
}

function Status({ children }) {
  return <span className={`status ${children.toLowerCase()}`}><i />{children}</span>;
}

function App() {
  const [active, setActive] = useState("Overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [requests, setRequests] = useState(() => {
    try { return JSON.parse(localStorage.getItem("leaveflow-requests")) || initialRequests; } catch { return initialRequests; }
  });
  const [showLeave, setShowLeave] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => localStorage.setItem("leaveflow-requests", JSON.stringify(requests)), [requests]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(""), 3000); return () => clearTimeout(timer); }, [toast]);

  const pending = requests.filter(r => r.status === "Pending").length;
  const approve = id => { setRequests(rs => rs.map(r => r.id === id ? { ...r, status: "Approved" } : r)); setToast("Leave request approved"); };
  const reject = id => { setRequests(rs => rs.map(r => r.id === id ? { ...r, status: "Rejected" } : r)); setToast("Leave request rejected"); };
  const submitLeave = event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const start = form.get("start");
    const end = form.get("end") || start;
    const days = Math.max(1, Math.round((new Date(end) - new Date(start)) / 86400000) + 1);
    setRequests(rs => [{ id: Date.now(), employee: "You", initials: "YO", type: form.get("type"), dates: `${start} – ${end}`, days, submitted: "Today", status: "Pending", color: "lavender" }, ...rs]);
    setShowLeave(false); setToast("Leave request submitted for approval");
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
        <div className="brand"><div className="brand-mark">L</div><span>leaveflow</span></div>
        <div className="workspace-switch"><span className="workspace-dot" /> Acme Inc. <ChevronDown size={15} /></div>
        <nav>
          <p className="nav-label">Workspace</p>
          {[
            ["Overview", LayoutDashboard], ["Leave requests", CalendarDays], ["Employees", Users], ["Reports", FileText]
          ].map(([label, Icon]) => <button key={label} className={active === label ? "active" : ""} onClick={() => { setActive(label); setMobileNav(false); }}><Icon size={18} /><span>{label}</span>{label === "Leave requests" && pending > 0 && <b>{pending}</b>}</button>)}
          <p className="nav-label management">Management</p>
          {[["Leave policy", SlidersHorizontal], ["Settings", Settings]].map(([label, Icon]) => <button key={label} className={active === label ? "active" : ""} onClick={() => setActive(label)}><Icon size={18} /><span>{label}</span></button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><CircleHelp size={18} /><div><strong>Need help?</strong><small>Check our help center</small></div><ArrowUpRight size={16} /></div>
          <div className="profile"><Avatar initials="AR" color="mint" /><div><strong>Alex Rivera</strong><small>Administrator</small></div><MoreHorizontal size={18} /></div>
        </div>
      </aside>
      <main className="main">
        <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)}><Menu /></button><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{active}</strong></div><div className="top-actions"><button className="icon-btn"><Search size={19} /></button><button className="icon-btn notice"><Bell size={19} /><i /></button><div className="top-profile"><Avatar initials="AR" color="mint" /><ChevronDown size={15} /></div></div></header>
        {active === "Overview" && <Dashboard requests={requests} pending={pending} approve={approve} reject={reject} onApply={() => setShowLeave(true)} />}
        {active === "Leave requests" && <RequestsPage requests={requests} approve={approve} reject={reject} onApply={() => setShowLeave(true)} />}
        {active === "Employees" && <EmployeesPage onAdd={() => setToast("Employee creation is ready to connect")} />}
        {active === "Reports" && <ReportsPage requests={requests} onExport={() => setToast("Report exported successfully")} />}
        {["Leave policy", "Settings"].includes(active) && <Placeholder title={active} />}
      </main>
      {showLeave && <LeaveModal onClose={() => setShowLeave(false)} onSubmit={submitLeave} />}
      {toast && <div className="toast"><Check size={16} />{toast}</div>}
    </div>
  );
}

function Dashboard({ requests, pending, approve, reject, onApply }) {
  const approved = requests.filter(r => r.status === "Approved").length;
  return <div className="content"><div className="page-heading"><div><p className="eyebrow">Monday, June 17, 2024</p><h1>Good morning, Alex <span>✦</span></h1><p className="muted">Here’s what’s happening with your team today.</p></div><button className="primary" onClick={onApply}><Plus size={18} /> Apply for leave</button></div>
    <div className="stats-grid"><Stat title="Total employees" value="48" trend="+12%" note="from last month" icon={<Users />} iconClass="purple" /><Stat title="Pending requests" value={pending} trend="+3" note="since last week" icon={<Clock3 />} iconClass="orange" /><Stat title="On leave today" value="6" trend="-2" note="from yesterday" icon={<CalendarDays />} iconClass="blue" /><Stat title="Approved this month" value={approved + 18} trend="+8%" note="from last month" icon={<Check />} iconClass="green" /></div>
    <div className="dashboard-grid"><section className="panel balance-panel"><div className="panel-heading"><div><h2>My leave balance</h2><p className="muted">Your available days for 2024</p></div><button className="text-button">View details <ArrowUpRight size={15} /></button></div><div className="balance-content"><div className="donut"><div><strong>17</strong><span>days left</span></div></div><div className="balance-list">{balances.map(b => <div className="balance-row" key={b.label}><span className={`legend ${b.color}`} /> <span>{b.label}</span><strong>{b.total - b.used} <small>/ {b.total}</small></strong></div>)}</div></div><div className="balance-bars">{balances.map(b => <div key={b.label}><div className="bar-label"><span>{b.label}</span><span>{b.used}/{b.total} used</span></div><div className="bar"><i className={b.color} style={{ width: `${(b.used / b.total) * 100}%` }} /></div></div>)}</div></section>
      <section className="panel chart-panel"><div className="panel-heading"><div><h2>Leave overview</h2><p className="muted">Requests across your organization</p></div><button className="select-button">Last 6 months <ChevronDown size={14} /></button></div><div className="chart-legend"><span><i className="dot purple" />Approved</span><span><i className="dot orange" />Pending</span><span><i className="dot gray" />Rejected</span></div><MiniChart /></section></div>
    <section className="panel requests-panel"><div className="panel-heading"><div><h2>Recent leave requests</h2><p className="muted">Review and manage your team’s requests</p></div><button className="text-button" onClick={() => document.querySelector(".sidebar button:nth-child(3)")?.click()}>View all <ArrowUpRight size={15} /></button></div><RequestTable requests={requests.slice(0, 4)} approve={approve} reject={reject} /></section>
    <div className="bottom-grid"><section className="panel"><div className="panel-heading"><div><h2>Upcoming holidays</h2><p className="muted">Plan ahead for company holidays</p></div><button className="more"><MoreHorizontal size={18} /></button></div><Holiday month="JUN" day="19" title="Juneteenth" /><Holiday month="JUL" day="04" title="Independence Day" /><Holiday month="SEP" day="02" title="Labor Day" /></section><section className="panel"><div className="panel-heading"><div><h2>Who's away</h2><p className="muted">Team members currently on leave</p></div><button className="text-button">View calendar <ArrowUpRight size={15} /></button></div><div className="away-list"><div><Avatar initials="OS" color="mint" /><span><strong>Olivia Smith</strong><small>Annual leave · returns Jun 21</small></span></div><div><Avatar initials="EW" color="peach" /><span><strong>Ethan Williams</strong><small>Sick leave · returns Jun 20</small></span></div></div></section></div>
  </div>;
}

function Stat({ title, value, trend, note, icon, iconClass }) { return <div className="stat-card"><div className={`stat-icon ${iconClass}`}>{icon}</div><div className="stat-title">{title}</div><strong className="stat-value">{value}</strong><div className="stat-foot"><span className={trend.startsWith("-") ? "negative" : ""}>{trend}</span> {note}</div></div>; }
function MiniChart() { return <div className="chart"><div className="y-axis"><span>20</span><span>15</span><span>10</span><span>5</span><span>0</span></div><div className="chart-area"><div className="grid-lines"><i /><i /><i /><i /><i /></div><svg viewBox="0 0 600 180" preserveAspectRatio="none"><path className="line rejected" d="M0 130 C50 125 70 145 120 135 S180 110 230 130 S290 128 340 142 S400 120 450 130 S500 122 600 132" /><path className="line pending" d="M0 145 C50 145 70 130 120 140 S180 120 230 112 S290 120 340 105 S400 120 450 100 S520 112 600 90" /><path className="line approved" d="M0 135 C50 115 70 125 120 100 S180 115 230 80 S290 90 340 62 S400 80 450 54 S520 60 600 25" /></svg><div className="x-axis"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div></div></div>; }
function Holiday({ month, day, title }) { return <div className="holiday"><div><strong>{month}</strong><b>{day}</b></div><span><strong>{title}</strong><small>Company holiday</small></span><MoreHorizontal size={17} /></div>; }
function RequestTable({ requests, approve, reject, compact = false }) { return <div className="table-wrap"><table><thead><tr><th>EMPLOYEE</th><th>LEAVE TYPE</th><th>DATES</th><th>DAYS</th><th>STATUS</th><th /></tr></thead><tbody>{requests.map(r => <tr key={r.id}><td><div className="person"><Avatar initials={r.initials} color={r.color} /><strong>{r.employee}</strong></div></td><td>{r.type}</td><td>{r.dates}</td><td>{r.days} {r.days === 1 ? "day" : "days"}</td><td><Status>{r.status}</Status></td><td><div className="row-actions">{r.status === "Pending" && <><button className="approve" onClick={() => approve(r.id)} title="Approve"><Check size={15} /></button><button className="deny" onClick={() => reject(r.id)} title="Reject"><X size={15} /></button></>}<button className="more"><MoreHorizontal size={17} /></button></div></td></tr>)}</tbody></table></div>; }
function RequestsPage({ requests, approve, reject, onApply }) { const [query, setQuery] = useState(""); const filtered = requests.filter(r => r.employee.toLowerCase().includes(query.toLowerCase()) || r.type.toLowerCase().includes(query.toLowerCase())); return <div className="content"><div className="page-heading"><div><p className="eyebrow">Workspace / Requests</p><h1>Leave requests</h1><p className="muted">Review, approve, and track all leave requests.</p></div><button className="primary" onClick={onApply}><Plus size={18} /> Apply for leave</button></div><section className="panel requests-panel full"><div className="toolbar"><div className="search"><Search size={17} /><input placeholder="Search requests..." value={query} onChange={e => setQuery(e.target.value)} /></div><button className="filter"><Filter size={16} /> Filter <ChevronDown size={14} /></button><button className="filter"><Download size={16} /> Export</button></div><RequestTable requests={filtered} approve={approve} reject={reject} /></section></div>; }
function EmployeesPage({ onAdd }) { return <div className="content"><div className="page-heading"><div><p className="eyebrow">Workspace / Directory</p><h1>Employees</h1><p className="muted">Manage your people and their leave details.</p></div><button className="primary" onClick={onAdd}><Plus size={18} /> Add employee</button></div><section className="panel requests-panel full"><div className="toolbar"><div className="search"><Search size={17} /><input placeholder="Search employees..." /></div><button className="filter"><Filter size={16} /> Department <ChevronDown size={14} /></button></div><div className="employee-grid">{employees.map(e => <div className="employee-card" key={e.email}><div className="employee-top"><Avatar initials={e.initials} color={e.color} large /><button className="more"><MoreHorizontal size={18} /></button></div><h3>{e.name}</h3><p>{e.role}</p><div className="employee-meta"><span>{e.department}</span><span>{e.email}</span></div><div className="employee-footer">Joined {e.joined}<ArrowUpRight size={15} /></div></div>)}</div></section></div>; }
function ReportsPage({ requests, onExport }) { const approved = requests.filter(r => r.status === "Approved").reduce((n, r) => n + r.days, 0); return <div className="content"><div className="page-heading"><div><p className="eyebrow">Workspace / Analytics</p><h1>Reports</h1><p className="muted">Understand leave patterns across your organization.</p></div><button className="secondary" onClick={onExport}><Download size={17} /> Export report</button></div><div className="report-cards"><Stat title="Leave days taken" value={approved + 42} trend="+14%" note="vs last year" icon={<CalendarDays />} iconClass="purple" /><Stat title="Average per employee" value="3.8" trend="+0.4" note="days this year" icon={<Users />} iconClass="blue" /><Stat title="Approval rate" value="92%" trend="+6%" note="vs last month" icon={<Check />} iconClass="green" /></div><section className="panel report-panel"><div className="panel-heading"><div><h2>Leave report · 2024</h2><p className="muted">Monthly summary of approved leave days</p></div><button className="select-button">All departments <ChevronDown size={14} /></button></div><div className="report-bars">{["Jan","Feb","Mar","Apr","May","Jun"].map((m, i) => <div key={m}><div className="report-bar"><i style={{ height: `${35 + i * 9}%` }} /></div><span>{m}</span></div>)}</div></section></div>; }
function Placeholder({ title }) { return <div className="content"><div className="page-heading"><div><p className="eyebrow">Management</p><h1>{title}</h1><p className="muted">This section is ready for your organization’s policy configuration.</p></div></div><div className="empty-state panel"><Settings size={28} /><h2>{title} controls</h2><p>Configure this area to fit your team’s workflow.</p></div></div>; }
function LeaveModal({ onClose, onSubmit }) { return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><form className="modal" onSubmit={onSubmit}><div className="modal-heading"><div><p className="eyebrow">New request</p><h2>Apply for leave</h2></div><button type="button" className="close" onClick={onClose}><X size={19} /></button></div><label>Leave type<select name="type" required><option>Annual leave</option><option>Sick leave</option><option>Personal leave</option><option>Unpaid leave</option></select></label><div className="date-grid"><label>Start date<input name="start" type="date" defaultValue="2024-06-24" required /></label><label>End date<input name="end" type="date" defaultValue="2024-06-28" required /></label></div><label>Reason<textarea name="reason" placeholder="Tell your manager why you need leave..." required /></label><div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button className="primary">Submit request</button></div></form></div>; }

createRoot(document.getElementById("root")).render(<App />);
