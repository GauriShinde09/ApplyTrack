import { useEffect, useMemo, useState } from "react";

import {

  LayoutDashboard,

  BriefcaseBusiness,

  CalendarDays,

  ChartNoAxesCombined,

  Search,

  Bell,

  Plus,

  Sparkles,

  ArrowRight,

  Clock,

  ExternalLink,

  TrendingUp,

  Target,

  Award,

  Menu,

  X,

} from "lucide-react";

import {

  ResponsiveContainer,

  PieChart,

  Pie,

  Cell,

  Tooltip,

  Legend,

  BarChart,

  Bar,

  CartesianGrid,

  XAxis,

  YAxis,

} from "recharts";


import ApplicationTable from "./components/ApplicationTable";

import Toast, { showToast } from "./components/Toast";

const STATUS_COLORS = {

  Applied: "#8B72DE",

  Interview: "#E9A23B",

  Offer: "#37A879",

  Rejected: "#E87886",

};

const NAV = [

  { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },

  { id: "Applications", label: "Applications", icon: BriefcaseBusiness },

  { id: "Interviews", label: "Interviews", icon: CalendarDays },

  { id: "Analytics", label: "Analytics", icon: ChartNoAxesCombined },

];

function readApplications() {

  try {

    const stored = localStorage.getItem("applications");

    return stored ? JSON.parse(stored) : [];

  } catch {

    return [];

  }

}

function dateLabel(date) {

  if (!date) return "Date not set";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return "Date not set";

  return parsed.toLocaleDateString("en-IN", {

    day: "numeric",

    month: "short",

    year: "numeric",

  });

}

function daysUntil(date) {

  if (!date) return null;

  const target = new Date(`${date}T00:00:00`);

  if (Number.isNaN(target.getTime())) return null;

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return Math.ceil((target.getTime() - today.getTime()) / 86400000);

}

export default function App() {

  const [applications, setApplications] = useState(readApplications);

  const [activeSection, setActiveSection] = useState("Dashboard");

  const [showForm, setShowForm] = useState(false);

  const [editingApplication, setEditingApplication] = useState(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [sortOrder, setSortOrder] = useState("newest");

  const [mobileNav, setMobileNav] = useState(false);

  // Save applications in LocalStorage

  useEffect(() => {

    localStorage.setItem("applications", JSON.stringify(applications));

  }, [applications]);

  // Search, filter and sorting

  const filteredApplications = useMemo(() => {

    const query = search.trim().toLowerCase();

    return applications

      .filter((app) => {

        const matchesSearch =

          !query ||

          [app.company, app.role, app.status, app.notes].some((value) =>

            String(value || "").toLowerCase().includes(query)

          );

        const matchesStatus =

          statusFilter === "All" || app.status === statusFilter;

        return matchesSearch && matchesStatus;

      })

      .sort((a, b) => {

        const dateA = a.date || "";

        const dateB = b.date || "";

        return sortOrder === "newest"

          ? dateB.localeCompare(dateA)

          : dateA.localeCompare(dateB);

      });

  }, [applications, search, statusFilter, sortOrder]);

  // Dashboard statistics

  const stats = useMemo(

    () => ({

      total: applications.length,

      interview: applications.filter((a) => a.status === "Interview").length,

      offer: applications.filter((a) => a.status === "Offer").length,

      rejected: applications.filter((a) => a.status === "Rejected").length,

      applied: applications.filter((a) => a.status === "Applied").length,

    }),

    [applications]

  );

  // Upcoming interviews

  const upcomingInterviews = useMemo(

    () =>

      applications

        .filter(

          (app) =>

            app.interviewDate &&

            app.status === "Interview" &&

            daysUntil(app.interviewDate) !== null &&

            daysUntil(app.interviewDate) >= 0

        )

        .sort((a, b) =>

          a.interviewDate.localeCompare(b.interviewDate)

        ),

    [applications]

  );

  // Analytics data

  const statusData = ["Applied", "Interview", "Offer", "Rejected"].map(

    (status) => ({

      name: status,

      value: applications.filter((app) => app.status === status).length,

    })

  );

  const monthlyData = useMemo(() => {

    const result = {};

    applications.forEach((app) => {

      if (!app.date) return;

      const date = new Date(`${app.date}T00:00:00`);

      if (Number.isNaN(date.getTime())) return;

      const month = date.toLocaleDateString("en-IN", {

        month: "short",

        year: "2-digit",

      });

      result[month] = (result[month] || 0) + 1;

    });

    return Object.entries(result)

      .map(([month, count]) => ({ month, count }))

      .slice(-6);

  }, [applications]);

  // Add and update application

  const saveApplication = (data) => {

    if (editingApplication) {

      setApplications((previous) =>

        previous.map((app) =>

          app.id === editingApplication.id

            ? { ...data, id: app.id }

            : app

        )

      );

      showToast("Application updated successfully!", "success");

    } else {

      const newApplication = {

        ...data,

        id:

          globalThis.crypto?.randomUUID?.() ||

          `${Date.now()}-${Math.random()}`,

      };

      setApplications((previous) => [newApplication, ...previous]);

      showToast("Application added successfully!", "success");

    }

    setShowForm(false);

    setEditingApplication(null);

  };

  // Open edit form

  const editApplication = (application) => {

    setEditingApplication(application);

    setShowForm(true);

    setActiveSection("Applications");

  };

  // Delete application

  // Confirmation popup is handled by ApplicationTable.

  const deleteApplication = (id) => {

    const exists = applications.some((app) => app.id === id);

    if (!exists) return;

    setApplications((previous) =>

      previous.filter((app) => app.id !== id)

    );

    showToast("Application deleted successfully!", "success");

  };

  // Open add form

  const openAdd = () => {

    setEditingApplication(null);

    setShowForm(true);

  };

  return (

    <div className="min-h-screen bg-[#F7F5FC] text-[#30264D]">

      <Toast />

      {mobileNav && (

        <button

          aria-label="Close menu backdrop"

          className="fixed inset-0 z-40 bg-[#21183D]/40 lg:hidden"

          onClick={() => setMobileNav(false)}

        />

      )}

      {/* Sidebar */}

      <aside

        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[#EEE8F8] bg-white px-5 py-6 transition-transform lg:translate-x-0 ${

          mobileNav ? "translate-x-0" : "-translate-x-full"

        }`}

      >

        <div className="flex items-center justify-between px-2">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7251CC] to-[#A38AE8] text-white shadow-lg shadow-purple-200">

              <BriefcaseBusiness size={23} />

            </div>

            <div>

              <p className="text-lg font-extrabold tracking-tight">

                ApplyTrack

              </p>

              <p className="text-xs text-[#998DB2]">Career workspace</p>

            </div>

          </div>

          <button

            className="lg:hidden"

            onClick={() => setMobileNav(false)}

            aria-label="Close navigation"

          >

            <X size={19} />

          </button>

        </div>

        <div className="mt-10">

          <p className="px-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#B0A6C4]">

            Workspace

          </p>

          <nav className="mt-3 space-y-1">

            {NAV.map(({ id, label, icon: Icon }) => (

              <button

                key={id}

                onClick={() => {

                  setActiveSection(id);

                  setMobileNav(false);

                }}

                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${

                  activeSection === id

                    ? "bg-[#F0EAFE] text-[#7251CC]"

                    : "text-[#827696] hover:bg-[#FAF8FE] hover:text-[#7251CC]"

                }`}

              >

                <Icon size={18} />

                {label}

                {id === "Interviews" && upcomingInterviews.length > 0 && (

                  <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs text-[#7251CC]">

                    {upcomingInterviews.length}

                  </span>

                )}

              </button>

            ))}

          </nav>

        </div>

        <div className="mt-auto rounded-2xl bg-gradient-to-br from-[#7250C2] to-[#A38AE8] p-4 text-white">

          <div className="flex items-center gap-2">

            <Sparkles size={17} />

            <p className="text-sm font-bold">Keep going!</p>

          </div>

          <p className="mt-2 text-xs leading-5 text-white/85">

            Every application is one more step toward your next opportunity.

          </p>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/25">

            <div

              className="h-full rounded-full bg-white"

              style={{

                width: `${

                  applications.length

                    ? Math.min(100, applications.length * 10)

                    : 0

                }%`,

              }}

            />

          </div>

          <p className="mt-2 text-[11px] text-white/80">

            {applications.length} applications tracked

          </p>

        </div>

        <p className="mt-5 px-2 text-xs text-[#B0A6C4]">

          Made for your next opportunity ✨

        </p>

      </aside>

      {/* Main content */}

      <main className="min-h-screen lg:ml-[260px]">

        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#EEE8F8] bg-[#F7F5FC]/90 px-4 backdrop-blur-xl sm:px-8">

          <div className="flex items-center gap-3">

            <button

              aria-label="Open navigation"

              onClick={() => setMobileNav(true)}

              className="rounded-xl p-2 hover:bg-white lg:hidden"

            >

              <Menu size={20} />

            </button>

            <div>

              <p className="text-xs font-medium text-[#998DB2]">

                Workspace / {activeSection}

              </p>

              <h1 className="mt-0.5 text-xl font-extrabold">

                {activeSection}

              </h1>

            </div>

          </div>

          <div className="flex items-center gap-2 sm:gap-3">

            <div className="hidden items-center gap-2 rounded-xl border border-[#EAE3FA] bg-white px-3 py-2 text-xs text-[#887CA6] sm:flex">

              <Bell size={15} />

              <span>

                {upcomingInterviews.length

                  ? `${upcomingInterviews.length} upcoming interview${

                      upcomingInterviews.length === 1 ? "" : "s"

                    }`

                  : "You're all caught up"}

              </span>

            </div>

            <button

              onClick={openAdd}

              className="inline-flex items-center gap-2 rounded-xl bg-[#7251CC] px-3.5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#6040B5] sm:px-4"

            >

              <Plus size={17} />

              <span className="hidden sm:inline">Add application</span>

              <span className="sm:hidden">Add</span>

            </button>

          </div>

        </header>

        <div className="mx-auto max-w-[1500px] space-y-7 p-4 sm:p-8">

          {/* Dashboard */}

          {activeSection === "Dashboard" && (

            <>

              <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#7250C2] via-[#8769D3] to-[#A38AE8] p-6 text-white shadow-lg shadow-purple-100 sm:p-8">

                <div className="pointer-events-none absolute -right-8 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />

                <div className="pointer-events-none absolute -bottom-28 right-40 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

                <div className="relative max-w-2xl">

                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">

                    <Sparkles size={14} />

                    Your career journey, organized

                  </span>

                  <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">

                    Small steps today.

                    <br className="hidden sm:block" /> Big opportunities

                    tomorrow.

                  </h2>

                  <p className="mt-3 max-w-lg text-sm leading-6 text-white/85">

                    Track every application, prepare for interviews, and see

                    your job search progress in one calm workspace.

                  </p>

                  <button

                    onClick={openAdd}

                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#7251CC] transition hover:bg-[#F7F3FF]"

                  >

                    Add an application <ArrowRight size={16} />

                  </button>

                </div>

              </section>

              <StatsGrid stats={stats} />

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_.8fr]">

                <UpcomingInterviews

                  applications={upcomingInterviews}

                  onViewAll={() => setActiveSection("Interviews")}

                />

                <QuickInsights stats={stats} />

              </div>

              <section className="rounded-2xl border border-[#EAE3FA] bg-white p-5 shadow-sm sm:p-6">

                <SectionHeading

                  title="Recent applications"

                  subtitle="Your latest job search activity"

                  action={

                    <button

                      onClick={() => setActiveSection("Applications")}

                      className="inline-flex items-center gap-1 text-sm font-bold text-[#7251CC] hover:underline"

                    >

                      View all <ArrowRight size={15} />

                    </button>

                  }

                />

                <div className="mt-5">

                  <ApplicationTable

                    applications={applications

                      .slice()

                      .sort((a, b) =>

                        (b.date || "").localeCompare(a.date || "")

                      )

                      .slice(0, 5)}

                    onEdit={editApplication}

                    onDelete={deleteApplication}

                  />

                </div>

              </section>

            </>

          )}

          {/* Applications */}

          {activeSection === "Applications" && (

            <section className="space-y-5">

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                <div>

                  <h2 className="text-2xl font-extrabold">

                    Your applications

                  </h2>

                  <p className="mt-1 text-sm text-[#887CA6]">

                    Manage and update every opportunity in one place.

                  </p>

                </div>

                <p className="text-sm font-semibold text-[#887CA6]">

                  {filteredApplications.length} results

                </p>

              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px_180px]">

                <div className="relative">

                  <Search

                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A69ABF]"

                    size={17}

                  />

                  <input

                    value={search}

                    onChange={(e) => setSearch(e.target.value)}

                    placeholder="Search company, role, status..."

                    className="w-full rounded-xl border border-[#E6DFF5] bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#9278DD] focus:ring-4 focus:ring-[#F0EAFE]"

                  />

                </div>

                <select

                  value={statusFilter}

                  onChange={(e) => setStatusFilter(e.target.value)}

                  className="rounded-xl border border-[#E6DFF5] bg-white px-3.5 py-3 text-sm text-[#655780] outline-none focus:border-[#9278DD]"

                >

                  <option value="All">All statuses</option>

                  {["Applied", "Interview", "Offer", "Rejected"].map(

                    (status) => (

                      <option key={status}>{status}</option>

                    )

                  )}

                </select>

                <select

                  value={sortOrder}

                  onChange={(e) => setSortOrder(e.target.value)}

                  className="rounded-xl border border-[#E6DFF5] bg-white px-3.5 py-3 text-sm text-[#655780] outline-none focus:border-[#9278DD]"

                >

                  <option value="newest">Newest first</option>

                  <option value="oldest">Oldest first</option>

                </select>

              </div>

              <ApplicationTable

                applications={filteredApplications}

                onEdit={editApplication}

                onDelete={deleteApplication}

              />

            </section>

          )}

          {/* Interviews */}

          {activeSection === "Interviews" && (

            <section className="space-y-5">

              <div>

                <h2 className="text-2xl font-extrabold">Interview planner</h2>

                <p className="mt-1 text-sm text-[#887CA6]">

                  Keep upcoming interviews and next steps in sight.

                </p>

              </div>

              {upcomingInterviews.length ? (

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

                  {upcomingInterviews.map((app) => (

                    <InterviewCard key={app.id} app={app} />

                  ))}

                </div>

              ) : (

                <EmptyState

                  icon={CalendarDays}

                  title="No upcoming interviews"

                  text="When an application has Interview status and an interview date, it will appear here."

                  action={openAdd}

                />

              )}

            </section>

          )}

          {/* Analytics */}

          {activeSection === "Analytics" && (

            <section className="space-y-6">

              <div>

                <h2 className="text-2xl font-extrabold">

                  Your job search insights

                </h2>

                <p className="mt-1 text-sm text-[#887CA6]">

                  Understand your progress and application outcomes.

                </p>

              </div>

              <StatsGrid stats={stats} />

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                <div className="rounded-2xl border border-[#EAE3FA] bg-white p-5 shadow-sm sm:p-6">

                  <SectionHeading

                    title="Application status"

                    subtitle="How your applications are distributed"

                  />

                  <div className="mt-4 h-[300px]">

                    {applications.length ? (

                      <ResponsiveContainer width="100%" height="100%">

                        <PieChart>

                          <Pie

                            data={statusData}

                            dataKey="value"

                            nameKey="name"

                            cx="50%"

                            cy="48%"

                            outerRadius={95}

                            innerRadius={58}

                            paddingAngle={4}

                          >

                            {statusData.map((entry) => (

                              <Cell

                                key={entry.name}

                                fill={STATUS_COLORS[entry.name]}

                              />

                            ))}

                          </Pie>

                          <Tooltip />

                          <Legend verticalAlign="bottom" />

                        </PieChart>

                      </ResponsiveContainer>

                    ) : (

                      <EmptyAnalytics />

                    )}

                  </div>

                </div>

                <div className="rounded-2xl border border-[#EAE3FA] bg-white p-5 shadow-sm sm:p-6">

                  <SectionHeading

                    title="Applications over time"

                    subtitle="Based on the applied date you recorded"

                  />

                  <div className="mt-4 h-[300px]">

                    {monthlyData.length ? (

                      <ResponsiveContainer width="100%" height="100%">

                        <BarChart

                          data={monthlyData}

                          margin={{ top: 12, right: 8, left: -18, bottom: 4 }}

                        >

                          <CartesianGrid

                            strokeDasharray="3 3"

                            vertical={false}

                            stroke="#F0EBF8"

                          />

                          <XAxis

                            dataKey="month"

                            tick={{ fill: "#887CA6", fontSize: 12 }}

                            axisLine={false}

                            tickLine={false}

                          />

                          <YAxis

                            allowDecimals={false}

                            tick={{ fill: "#887CA6", fontSize: 12 }}

                            axisLine={false}

                            tickLine={false}

                          />

                          <Tooltip />

                          <Bar

                            dataKey="count"

                            name="Applications"

                            fill="#8B72DE"

                            radius={[7, 7, 0, 0]}

                          />

                        </BarChart>

                      </ResponsiveContainer>

                    ) : (

                      <EmptyAnalytics />

                    )}

                  </div>

                </div>

              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <MetricCard

                  icon={Target}

                  title="Interview rate"

                  value={`${

                    stats.total

                      ? Math.round((stats.interview / stats.total) * 100)

                      : 0

                  }%`}

                  text="Applications currently at interview stage"

                />

                <MetricCard

                  icon={Award}

                  title="Offer rate"

                  value={`${

                    stats.total

                      ? Math.round((stats.offer / stats.total) * 100)

                      : 0

                  }%`}

                  text="Applications that resulted in an offer"

                />

                <MetricCard

                  icon={TrendingUp}

                  title="Active applications"

                  value={stats.applied + stats.interview}

                  text="Applied and interview-stage opportunities"

                />

              </div>

            </section>

          )}

        </div>

        <footer className="border-t border-[#EEE8F8] px-6 py-5 text-center text-xs text-[#A69ABF]">

          ApplyTrack · One step closer to your next opportunity ✨

        </footer>

      </main>

      {/* Add / Edit Form */}

      {showForm && (

        <InlineApplicationForm
          key={editingApplication?.id || "new-application"}
          initialData={editingApplication}
          onSave={saveApplication}
          onClose={() => {
            setShowForm(false);
            setEditingApplication(null);
          }}
        />

      )}

    </div>

  );

}

function SectionHeading({ title, subtitle, action }) {

  return (

    <div className="flex items-start justify-between gap-3">

      <div>

        <h3 className="text-base font-extrabold text-[#30264D]">{title}</h3>

        {subtitle && (

          <p className="mt-1 text-sm text-[#887CA6]">{subtitle}</p>

        )}

      </div>

      {action}

    </div>

  );

}

function StatsGrid({ stats }) {

  const cards = [

    {

      title: "Total applications",

      value: stats.total,

      icon: BriefcaseBusiness,

      bg: "bg-[#F0EAFE]",

      color: "text-[#7251CC]",

      note: "All opportunities tracked",

    },

    {

      title: "Interviews",

      value: stats.interview,

      icon: CalendarDays,

      bg: "bg-[#FFF3DD]",

      color: "text-[#A66D12]",

      note: "Conversations in progress",

    },

    {

      title: "Offers received",

      value: stats.offer,

      icon: Award,

      bg: "bg-[#E2F6EC]",

      color: "text-[#24845F]",

      note: "Great progress!",

    },

    {

      title: "Rejected",

      value: stats.rejected,

      icon: TrendingUp,

      bg: "bg-[#FFE9ED]",

      color: "text-[#C84F64]",

      note: "Keep moving forward",

    },

  ];

  return (

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">

      {cards.map(({ title, value, icon: Icon, bg, color, note }) => (

        <div

          key={title}

          className="rounded-2xl border border-[#EAE3FA] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"

        >

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-[#887CA6]">{title}</p>

              <p className="mt-2 text-3xl font-extrabold tracking-tight">

                {value}

              </p>

            </div>

            <span

              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${bg} ${color}`}

            >

              <Icon size={21} />

            </span>

          </div>

          <p className="mt-4 text-xs text-[#A69ABF]">{note}</p>

        </div>

      ))}

    </div>

  );

}

function UpcomingInterviews({ applications, onViewAll }) {

  return (

    <section className="rounded-2xl border border-[#EAE3FA] bg-white p-5 shadow-sm sm:p-6">

      <SectionHeading

        title="Upcoming interviews"

        subtitle="Get ready for your next conversation"

        action={

          <button

            onClick={onViewAll}

            className="text-sm font-bold text-[#7251CC] hover:underline"

          >

            View all

          </button>

        }

      />

      <div className="mt-5 space-y-3">

        {applications.slice(0, 3).map((app) => (

          <InterviewRow key={app.id} app={app} />

        ))}

        {applications.length === 0 && (

          <div className="rounded-2xl bg-[#FBFAFE] px-4 py-7 text-center">

            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0EAFE] text-[#7251CC]">

              <CalendarDays size={21} />

            </div>

            <p className="mt-3 text-sm font-semibold text-[#655780]">

              No interviews scheduled

            </p>

            <p className="mt-1 text-xs text-[#A69ABF]">

              Add an interview date to an application.

            </p>

          </div>

        )}

      </div>

    </section>

  );

}

function InterviewRow({ app }) {

  const days = daysUntil(app.interviewDate);

  return (

    <div className="flex items-center gap-3 rounded-2xl border border-[#F0EBF8] p-3.5">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF3DD] text-[#A66D12]">

        <CalendarDays size={19} />

      </div>

      <div className="min-w-0 flex-1">

        <p className="truncate text-sm font-bold">{app.company}</p>

        <p className="mt-0.5 truncate text-xs text-[#887CA6]">{app.role}</p>

        <p className="mt-1 text-xs font-medium text-[#7251CC]">

          {dateLabel(app.interviewDate)}

        </p>

      </div>

      <span className="whitespace-nowrap rounded-lg bg-[#F0EAFE] px-2 py-1 text-[11px] font-bold text-[#7251CC]">

        {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days} days`}

      </span>

    </div>

  );

}

function InterviewCard({ app }) {

  const days = daysUntil(app.interviewDate);

  return (

    <div className="rounded-2xl border border-[#EAE3FA] bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF3DD] text-[#A66D12]">

          <CalendarDays size={21} />

        </span>

        <span className="rounded-full bg-[#F0EAFE] px-3 py-1.5 text-xs font-bold text-[#7251CC]">

          {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`}

        </span>

      </div>

      <h3 className="mt-4 text-lg font-extrabold">{app.company}</h3>

      <p className="mt-1 text-sm text-[#887CA6]">{app.role}</p>

      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#7251CC]">

        <Clock size={16} />

        {dateLabel(app.interviewDate)}

      </div>

      {app.jobLink && (

        <a

          href={app.jobLink}

          target="_blank"

          rel="noreferrer"

          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#7251CC] hover:underline"

        >

          Job posting <ExternalLink size={14} />

        </a>

      )}

      <div className="mt-4 rounded-xl bg-[#FBFAFE] p-3 text-sm text-[#756A91]">

        <p className="font-bold text-[#655780]">Preparation notes</p>

        <p className="mt-1">

          {app.notes || "Add notes to remember what to prepare."}

        </p>

      </div>

    </div>

  );

}

function QuickInsights({ stats }) {

  const conversion = stats.total

    ? Math.round(((stats.interview + stats.offer) / stats.total) * 100)

    : 0;

  return (

    <section className="rounded-2xl border border-[#EAE3FA] bg-white p-5 shadow-sm sm:p-6">

      <SectionHeading

        title="Quick insights"

        subtitle="A little progress adds up"

      />

      <div className="mt-6">

        <div className="flex items-end justify-between">

          <div>

            <p className="text-sm text-[#887CA6]">

              Interview + offer progress

            </p>

            <p className="mt-1 text-3xl font-extrabold">{conversion}%</p>

          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E2F6EC] text-[#24845F]">

            <TrendingUp size={22} />

          </div>

        </div>

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#F0EAFE]">

          <div

            className="h-full rounded-full bg-gradient-to-r from-[#7251CC] to-[#A38AE8] transition-all"

            style={{ width: `${conversion}%` }}

          />

        </div>

        <p className="mt-3 text-xs leading-5 text-[#A69ABF]">

          Based on applications currently at interview or offer stage. This is

          a tracker metric, not a hiring probability.

        </p>

      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">

        <div className="rounded-xl bg-[#FBFAFE] p-3">

          <p className="text-xs text-[#887CA6]">Applied</p>

          <p className="mt-1 text-xl font-extrabold">{stats.applied}</p>

        </div>

        <div className="rounded-xl bg-[#FBFAFE] p-3">

          <p className="text-xs text-[#887CA6]">Interview</p>

          <p className="mt-1 text-xl font-extrabold">{stats.interview}</p>

        </div>

      </div>

    </section>

  );

}

function MetricCard({ icon: Icon, title, value, text }) {

  return (

    <div className="rounded-2xl border border-[#EAE3FA] bg-white p-5 shadow-sm">

      <div className="flex items-center gap-2 text-[#7251CC]">

        <Icon size={18} />

        <p className="text-sm font-bold">{title}</p>

      </div>

      <p className="mt-3 text-3xl font-extrabold">{value}</p>

      <p className="mt-1 text-xs leading-5 text-[#887CA6]">{text}</p>

    </div>

  );

}

function EmptyAnalytics() {

  return (

    <div className="flex h-full flex-col items-center justify-center text-center">

      <ChartNoAxesCombined size={30} className="text-[#B6A5E8]" />

      <p className="mt-3 text-sm font-semibold text-[#655780]">

        No data to chart yet

      </p>

      <p className="mt-1 text-xs text-[#A69ABF]">

        Add applications to see your insights.

      </p>

    </div>

  );

}

function EmptyState({ icon: Icon, title, text, action }) {

  return (

    <div className="rounded-3xl border border-dashed border-[#DCD0F3] bg-white px-6 py-16 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0EAFE] text-[#7251CC]">

        <Icon size={26} />

      </div>

      <h3 className="mt-4 text-lg font-bold">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#887CA6]">

        {text}

      </p>

      <button

        onClick={action}

        className="mt-5 rounded-xl bg-[#7251CC] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#6040B5]"

      >

        Add application

      </button>

    </div>

  );

}


function InlineApplicationForm({ initialData, onSave, onClose }) {
  const [form, setForm] = useState(() => ({
    company: initialData?.company || "",
    role: initialData?.role || "",
    date: initialData?.date || new Date().toISOString().slice(0, 10),
    status: initialData?.status || "Applied",
    jobLink: initialData?.jobLink || "",
    notes: initialData?.notes || "",
    interviewDate: initialData?.interviewDate || "",
  }));

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.company.trim() || !form.role.trim() || !form.date) return;
    onSave({
      ...form,
      company: form.company.trim(),
      role: form.role.trim(),
      jobLink: form.jobLink.trim(),
      notes: form.notes.trim(),
      interviewDate: form.status === "Interview" ? form.interviewDate : "",
    });
  };

  const inputClass = "mt-1.5 w-full rounded-xl border border-[#E5DDF5] bg-white px-3.5 py-2.5 text-sm text-[#30264D] outline-none transition focus:border-[#8B72DE] focus:ring-2 focus:ring-[#8B72DE]/20";
  const labelClass = "block text-sm font-semibold text-[#51436F]";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#21183D]/55 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="application-form-title" className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#EAE3FA] bg-[#FCFBFF] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#EEE8F8] bg-[#FCFBFF] px-6 py-5">
          <div>
            <h2 id="application-form-title" className="text-xl font-extrabold text-[#30264D]">{initialData ? "Edit application" : "Add application"}</h2>
            <p className="mt-1 text-sm text-[#887CA6]">Keep your job search organised.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close form" className="rounded-xl p-2 text-[#887CA6] hover:bg-[#F0EAFE] hover:text-[#30264D]"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label className={labelClass}>Company name *
              <input autoFocus required name="company" value={form.company} onChange={updateField} placeholder="e.g. Infosys" className={inputClass} />
            </label>
            <label className={labelClass}>Job role *
              <input required name="role" value={form.role} onChange={updateField} placeholder="e.g. Java Developer" className={inputClass} />
            </label>
            <label className={labelClass}>Applied date *
              <input required type="date" name="date" value={form.date} onChange={updateField} className={inputClass} />
            </label>
            <label className={labelClass}>Application status *
              <select required name="status" value={form.status} onChange={updateField} className={inputClass}>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </label>
            {form.status === "Interview" && <label className={labelClass}>Interview date
              <input type="date" name="interviewDate" value={form.interviewDate} onChange={updateField} className={inputClass} />
            </label>}
            <label className={labelClass}>Job posting link
              <input type="url" name="jobLink" value={form.jobLink} onChange={updateField} placeholder="https://..." className={inputClass} />
            </label>
          </div>
          <label className={labelClass}>Notes
            <textarea name="notes" rows={3} value={form.notes} onChange={updateField} placeholder="Recruiter details, follow-up reminders, or anything to remember..." className={inputClass + " resize-y"} />
          </label>
          <div className="flex flex-col-reverse gap-3 border-t border-[#EEE8F8] pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-xl border border-[#E5DDF5] px-5 py-2.5 text-sm font-bold text-[#6D5B8C] hover:bg-[#F4F0FC]">Cancel</button>
            <button type="submit" className="rounded-xl bg-[#7251CC] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#6040B5]">{initialData ? "Save changes" : "Save application"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
