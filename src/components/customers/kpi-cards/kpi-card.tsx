import { type ReactNode } from "react";

type Kpi = {
  id?: string;
  title: string;
  value: string;
  valueSuffix?: string;
  icon: ReactNode;
  children: ReactNode;
  definition: string;
};



export default function KpiCard({title, value, valueSuffix, icon,definition, children} : Kpi ){
    return(
        <article
            // key={kpi.id}
            className="flex min-w-0 flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4"
        >
            <div className="flex items-start justify-between gap-2 md:gap-3">
            <h2 className="text-sm font-semibold leading-5 md:text-base md:leading-6">
                {title}
            </h2>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0E6E78]/10 text-[#0E6E78] md:h-11 md:w-11">
                {icon}
            </div>
            </div>

            <div className="flex flex-col gap-2.5">
            <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold leading-none tabular-nums ">
                {value}
                </span>
                {valueSuffix && (
                <span className="text-sm font-semibold text-slate-500 md:text-base">
                    {valueSuffix}
                </span>
                )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
                {children}
            </div>
            </div>

            <div className="flex flex-col gap-1 border-t border-slate-100 pt-4">
            <span className="text-xs font-semibold text-slate-600">
                Definition
            </span>
            <p className="text-[13px] leading-relaxed text-slate-500">
                {definition}
            </p>
            </div>
        </article>
    );
}