import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { dashboardApi, articlesApi, type DashboardStats, type ActivityItem, type Article } from "@/lib/api";
import { FileText, CheckCircle, Users, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const barData = [
  { name: "Mon", count: 4 },
  { name: "Tue", count: 6 },
  { name: "Wed", count: 5 },
  { name: "Thu", count: 7 },
  { name: "Fri", count: 9 },
  { name: "Sat", count: 2 },
  { name: "Sun", count: 5 },
];

const pieData = [
  { name: "Published", value: 75 },
  { name: "Drafts", value: 25 },
];

const PIE_COLORS = ["hsl(142 71% 45%)", "hsl(199 89% 48%)"];

const statConfig: Array<{ key: keyof DashboardStats; label: string; icon: typeof FileText; color: string; trend: string; format?: (v: number) => string }> = [
  { key: "totalArticles", label: "Total Articles", icon: FileText, color: "hsl(var(--primary))", trend: "+12%" },
  { key: "published", label: "Published", icon: CheckCircle, color: "hsl(var(--primary))", trend: "+8%" },
  { key: "totalUsers", label: "Total Users", icon: Users, color: "hsl(var(--primary))", trend: "+3" },
  { key: "viewsThisMonth", label: "Views This Month", icon: Eye, color: "hsl(var(--primary))", trend: "+22%", format: (v: number) => `${(v / 1000).toFixed(1)}K` },
];

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);

  useEffect(() => {
    dashboardApi.getStats().then(setStats);
    dashboardApi.getRecentActivity().then(setActivity);
    articlesApi.getAll().then((a) => setRecentArticles(a.slice(0, 5)));
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of your content management system</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statConfig.map(({ key, label, icon: Icon, color, trend, format }) => {
          const raw = stats ? stats[key as keyof DashboardStats] : null;
          const value = raw != null ? (format ? format(raw as number) : raw) : "—";
          return (
            <div key={key} className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <span className="text-xs font-semibold text-success flex items-center gap-0.5">
                  {trend} <span className="text-[10px]">↗</span>
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Articles + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="text-foreground font-semibold mb-4">Recent Articles</h2>
          <div className="space-y-1">
            {recentArticles.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.author} · {a.createdAt}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${a.status === "published" ? "bg-success/20 text-success" : "bg-info/20 text-info"}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="text-foreground font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-1">
            {activity.map((a) => (
              <div key={a.id} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground flex-shrink-0 mt-0.5">
                  {a.user.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{a.user}</span> {a.message}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">⏱ {a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="text-foreground font-semibold mb-4 flex items-center gap-2">📊 Content Activity</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="count" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="text-foreground font-semibold mb-4 flex items-center gap-2">📈 Content Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Legend
                  formatter={(value) => <span style={{ color: "hsl(var(--foreground))", fontSize: 12 }}>{value}</span>}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
