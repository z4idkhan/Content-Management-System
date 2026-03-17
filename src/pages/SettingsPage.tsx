import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { settingsApi, type SiteSettings } from "@/lib/api";
import { Save } from "lucide-react";
import { toast } from "sonner";

const SettingsPage = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { settingsApi.get().then(setSettings); }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await settingsApi.update(settings);
    toast.success("Settings saved");
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (!currentPw || !newPw) { toast.error("Fill in both fields"); return; }
    if (newPw.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    await settingsApi.changePassword(currentPw, newPw);
    setCurrentPw("");
    setNewPw("");
    toast.success("Password updated");
  };

  if (!settings) return <DashboardLayout><div className="text-muted-foreground">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm">Configure your CMS platform</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-gold-hover transition-colors disabled:opacity-50">
          <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-foreground font-semibold mb-4 flex items-center gap-2">⚙️ General</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Site Name</label>
              <input value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Site URL</label>
              <input value={settings.siteUrl} onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-foreground font-semibold mb-4 flex items-center gap-2">🔔 Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive email alerts for important events</p>
              </div>
              <button onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.emailNotifications ? "bg-primary" : "bg-secondary"}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${settings.emailNotifications ? "left-5" : "left-0.5"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Activity Alerts</p>
                <p className="text-xs text-muted-foreground">Get notified when content is published or edited</p>
              </div>
              <button onClick={() => setSettings({ ...settings, activityAlerts: !settings.activityAlerts })}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.activityAlerts ? "bg-primary" : "bg-secondary"}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${settings.activityAlerts ? "left-5" : "left-0.5"}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-foreground font-semibold mb-4 flex items-center gap-2">🔒 Security</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <button onClick={() => setSettings({ ...settings, twoFactor: !settings.twoFactor })}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.twoFactor ? "bg-primary" : "bg-secondary"}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${settings.twoFactor ? "left-5" : "left-0.5"}`} />
              </button>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-2">Change Password</p>
              <div className="flex gap-2">
                <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="Current password"
                  className="flex-1 px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="New password"
                  className="flex-1 px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <button onClick={handleChangePassword} className="px-4 py-2 rounded-md bg-secondary text-foreground text-sm font-medium hover:bg-muted transition-colors">Update</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
