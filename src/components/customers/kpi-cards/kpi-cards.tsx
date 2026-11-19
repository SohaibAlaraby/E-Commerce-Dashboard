import type { ReactNode } from "react";


type Kpi = {
  id: string;
  title: string;
  value: string;
  valueSuffix?: string;
  icon: ReactNode;
  meta: ReactNode;
  definition: string;
};

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const UsersIcon = () => (
  <svg {...iconProps}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const UserPlusIcon = () => (
  <svg {...iconProps}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M19 8v6M22 11h-6" />
  </svg>
);

const ActivityIcon = () => (
  <svg {...iconProps}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const CoinIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M14.5 9.5a2.5 2 0 0 0-2.5-1.5c-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2a2.5 2 0 0 1-2.5-1.5M12 6v2M12 16v2" />
  </svg>
);

const ArrowUpRightIcon = () => (
  <svg
    width={12}
    height={12}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

const neutralChip =
  "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600";

const KPIS: Kpi[] = [
  {
    id: "total-customers",
    title: "Total Customers",
    value: "12,480",
    icon: <UsersIcon />,
    meta: <span className={neutralChip}>Excludes deleted &amp; disabled</span>,
    definition:
      "All registered accounts since launch, excluding deleted and disabled accounts.",
  },
  {
    id: "new-customers",
    title: "New Customers",
    value: "342",
    icon: <UserPlusIcon />,
    meta: (
      <>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
          <ArrowUpRightIcon />
          +14.8%
        </span>
        <span className="text-xs text-slate-500">
          vs <strong className="font-semibold text-slate-900">298</strong> in the
          same period last month
        </span>
      </>
    ),
    definition:
      "Customers who created an account this month (Nov 1–19) compared with the same period last month (Oct 1–19), for a fair like-for-like comparison.",
  },
  {
    id: "active-customers",
    title: "Active Customers",
    value: "3,917",
    icon: <ActivityIcon />,
    meta: (
      <>
        <span className="rounded-full border border-[#0E6E78]/30 bg-[#0E6E78]/10 px-2.5 py-1 text-xs font-semibold text-slate-900">
          Last 30 days
        </span>
        <span className="text-xs text-slate-500">
          <strong className="font-semibold text-slate-900">31.4%</strong> of all
          customers
        </span>
      </>
    ),
    definition:
      "Customers with at least one order in the last 30 days (Oct 21 – Nov 19).",
  },
  {
    id: "average-ltv",
    title: "Average LTV",
    value: "1,500",
    valueSuffix: "EGP",
    icon: <CoinIcon />,
    meta: (
      <span className="text-xs text-slate-500">
        <strong className="font-semibold text-slate-900">6,840,000</strong> EGP
        ÷ <strong className="font-semibold text-slate-900">4,560</strong>{" "}
        purchasing customers
      </span>
    ),
    definition:
      "Total revenue from completed and paid orders ÷ customers who made at least one purchase (not total accounts).",
  },
];

export default function KpiCards() {
  return (
    <div className="min-h-screen bg-slate-100 px-4 pb-12 pt-8 font-sans text-slate-900 md:px-8 md:pt-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-7">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-bold leading-tight">
              Customer Metrics
            </h1>
            <p className="text-sm text-slate-500">
              Updated as of Nov 19, 2026 · Each card states its definition and
              time window
            </p>
          </div>
          <span className="rounded-full bg-slate-200 px-3 py-1.5 text-xs text-slate-600">
            Sample data
          </span>
        </header>

        <section
          aria-label="Customer KPI cards"
          className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 md:grid-cols-[repeat(4,minmax(0,1fr))] md:gap-5"
        >
          {KPIS.map((kpi) => (
            <article
              key={kpi.id}
              className="flex min-w-0 flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:gap-5 md:p-6"
            >
              <div className="flex items-start justify-between gap-2 md:gap-3">
                <h2 className="text-sm font-semibold leading-5 md:text-base md:leading-6">
                  {kpi.title}
                </h2>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0E6E78]/10 text-[#0E6E78] md:h-11 md:w-11">
                  {kpi.icon}
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold leading-none tabular-nums md:text-[40px]">
                    {kpi.value}
                  </span>
                  {kpi.valueSuffix && (
                    <span className="text-sm font-semibold text-slate-500 md:text-base">
                      {kpi.valueSuffix}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {kpi.meta}
                </div>
              </div>

              <div className="flex flex-col gap-1 border-t border-slate-100 pt-4">
                <span className="text-xs font-semibold text-slate-600">
                  Definition
                </span>
                <p className="text-[13px] leading-relaxed text-slate-500">
                  {kpi.definition}
                </p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}