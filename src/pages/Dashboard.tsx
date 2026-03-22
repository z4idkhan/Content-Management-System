import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  dashboardApi,
  articlesApi,
  type DashboardStats,
  type ActivityItem,
  type Article,
} from "@/lib/api";

import { FileText, CheckCircle, Users, Eye } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// =========================
// STATIC DATA
// =========================
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

const statConfig = [
  { key: "totalArticles", label: "Total Articles", icon: FileText },
  { key: "published", label: "Published", icon: CheckCircle },
  { key: "totalUsers", label: "Total Users", icon: Users },
  { key: "viewsThisMonth", label: "Views This Month", icon: Eye },
] as const;

// =========================
// COMPONENT
// =========================
const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH (FIXED)
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [statsData, activityData, articlesRes] =
          await Promise.all([
            dashboardApi.getStats(),
            dashboardApi.getRecentActivity(),
            articlesApi.getAll(),
          ]);

        // ✅ FIX 1: normalize articles response
        const articles: Article[] = Array.isArray(articlesRes)
          ? articlesRes
          : (articlesRes as any)?.data ||
            (articlesRes as any)?.articles ||
            [];

        setStats(statsData || null);
        setActivity(Array.isArray(activityData) ? activityData : []);
        setRecentArticles(articles.slice(0, 5)); // ✅ SAFE NOW
      } catch (err) {
        console.error("Dashboard error:", err);
        setRecentArticles([]); // ✅ prevent crash
        setActivity([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-muted-foreground">
          Loading dashboard...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Overview of your CMS
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statConfig.map(({ key, label, icon: Icon }) => {
          const value = stats?.[key] ?? "—";

          return (
            <div key={key} className="border rounded-lg p-5">
              <Icon size={20} />
              <p className="text-xl font-bold mt-2">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          );
        })}
      </div>

      {/* RECENT + ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* ARTICLES */}
        <div className="border rounded-lg p-5">
          <h2 className="font-semibold mb-4">Recent Articles</h2>

          {recentArticles.length > 0 ? (
            recentArticles.map((a) => (
              <div key={a.id} className="mb-2">
                <p className="font-medium">{a.title}</p>
                <p className="text-xs text-gray-500">
                  {a.author} · {a.createdAt}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No articles found
            </p>
          )}
        </div>

        {/* ACTIVITY */}
        <div className="border rounded-lg p-5">
          <h2 className="font-semibold mb-4">Recent Activity</h2>

          {activity.length > 0 ? (
            activity.map((a) => (
              <div key={a.id} className="mb-2">
                <p>
                  <strong>{a.user}</strong> {a.message}
                </p>
                <p className="text-xs text-gray-500">{a.time}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No activity found
            </p>
          )}
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BAR */}
        <div className="border rounded-lg p-5">
          <h2 className="mb-4">Content Activity</h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div className="border rounded-lg p-5">
          <h2 className="mb-4">Content Status</h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={90}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;