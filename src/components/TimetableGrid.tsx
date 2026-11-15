import { Clock, MapPin, User, BookOpen } from "lucide-react";

export interface SlotData {
  id: string;
  dayOfWeek: number; // 1 to 5
  period: number; // 1 to 5
  startTime: string;
  endTime: string;
  course: {
    code: string;
    name: string;
  };
  faculty: {
    user: {
      name: string;
    };
  };
  classroom: {
    code: string;
    name: string;
  };
  section?: {
    name: string;
    semester: number;
    program: {
      code: string;
    };
  };
}

interface Props {
  slots: SlotData[];
  title?: string;
  subtitle?: string;
  showSectionBadge?: boolean;
}

const DAYS = [
  { day: 1, name: "Monday" },
  { day: 2, name: "Tuesday" },
  { day: 3, name: "Wednesday" },
  { day: 4, name: "Thursday" },
  { day: 5, name: "Friday" },
];

const PERIOD_METAS = [
  { period: 1, time: "09:30 - 10:30" },
  { period: 2, time: "10:30 - 11:30" },
  { period: 3, time: "11:45 - 12:45" },
  { period: 4, time: "01:45 - 02:45" },
  { period: 5, time: "02:45 - 03:45" },
];

export function TimetableGrid({ slots, title, subtitle, showSectionBadge }: Props) {
  const getSlot = (day: number, period: number) => {
    return slots.find((s) => s.dayOfWeek === day && s.period === period);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-slate-200">
          {title && <h3 className="text-base font-bold text-slate-900">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-3 font-bold uppercase text-slate-500 w-28 text-center border-r border-slate-200">
                Day / Period
              </th>
              {PERIOD_METAS.map((p) => (
                <th
                  key={p.period}
                  className="p-3 font-bold uppercase text-slate-700 text-center border-r border-slate-200 last:border-r-0 min-w-[160px]"
                >
                  <div>Period {p.period}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{p.time}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {DAYS.map((d) => (
              <tr key={d.day} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-3 text-center font-bold text-slate-800 bg-slate-50/80 border-r border-slate-200">
                  {d.name}
                </td>
                {PERIOD_METAS.map((p) => {
                  const slot = getSlot(d.day, p.period);
                  return (
                    <td
                      key={p.period}
                      className="p-2 border-r border-slate-200 last:border-r-0 align-top"
                    >
                      {slot ? (
                        <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100/80 hover:border-indigo-300 transition-all shadow-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-[11px] text-indigo-700 bg-indigo-100/60 px-1.5 py-0.5 rounded">
                              {slot.course.code}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200/80 flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5 text-indigo-500" />
                              {slot.classroom.code}
                            </span>
                          </div>

                          <div className="font-semibold text-slate-900 text-xs line-clamp-1">
                            {slot.course.name}
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-indigo-100/50">
                            <span className="flex items-center gap-1 font-medium text-slate-700">
                              <User className="w-3 h-3 text-slate-400" />
                              {slot.faculty.user.name}
                            </span>
                            {showSectionBadge && slot.section && (
                              <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-mono font-bold text-slate-800">
                                {slot.section.program.code} S{slot.section.semester}-{slot.section.name}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full min-h-[72px] flex items-center justify-center rounded-lg border border-dashed border-slate-200 text-slate-400 text-[11px] bg-slate-50/30">
                          Break / Prep
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
