import { ReactNode } from "react";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Sidebar />
    <main className="ml-60 p-8 animate-fade-in">{children}</main>
  </div>
);

export default DashboardLayout;
