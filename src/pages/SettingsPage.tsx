import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { settingsApi, type SiteSettings } from "@/lib/api";
import { Save } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const articlesApi = {
  getAll: async () => {
    const res = await api.get("/articles");
    return res.data; // ✅ IMPORTANT
  },

  create: async (data: any) => {
    const res = await api.post("/articles", data);
    return res.data;
  },
};

const SettingsPage = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [saving, setSaving] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  // =========================
  // LOAD SETTINGS (FIXED)
  // =========================
  useEffect(() => {
    const load = async () => {
      try {
        const data = await settingsApi.get();
        setSettings(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load settings");
      }
    };

    load();
  }, []);

  // =========================
  // SAVE SETTINGS (FIXED)
  // =========================
  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      await settingsApi.update(settings);
      toast.success("Settings saved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // CHANGE PASSWORD (FIXED)
  // =========================
  const handleChangePassword = async () => {
    if (!currentPw.trim() || !newPw.trim()) {
      toast.error("Fill in both fields");
      return;
    }

    if (newPw.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setPwLoading(true);

      await settingsApi.changePassword(currentPw.trim(), newPw.trim());

      setCurrentPw("");
      setNewPw("");

      toast.success("Password updated");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update password"
      );
    } finally {
      setPwLoading(false);
    }
  };

  // =========================
  // LOADING STATE
  // =========================
  if (!settings) {
    return (
      <DashboardLayout>
        <div className="text-muted-foreground">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm">
            Configure your CMS platform
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* GENERAL */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-semibold mb-4">⚙️ General</h2>

          <input
            value={settings.siteName}
            onChange={(e) =>
              setSettings((prev) =>
                prev ? { ...prev, siteName: e.target.value } : prev
              )
            }
            placeholder="Site Name"
            className="w-full mb-3 px-3 py-2 border rounded-md"
          />

          <input
            value={settings.siteUrl}
            onChange={(e) =>
              setSettings((prev) =>
                prev ? { ...prev, siteUrl: e.target.value } : prev
              )
            }
            placeholder="Site URL"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* NOTIFICATIONS */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-semibold mb-4">🔔 Notifications</h2>

          <button
            onClick={() =>
              setSettings((prev) =>
                prev
                  ? { ...prev, emailNotifications: !prev.emailNotifications }
                  : prev
              )
            }
            className="mb-3"
          >
            Email Notifications: {settings.emailNotifications ? "ON" : "OFF"}
          </button>

          <button
            onClick={() =>
              setSettings((prev) =>
                prev
                  ? { ...prev, activityAlerts: !prev.activityAlerts }
                  : prev
              )
            }
          >
            Activity Alerts: {settings.activityAlerts ? "ON" : "OFF"}
          </button>
        </div>

        {/* SECURITY */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-semibold mb-4">🔒 Security</h2>

          <button
            onClick={() =>
              setSettings((prev) =>
                prev ? { ...prev, twoFactor: !prev.twoFactor } : prev
              )
            }
            className="mb-4"
          >
            Two Factor: {settings.twoFactor ? "ON" : "OFF"}
          </button>

          <div className="flex gap-2">
            <input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="Current password"
              className="flex-1 px-3 py-2 border rounded-md"
            />

            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="New password"
              className="flex-1 px-3 py-2 border rounded-md"
            />

            <button
              onClick={handleChangePassword}
              disabled={pwLoading}
              className="px-4 py-2 bg-secondary rounded-md"
            >
              {pwLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;