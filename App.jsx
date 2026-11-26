import { useEffect, useMemo, useState } from "react";
import {
  GraduationCap, Users, UserPlus, Search, Pencil, Trash2, X,
  LayoutDashboard, BookOpen, Mail, Phone, CalendarDays, Menu,
  CheckCircle2, AlertCircle, Filter, Download
} from "lucide-react";

const starterStudents = [
  { id: 1, name: "Aarav Sharma", email: "aarav.sharma@example.com", phone: "9876543210", course: "Computer Science", year: "2nd Year", joined: "2026-06-12" },
  { id: 2, name: "Diya Nair", email: "diya.nair@example.com", phone: "9876543211", course: "Information Science", year: "3rd Year", joined: "2026-06-14" },
  { id: 3, name: "Rohan Patel", email: "rohan.patel@example.com", phone: "9876543212", course: "Electronics", year: "1st Year", joined: "2026-07-01" },
  { id: 4, name: "Ananya Rao", email: "ananya.rao@example.com", phone: "9876543213", course: "Computer Science", year: "4th Year", joined: "2026-07-08" },
  { id: 5, name: "Kabir Das", email: "kabir.das@example.com", phone: "9876543214", course: "Mechanical", year: "2nd Year", joined: "2026-07-15" }
];

const emptyForm = {
  name: "", email: "", phone: "", course: "", year: ""
};

function App() {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem("campusdesk-students");
      return saved ? JSON.parse(saved) : starterStudents;
    } catch {
      return starterStudents;
    }
  });
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All courses");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("campusdesk-students", JSON.stringify(students));
  }, [students]);

  const courses = ["All courses", "Computer Science", "Information Science", "Electronics", "Mechanical", "Civil", "Business Administration"];

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();
    return students.filter((student) => {
      const matchesSearch = [student.name, student.email, student.course, student.phone]
        .some((value) => value.toLowerCase().includes(term));
      const matchesCourse = courseFilter === "All courses" || student.course === courseFilter;
      return matchesSearch && matchesCourse;
    });
  }, [students, search, courseFilter]);

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditingId(student.id);
    setForm({
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course,
      year: student.year
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter the student's name.";
    else if (form.name.trim().length < 2) next.name = "Name must contain at least 2 characters.";

    if (!form.email.trim()) next.email = "Please enter an email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    else if (students.some((s) => s.email.toLowerCase() === form.email.trim().toLowerCase() && s.id !== editingId)) {
      next.email = "This email is already registered.";
    }

    if (!form.phone.trim()) next.phone = "Please enter a phone number.";
    else if (!/^[0-9]{10}$/.test(form.phone.trim())) next.phone = "Enter a valid 10-digit phone number.";

    if (!form.course) next.course = "Please select a course.";
    if (!form.year) next.year = "Please select an academic year.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    if (editingId !== null) {
      setStudents((current) => current.map((student) =>
        student.id === editingId
          ? { ...student, ...form, name: form.name.trim(), email: form.email.trim() }
          : student
      ));
      showNotice("Student details updated successfully.");
    } else {
      const newStudent = {
        id: Date.now(),
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        joined: new Date().toISOString().slice(0, 10)
      };
      setStudents((current) => [newStudent, ...current]);
      showNotice("Student registered successfully.");
    }
    setModalOpen(false);
    setForm(emptyForm);
  };

  const deleteStudent = (student) => {
    const confirmed = window.confirm(`Delete ${student.name}'s record? This action cannot be undone.`);
    if (!confirmed) return;
    setStudents((current) => current.filter((item) => item.id !== student.id));
    showNotice("Student record deleted.");
  };

  const exportCSV = () => {
    const headings = ["Name", "Email", "Phone", "Course", "Year", "Joined"];
    const rows = students.map((s) => [s.name, s.email, s.phone, s.course, s.year, s.joined]);
    const csv = [headings, ...rows].map((row) =>
      row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")
    ).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "campusdesk-students.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><GraduationCap size={23} /></div>
          <div><strong>CampusDesk</strong><span>STUDENT PORTAL</span></div>
          <button className="icon-button close-nav" onClick={() => setMobileNavOpen(false)} aria-label="Close menu"><X size={19} /></button>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          <a className="nav-link active" href="#dashboard"><LayoutDashboard size={18} /> Dashboard</a>
          <a className="nav-link" href="#students"><Users size={18} /> Students</a>
          <a className="nav-link" href="#registration" onClick={(e) => { e.preventDefault(); openAddModal(); setMobileNavOpen(false); }}><UserPlus size={18} /> Registration</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><BookOpen size={17} /></div>
            <strong>Need a hand?</strong>
            <p>Keep student information organized in one place.</p>
          </div>
          <div className="profile">
            <div className="avatar">AD</div>
            <div><strong>Admin User</strong><span>Administrator</span></div>
            <span className="online-dot" />
          </div>
        </div>
      </aside>

      {mobileNavOpen && <button className="mobile-backdrop" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" />}

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <button className="icon-button menu-toggle" onClick={() => setMobileNavOpen(true)} aria-label="Open menu"><Menu size={21} /></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>Dashboard</strong></div>
          <div className="topbar-right"><span className="status-pill"><span /> System operational</span><div className="top-avatar">AD</div></div>
        </header>

        <section className="page-heading">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h1>Student Dashboard</h1>
            <p className="subheading">Manage registrations and keep track of your students.</p>
          </div>
          <button className="primary-button" onClick={openAddModal}><UserPlus size={17} /> Add new student</button>
        </section>

        {notice && <div className="toast"><CheckCircle2 size={18} /> {notice}</div>}

        <section className="stats-grid" aria-label="Student statistics">
          <StatCard icon={<Users size={20} />} label="Total students" value={students.length} note="Registered student records" tone="blue" />
          <StatCard icon={<BookOpen size={20} />} label="Courses" value={new Set(students.map((s) => s.course)).size} note="Different courses represented" tone="purple" />
          <StatCard icon={<UserPlus size={20} />} label="New this month" value={students.filter((s) => s.joined.slice(0, 7) === new Date().toISOString().slice(0, 7)).length} note="Registrations this month" tone="green" />
        </section>

        <section className="panel" id="students">
          <div className="panel-heading">
            <div><h2>Student records</h2><p>View, search, update or remove student information.</p></div>
            <button className="secondary-button export-button" onClick={exportCSV}><Download size={16} /> Export CSV</button>
          </div>
          <div className="toolbar">
            <div className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, course..." aria-label="Search students" />{search && <button onClick={() => setSearch("")} aria-label="Clear search"><X size={15} /></button>}</div>
            <div className="filter-box"><Filter size={16} /><select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} aria-label="Filter by course">{courses.map((course) => <option key={course}>{course}</option>)}</select></div>
          </div>

          <div className="table-wrap">
            <table>
              <thead><tr><th>STUDENT</th><th>COURSE</th><th>YEAR</th><th>PHONE</th><th>JOINED</th><th className="actions-heading">ACTIONS</th></tr></thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td><div className="student-cell"><div className="student-avatar">{student.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}</div><div><strong>{student.name}</strong><span><Mail size={12} /> {student.email}</span></div></div></td>
                    <td><span className="course-tag">{student.course}</span></td>
                    <td>{student.year}</td>
                    <td className="phone-cell"><Phone size={13} /> {student.phone}</td>
                    <td>{new Date(`${student.joined}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                    <td><div className="row-actions"><button className="action-button edit" onClick={() => openEditModal(student)} aria-label={`Edit ${student.name}`} title="Edit"><Pencil size={16} /></button><button className="action-button delete" onClick={() => deleteStudent(student)} aria-label={`Delete ${student.name}`} title="Delete"><Trash2 size={16} /></button></div></td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && <tr><td colSpan="6"><div className="empty-state"><Search size={25} /><strong>No students found</strong><span>Try a different search or clear the course filter.</span><button className="text-button" onClick={() => { setSearch(""); setCourseFilter("All courses"); }}>Clear filters</button></div></td></tr>}
              </tbody>
            </table>
          </div>
          <div className="table-footer"><span>Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> students</span><span><CalendarDays size={14} /> Data saved in this browser</span></div>
        </section>
        <footer className="footer">© {new Date().getFullYear()} CampusDesk Student Portal <span>Built for learning · React.js</span></footer>
      </main>

      {modalOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-heading">
              <div><p className="eyebrow">{editingId ? "UPDATE RECORD" : "NEW REGISTRATION"}</p><h2 id="modal-title">{editingId ? "Edit student details" : "Register a student"}</h2><p>Enter the student's information below.</p></div>
              <button className="icon-button" onClick={() => setModalOpen(false)} aria-label="Close form"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                <FormField label="Full name" error={errors.name}><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Priya Sharma" autoFocus /></FormField>
                <FormField label="Email address" error={errors.email}><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="student@example.com" /></FormField>
                <FormField label="Phone number" error={errors.phone}><input type="tel" inputMode="numeric" maxLength="10" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} placeholder="10-digit mobile number" /></FormField>
                <FormField label="Course" error={errors.course}><select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}><option value="">Select a course</option>{courses.slice(1).map((course) => <option key={course}>{course}</option>)}</select></FormField>
                <FormField label="Academic year" error={errors.year}><select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}><option value="">Select year</option>{["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year"].map((year) => <option key={year}>{year}</option>)}</select></FormField>
              </div>
              <div className="form-note"><AlertCircle size={15} /> All fields are required. Email addresses must be unique.</div>
              <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="primary-button">{editingId ? "Save changes" : "Register student"}</button></div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, note, tone }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></article>;
}

function FormField({ label, error, children }) {
  return <label className="form-field"><span>{label}</span>{children}{error && <small className="field-error">{error}</small>}</label>;
}

export default App;
