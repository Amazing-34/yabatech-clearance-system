import React, { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight, BadgeCheck, BookOpen, Check, ChevronRight, ClipboardCheck,
  Clock3, FileCheck2, FileText, GraduationCap, LayoutDashboard, LogOut,
  Menu, ShieldCheck, UploadCloud, UserRound, Users, X
} from "lucide-react";
import { DEMO_ADMIN, DEMO_STUDENT, REQUIRED_DOCUMENTS } from "./data";
import { clearSession, readSession, readStudents, writeSession, writeStudents } from "./storage";

function Brand({ inverse = false }) {
  return <Link className={`brand ${inverse ? "brand-inverse" : ""}`} to="/">
    <span className="brand-mark">Y</span>
    <span><strong>YABATECH</strong><small>STUDENT CLEARANCE SYSTEM</small></span>
  </Link>;
}

function StatusBadge({ status }) {
  const cls = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status-badge status-${cls}`}>{status}</span>;
}

function App() {
  const [session, setSession] = useState(readSession);
  const [students, setStudents] = useState(readStudents);
  const location = useLocation();

  useEffect(() => { writeStudents(students); }, [students]);
  useEffect(() => {
    const next = readSession();
    setSession(next);
  }, [location.pathname]);

  function login(nextSession) {
    writeSession(nextSession);
    setSession(nextSession);
  }
  function logout() {
    clearSession();
    setSession(null);
  }
  function updateStudent(matricNumber, updater) {
    setStudents((old) => old.map((student) =>
      student.matricNumber === matricNumber ? updater(student) : student
    ));
  }

  return <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/student-login" element={<Login role="student" onLogin={login} />} />
    <Route path="/admin-login" element={<Login role="admin" onLogin={login} />} />
    <Route path="/student" element={session?.role === "student"
      ? <StudentPortal session={session} students={students} updateStudent={updateStudent} logout={logout} />
      : <Navigate to="/student-login" replace />} />
    <Route path="/admin" element={session?.role === "admin"
      ? <AdminPortal students={students} setStudents={setStudents} logout={logout} />
      : <Navigate to="/admin-login" replace />} />
    <Route path="/clearance-slip" element={session?.role === "student"
      ? <ClearanceSlip session={session} students={students} />
      : <Navigate to="/student-login" replace />} />
    <Route path="*" element={<NotFound />} />
  </Routes>;
}

function Home() {
  return <div className="home-page">
    <header className="topbar"><Brand />
      <nav><a href="#process">How it works</a><a href="#features">Features</a><Link className="nav-login" to="/student-login">Student sign in <ArrowRight size={15} /></Link></nav>
    </header>
    <main>
      <section className="hero wrap">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> YABA COLLEGE OF TECHNOLOGY</span>
          <h1>Clearance, made <span>simpler.</span></h1>
          <p className="hero-description">A single place to organise your screening documents, follow your clearance progress, and access your clearance slip.</p>
          <div className="hero-actions"><Link className="button button-primary" to="/student-login">Enter student portal <ArrowRight size={17} /></Link><a className="button button-outline" href="#process">Explore the process</a></div>
          <div className="hero-trust"><ShieldCheck size={17} /><span>A guided demonstration of the student screening process</span></div>
        </div>
        <div className="hero-art" aria-label="Illustration of a clearance status card">
          <div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div>
          <div className="preview-card">
            <div className="preview-head"><span className="preview-icon"><ClipboardCheck size={20} /></span><span><b>Clearance overview</b><small>STUDENT PORTAL</small></span><span className="preview-menu">•••</span></div>
            <div className="preview-check"><Check size={27} /></div>
            <h3>Your next step starts here.</h3><p>Keep your screening journey clear and organised.</p>
            <div className="preview-progress"><span></span></div><div className="preview-foot"><span>Screening checklist</span><b>Ready to begin</b></div>
          </div>
          <div className="floating-note"><span className="note-check"><Check size={14} /></span><span><b>Digital checklist</b><small>Documents in one place</small></span></div>
          <span className="art-spark spark-a">✳</span><span className="art-spark spark-b">✦</span>
        </div>
      </section>
      <section className="feature-strip wrap" id="features">
        <div><span className="feature-icon"><FileText /></span><span><b>Document checklist</b><small>Track required documents</small></span></div>
        <div><span className="feature-icon"><Clock3 /></span><span><b>Status tracking</b><small>Follow your screening progress</small></span></div>
        <div><span className="feature-icon"><BadgeCheck /></span><span><b>Clearance slip</b><small>Print after approval</small></span></div>
      </section>
      <section className="process-section wrap" id="process">
        <div className="section-intro"><span className="eyebrow">A CLEARER PROCESS</span><h2>Four steps. One organised journey.</h2><p>Follow the stages of the screening and clearance process.</p></div>
        <div className="steps-grid">
          {[
            ["01", "Sign in", "Access the student portal with your demo account."],
            ["02", "Complete your details", "Provide bio-data and prepare the required documents."],
            ["03", "Submit for screening", "Review your checklist and follow the review status."],
            ["04", "Access clearance", "View and print the slip when the demo record is approved."],
          ].map(([n, title, desc]) => <article className="step-card" key={n}><span className="step-number">{n}</span><h3>{title}</h3><p>{desc}</p><ChevronRight className="step-arrow" size={18} /></article>)}
        </div>
      </section>
      <section className="cta-band wrap"><div><span className="eyebrow">GET STARTED</span><h2>Choose your portal</h2><p>This prototype has separate demonstration access for students and screening administrators.</p></div><div className="cta-actions"><Link className="button button-primary" to="/student-login"><UserRound size={17} /> Student portal</Link><Link className="button button-light" to="/admin-login"><ShieldCheck size={17} /> Admin portal</Link></div></section>
    </main>
    <Footer />
  </div>;
}

function Login({ role, onLogin }) {
  const isAdmin = role === "admin";
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function submit(event) {
    event.preventDefault();
    setError("");
    const valid = isAdmin
      ? identifier.trim().toLowerCase() === DEMO_ADMIN.username && password === DEMO_ADMIN.password
      : identifier.trim().toUpperCase() === DEMO_STUDENT.matricNumber && password === DEMO_STUDENT.password;
    if (!valid) {
      setError("Those demo credentials don't match. Check the sample account below and try again.");
      return;
    }
    setBusy(true);
    const nextSession = isAdmin
      ? { role: "admin", username: DEMO_ADMIN.username }
      : { role: "student", matricNumber: DEMO_STUDENT.matricNumber };
    onLogin(nextSession);
    navigate(isAdmin ? "/admin" : "/student", { replace: true });
  }

  return <div className="login-layout">
    <aside className="login-aside"><Brand inverse /><div className="login-aside-copy"><span className="eyebrow eyebrow-light">STUDENT SERVICES</span><h1>{isAdmin ? "Review. Verify. Clear." : "Your academic journey, organised."}</h1><p>{isAdmin ? "Review demonstration student records, inspect submitted document names, and record screening decisions." : "Manage your screening checklist, monitor your clearance status, and keep your required documents organised."}</p><div className="aside-points"><span><Check size={15} /> Guided screening checklist</span><span><Check size={15} /> Clear status updates</span><span><Check size={15} /> Print-ready clearance slip</span></div></div><div className="aside-footer">Yaba College of Technology · Academic screening prototype</div></aside>
    <main className="login-main"><Link to="/" className="back-link">← Back to home</Link><div className="login-box"><span className="login-symbol">{isAdmin ? <ShieldCheck /> : <GraduationCap />}</span><span className="eyebrow">{isAdmin ? "ADMINISTRATOR ACCESS" : "STUDENT ACCESS"}</span><h2>{isAdmin ? "Admin sign in" : "Student sign in"}</h2><p className="login-subtitle">Enter your demo credentials to continue.</p>
      <form onSubmit={submit}>
        <label htmlFor="identifier">{isAdmin ? "Username" : "Matriculation number"}</label>
        <input id="identifier" value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder={isAdmin ? "Enter admin username" : "e.g. YCT/23/1234"} autoComplete="username" required />
        <label htmlFor="password">Password</label>
        <div className="password-input"><input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" autoComplete="current-password" required /><button type="button" className="show-password" onClick={() => setShowPassword(v => !v)}>{showPassword ? "Hide" : "Show"}</button></div>
        <div className="form-options"><label className="remember"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> Remember me</label><span className="demo-only">Demo access</span></div>
        {error && <p className="form-alert" role="alert">{error}</p>}
        <button className="button button-primary login-submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"} <ArrowRight size={17} /></button>
      </form>
      <div className="demo-credentials"><b>Sample {isAdmin ? "administrator" : "student"} credentials</b><div><span>{isAdmin ? "Username" : "Matriculation no."}</span><code>{isAdmin ? "admin" : "YCT/23/1234"}</code></div><div><span>Password</span><code>{isAdmin ? "Admin@123" : "Student@123"}</code></div></div>
      <p className="login-switch">{isAdmin ? "Are you a student?" : "Screening administrator?"} <Link to={isAdmin ? "/student-login" : "/admin-login"}>{isAdmin ? "Student sign in" : "Admin sign in"}</Link></p>
      <p className="prototype-note">Demonstration only. Do not enter real passwords or sensitive records.</p>
    </div></main>
  </div>;
}

function PortalShell({ role, active, onLogout, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const admin = role === "admin";
  const links = admin
    ? [{ to: "/admin", label: "Overview", icon: LayoutDashboard }, { to: "/admin#records", label: "Student records", icon: Users }]
    : [{ to: "/student", label: "Overview", icon: LayoutDashboard }, { to: "/student#bio-data", label: "Bio-data", icon: UserRound }, { to: "/student#documents", label: "My documents", icon: FileText }, { to: "/student#screening", label: "Screening status", icon: ClipboardCheck }, { to: "/clearance-slip", label: "Clearance slip", icon: FileCheck2 }];
  return <div className="portal-layout">
    <aside className={`portal-sidebar ${menuOpen ? "sidebar-open" : ""}`}><Brand /><div className="sidebar-caption">{admin ? "SCREENING OFFICE" : "STUDENT SERVICES"}</div><nav className="side-nav">{links.map(item => { const Icon = item.icon; return <Link key={item.label} to={item.to} className={`side-nav-link ${active === item.label ? "selected" : ""}`} onClick={() => setMenuOpen(false)}><Icon size={18} />{item.label}</Link>; })}</nav><div className="sidebar-bottom"><div className="prototype-mini"><ShieldCheck size={17} /><span><b>Demo environment</b><small>Sample data only</small></span></div><button className="logout-link" onClick={onLogout}><LogOut size={17} /> Sign out</button></div></aside>
    {menuOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
    <main className="portal-main"><header className="portal-topbar"><button className="mobile-menu" aria-label="Open navigation" onClick={() => setMenuOpen(v => !v)}>{menuOpen ? <X /> : <Menu />}</button><div><span className="eyebrow">{admin ? "ADMINISTRATION" : "STUDENT PORTAL"}</span><p>{admin ? "Screening management" : "Student screening and clearance"}</p></div><span className="topbar-status"><span></span> Demo mode</span></header><div className="portal-content">{children}</div></main>
  </div>;
}

function StudentPortal({ session, students, updateStudent, logout }) {
  const navigate = useNavigate();
  const student = students.find(s => s.matricNumber === session.matricNumber) || students[0];
  const completed = REQUIRED_DOCUMENTS.filter(name => student.documents?.[name]?.fileName).length;
  const submitted = student.screeningStatus !== "Not Started";
  const progress = Math.round(((completed + (student.feeVerified ? 1 : 0) + (submitted ? 1 : 0)) / 9) * 100);
  const [saved, setSaved] = useState(false);
  const [bio, setBio] = useState({ phone: student.phone || "", email: student.email || "", address: student.address || "", dateOfBirth: student.dateOfBirth || "" });
  const [files, setFiles] = useState(student.documents || {});

  function saveBio(e) {
    e.preventDefault();
    updateStudent(student.matricNumber, old => ({ ...old, ...bio }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }
  function chooseFile(name, file) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      window.alert("Please choose a file smaller than 5 MB.");
      return;
    }
    const next = { ...files, [name]: { fileName: file.name, size: file.size, type: file.type } };
    setFiles(next);
    updateStudent(student.matricNumber, old => ({ ...old, documents: next }));
  }
  function submitForScreening() {
    const missing = REQUIRED_DOCUMENTS.filter(name => !files[name]?.fileName);
    if (missing.length) {
      window.alert(`Please add all seven document names before submitting. Still missing: ${missing.join(", ")}`);
      return;
    }
    updateStudent(student.matricNumber, old => ({ ...old, screeningStatus: "Pending", submittedAt: new Date().toISOString(), reviewerFeedback: "" }));
    window.alert("Your demo screening record has been submitted for review.");
  }

  return <PortalShell role="student" active="Overview" onLogout={logout}>
    <div className="page-heading"><div><span className="eyebrow">YOUR CLEARANCE JOURNEY</span><h1>Welcome, {student.name.split(" ")[0]}.</h1><p>Manage your details and follow each stage of your screening.</p></div><StatusBadge status={student.screeningStatus} /></div>
    <section className="welcome-panel"><div><span className="welcome-chip"><GraduationCap size={15} /> {student.level} · {student.programme}</span><h2>Your clearance, one step at a time.</h2><p>Complete your bio-data and add the required document file names to prepare your demo submission.</p></div><div className="welcome-art"><ClipboardCheck size={54} /></div></section>
    <div className="stat-grid">
      <StatCard icon={<BookOpen />} label="Fee verification" value={student.feeVerified ? "Verified" : "Not verified"} note="Demonstration status" tone={student.feeVerified ? "green" : "yellow"} />
      <StatCard icon={<FileText />} label="Documents added" value={`${completed} of 7`} note="Required checklist" tone="green" />
      <StatCard icon={<Clock3 />} label="Screening status" value={student.screeningStatus} note={student.submittedAt ? `Submitted ${new Date(student.submittedAt).toLocaleDateString()}` : "Awaiting submission"} tone="yellow" />
    </div>
    {student.reviewerFeedback && <div className="feedback-banner"><b>Reviewer feedback</b><p>{student.reviewerFeedback}</p></div>}
    <section className="portal-card" id="bio-data"><div className="card-title-row"><div><h2>Student bio-data</h2><p>Review and complete your contact details.</p></div><span className="card-icon"><UserRound /></span></div><div className="identity-grid"><InfoItem label="Full name" value={student.name} /><InfoItem label="Matriculation number" value={student.matricNumber} /><InfoItem label="Department" value={student.department} /><InfoItem label="Programme" value={student.programme} /></div>
      <form className="bio-form" onSubmit={saveBio}><div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" value={bio.email} onChange={e => setBio({ ...bio, email: e.target.value })} required /></div><div className="field"><label htmlFor="phone">Phone number</label><input id="phone" value={bio.phone} onChange={e => setBio({ ...bio, phone: e.target.value })} placeholder="Enter phone number" /></div><div className="field"><label htmlFor="dob">Date of birth</label><input id="dob" type="date" value={bio.dateOfBirth} onChange={e => setBio({ ...bio, dateOfBirth: e.target.value })} /></div><div className="field field-wide"><label htmlFor="address">Residential address</label><input id="address" value={bio.address} onChange={e => setBio({ ...bio, address: e.target.value })} placeholder="Enter residential address" /></div><div className="form-footer"><span className={saved ? "saved-message" : "muted-small"}>{saved ? "Details saved." : "Changes are stored in this browser for the demo."}</span><button className="button button-primary button-small">Save details</button></div></form>
    </section>
    <section className="portal-card" id="documents"><div className="card-title-row"><div><h2>Required documents</h2><p>Add each document to your demonstration checklist. Maximum file size: 5 MB.</p></div><span className="document-counter">{completed}/7</span></div><div className="upload-list">{REQUIRED_DOCUMENTS.map((name, i) => <div className="upload-row" key={name}><span className="upload-number">{String(i + 1).padStart(2, "0")}</span><div className="upload-info"><b>{name}</b><small>{files[name]?.fileName || "No file selected"}</small></div><label className="upload-button"><UploadCloud size={16} /> {files[name]?.fileName ? "Replace" : "Choose file"}<input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => chooseFile(name, e.target.files?.[0])} /></label><StatusBadge status={files[name]?.fileName ? "Added" : "Pending"} /></div>)}</div><div className="upload-disclaimer">Prototype note: the browser records file names and metadata only. Actual files are not uploaded or securely stored.</div><button className="button button-primary" onClick={submitForScreening} disabled={student.screeningStatus === "Approved"}>Submit for screening <ArrowRight size={16} /></button></section>
    <section className="portal-card" id="screening"><div className="card-title-row"><div><h2>Screening status</h2><p>Your current demonstration workflow stage.</p></div><StatusBadge status={student.screeningStatus} /></div><div className="timeline"><TimelineItem done label="Student account created" detail="Demo student session is active." /><TimelineItem done={completed === 7} label="Document checklist" detail={`${completed} of 7 document entries added.`} /><TimelineItem done={submitted} label="Submitted for review" detail={submitted ? "Your demo record is awaiting an administrator decision." : "Complete the checklist and submit it for review."} /><TimelineItem done={student.screeningStatus === "Approved"} label="Clearance decision" detail={student.screeningStatus === "Approved" ? "Your demo record has been approved." : "The clearance slip becomes available after approval."} /></div>{student.screeningStatus === "Approved" && <Link className="button button-primary" to="/clearance-slip">View clearance slip <ArrowRight size={16} /></Link>}</section>
  </PortalShell>;
}

function StatCard({ icon, label, value, note, tone }) {
  return <article className="stat-card"><span className={`stat-icon ${tone}`}>{icon}</span><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><small className="stat-note">{note}</small></article>;
}
function InfoItem({ label, value }) { return <div className="info-item"><span>{label}</span><b>{value || "Not provided"}</b></div>; }
function TimelineItem({ done, label, detail }) { return <div className="timeline-item"><span className={`timeline-marker ${done ? "done" : ""}`}>{done ? <Check size={13} /> : null}</span><div><b>{label}</b><p>{detail}</p></div></div>; }

function AdminPortal({ students, setStudents, logout }) {
  const [selected, setSelected] = useState(students[0]?.matricNumber || "");
  const [feedback, setFeedback] = useState("");
  const [notice, setNotice] = useState("");
  const active = students.find(s => s.matricNumber === selected) || students[0];
  const pending = students.filter(s => s.screeningStatus === "Pending").length;
  const approved = students.filter(s => s.screeningStatus === "Approved").length;
  const docs = active ? REQUIRED_DOCUMENTS.filter(d => active.documents?.[d]?.fileName).length : 0;

  useEffect(() => { if (active) setFeedback(active.reviewerFeedback || ""); }, [selected]);
  function decide(status) {
    if (!active) return;
    if (status === "Approved" && !active.feeVerified) {
      setNotice("This demo record's fee status is not verified. Mark it verified before approval.");
      return;
    }
    if (status === "Approved" && docs !== 7) {
      setNotice("All seven document entries are required before approving this demo record.");
      return;
    }
    setStudents(old => old.map(s => s.matricNumber === active.matricNumber ? {
      ...s, screeningStatus: status, reviewerFeedback: feedback.trim(),
      approvedAt: status === "Approved" ? new Date().toISOString() : "",
    } : s));
    setNotice(`Demo record marked ${status.toLowerCase()}.`);
  }
  function setFeeVerified(checked) {
    if (!active) return;
    setStudents(old => old.map(s => s.matricNumber === active.matricNumber ? { ...s, feeVerified: checked } : s));
    setNotice(checked ? "Demo fee status marked verified." : "Demo fee status marked not verified.");
  }

  return <PortalShell role="admin" active="Overview" onLogout={logout}>
    <div className="page-heading"><div><span className="eyebrow">SCREENING OFFICE</span><h1>Admin dashboard</h1><p>Review demo student submissions and record clearance decisions.</p></div><span className="demo-tag"><ShieldCheck size={15} /> Demo administrator</span></div>
    <div className="stat-grid admin-stats"><StatCard icon={<Users />} label="Student records" value={students.length} note="Demo records" tone="green" /><StatCard icon={<Clock3 />} label="Awaiting review" value={pending} note="Pending screening" tone="yellow" /><StatCard icon={<BadgeCheck />} label="Approved records" value={approved} note="Clearance decisions" tone="green" /></div>
    <section className="portal-card" id="records"><div className="card-title-row"><div><h2>Student records</h2><p>Select a record to review its demo submission.</p></div><span className="card-icon"><Users /></span></div><div className="table-wrap"><table className="records-table"><thead><tr><th>Student</th><th>Matriculation no.</th><th>Documents</th><th>Status</th><th>Review</th></tr></thead><tbody>{students.map(s => <tr key={s.matricNumber} className={selected === s.matricNumber ? "row-selected" : ""}><td><b>{s.name}</b><small>{s.department}</small></td><td>{s.matricNumber}</td><td>{REQUIRED_DOCUMENTS.filter(d => s.documents?.[d]?.fileName).length}/7</td><td><StatusBadge status={s.screeningStatus} /></td><td><button className="table-action" onClick={() => { setSelected(s.matricNumber); setNotice(""); }}>Review record <ChevronRight size={14} /></button></td></tr>)}</tbody></table></div></section>
    {active && <section className="portal-card review-card"><div className="card-title-row"><div><span className="eyebrow">RECORD REVIEW</span><h2>{active.name}</h2><p>{active.matricNumber} · {active.department}</p></div><StatusBadge status={active.screeningStatus} /></div><div className="review-summary"><InfoItem label="Programme" value={active.programme} /><InfoItem label="Level" value={active.level} /><InfoItem label="Email" value={active.email} /><InfoItem label="Documents added" value={`${docs} of 7`} /></div><div className="fee-verification"><div><b>School-fee status</b><p>This is a manual demo flag, not a payment-system check.</p></div><label className="toggle-label"><input type="checkbox" checked={active.feeVerified} onChange={e => setFeeVerified(e.target.checked)} /> Mark verified</label></div><h3 className="subheading">Document checklist</h3><div className="admin-document-list">{REQUIRED_DOCUMENTS.map(d => <div key={d} className="admin-document"><FileText size={17} /><span><b>{d}</b><small>{active.documents?.[d]?.fileName || "No file name recorded"}</small></span><StatusBadge status={active.documents?.[d]?.fileName ? "Added" : "Pending"} /></div>)}</div><div className="field review-feedback"><label htmlFor="feedback">Reviewer feedback</label><textarea id="feedback" rows="3" value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Add guidance for the student if changes are required." /></div>{notice && <p className="notice-banner" role="status">{notice}</p>}<div className="review-actions"><button className="button button-danger" onClick={() => decide("Rejected")}>Reject / request changes</button><button className="button button-primary" onClick={() => decide("Approved")}>Approve clearance <Check size={16} /></button></div><p className="prototype-note">Decisions update only this browser's local demo data. No official record is changed.</p></section>}
  </PortalShell>;
}

function ClearanceSlip({ session, students }) {
  const student = students.find(s => s.matricNumber === session.matricNumber) || students[0];
  if (student.screeningStatus !== "Approved") return <PortalShell role="student" active="Clearance slip" onLogout={() => { clearSession(); window.location.href = "/student-login"; }}><section className="portal-card unavailable"><span className="login-symbol"><FileCheck2 /></span><h1>Clearance slip unavailable</h1><p>Your demo record must be approved by the administrator before a slip can be printed.</p><StatusBadge status={student.screeningStatus} /><Link className="button button-primary" to="/student">Return to dashboard</Link></section></PortalShell>;
  return <PortalShell role="student" active="Clearance slip" onLogout={() => { clearSession(); window.location.href = "/student-login"; }}><div className="page-heading no-print"><div><span className="eyebrow">CLEARANCE DOCUMENT</span><h1>Clearance slip</h1><p>Review the demo slip and use your browser's print command.</p></div><button className="button button-primary" onClick={() => window.print()}>Print clearance slip <FileCheck2 size={16} /></button></div><article className="clearance-paper"><div className="slip-header"><span className="slip-mark">Y</span><div><h1>YABA COLLEGE OF TECHNOLOGY</h1><p>STUDENT SCREENING AND CLEARANCE SYSTEM</p><span>DEMONSTRATION CLEARANCE SLIP</span></div></div><div className="slip-approved"><BadgeCheck size={18} /> DEMO RECORD APPROVED</div><h2>STUDENT CLEARANCE RECORD</h2><div className="slip-grid"><InfoItem label="Full name" value={student.name} /><InfoItem label="Matriculation number" value={student.matricNumber} /><InfoItem label="Department" value={student.department} /><InfoItem label="Programme" value={student.programme} /><InfoItem label="Level" value={student.level} /><InfoItem label="Fee verification" value={student.feeVerified ? "Demo status verified" : "Not verified"} /><InfoItem label="Decision date" value={student.approvedAt ? new Date(student.approvedAt).toLocaleDateString() : "Not recorded"} /><InfoItem label="Documents recorded" value={`${REQUIRED_DOCUMENTS.filter(d => student.documents?.[d]?.fileName).length} of 7`} /></div><div className="slip-note"><b>Important notice</b><p>This is a demonstration document generated by a front-end academic prototype. It is not an official YABATECH clearance certificate and must not be presented as one.</p></div><div className="slip-signatures"><span>Student copy</span><span>Demo system record</span></div></article></PortalShell>;
}

function Footer() { return <footer className="site-footer"><Brand /><span>Academic screening, organised digitally.</span><span>Prototype · Not an official institutional service</span></footer>; }
function NotFound() { return <main className="not-found"><span className="brand-mark">Y</span><h1>Page not found</h1><p>The page you're looking for doesn't exist.</p><Link className="button button-primary" to="/">Return home</Link></main>; }

export default App;