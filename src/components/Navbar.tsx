import { logoutAction } from "@/server/auth.actions";
import { LogOut, GraduationCap } from "lucide-react";

interface NavbarProps {
  user: {
    name: string;
    email: string;
    role: "ADMIN" | "FACULTY" | "STUDENT";
    candidateCode?: string;
  };
}

export function Navbar({ user }: NavbarProps) {
  const roleBadgeColor = {
    ADMIN: "bg-purple-100 text-purple-700 border-purple-200",
    FACULTY: "bg-emerald-100 text-emerald-700 border-emerald-200",
    STUDENT: "bg-blue-100 text-blue-700 border-blue-200",
  }[user.role];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm no-print">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              MGCSIILS Cheruvarakonam
            </h1>
            <p className="text-xs text-slate-500">
              University of Kerala Affiliated • Bar Council of India Approved
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-slate-800">{user.name}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 justify-end">
              <span>{user.email}</span>
              {user.candidateCode && (
                <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-medium text-slate-700">
                  {user.candidateCode}
                </span>
              )}
            </div>
          </div>

          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${roleBadgeColor}`}
          >
            {user.role}
          </span>

          <form action={logoutAction}>
            <button
              type="submit"
              title="Sign Out"
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
