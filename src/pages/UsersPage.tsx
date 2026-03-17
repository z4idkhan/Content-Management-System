import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { usersApi, type User } from "@/lib/api";
import { Search, Trash2, Shield, Edit } from "lucide-react";
import { toast } from "sonner";

const roleBadge = (role: User["role"]) => {
  const styles: Record<string, string> = {
    admin: "bg-primary/20 text-primary",
    editor: "bg-info/20 text-info",
    viewer: "bg-secondary text-muted-foreground",
  };
  return styles[role] || styles.viewer;
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => { usersApi.getAll().then(setUsers); }, []);

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const handleRoleChange = async (id: string, role: User["role"]) => {
    const updated = await usersApi.updateRole(id, role);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    toast.success("Role updated");
  };

  const handleToggleStatus = async (id: string) => {
    const updated = await usersApi.toggleStatus(id);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    toast.success("Status updated");
  };

  const handleDelete = async (id: string) => {
    await usersApi.delete(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("User deleted");
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground text-sm">Manage user accounts and permissions</p>
      </div>

      <div className="relative max-w-sm mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
          className="w-full pl-9 pr-4 py-2 rounded-md bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((u) => (
          <div key={u.id} className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold text-sm">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleToggleStatus(u.id)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground" title="Toggle status">
                  <Shield size={13} />
                </button>
                <button onClick={() => handleDelete(u.id)} className="p-1.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full font-medium uppercase ${roleBadge(u.role)}`}>{u.role}</span>
              <span className={`text-xs font-medium ${u.status === "active" ? "text-success" : "text-muted-foreground"}`}>{u.status}</span>
            </div>

            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Joined {u.joinedAt}</p>
              <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value as User["role"])}
                className="text-xs bg-secondary border border-border rounded px-2 py-1 text-foreground focus:outline-none">
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-muted-foreground text-sm mt-8">No users found</p>}
    </DashboardLayout>
  );
};

export default UsersPage;
