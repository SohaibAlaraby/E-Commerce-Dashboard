import KpiCard from './kpi-card';

import {getCustomersKpis, type CustomerKpis } from "@/utils/supabase/services/customers.service"
//icons
import { FiUsers } from "react-icons/fi";
import { FiUserPlus } from "react-icons/fi";
import { IoMdPulse } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";
import { FaArrowTrendUp } from "react-icons/fa6";

const neutralChip =
  "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600";



export default async function KpiCards() {
    const kpis:CustomerKpis = await getCustomersKpis();

    //can't be negative
    if(kpis.newCustomersLastMonth < 0) kpis.newCustomersLastMonth=0;
    if(kpis.newCustomersThisMonth < 0) kpis.newCustomersThisMonth=0;

    const customersGrowth:string = kpis.newCustomersLastMonth > 0 ? `${((kpis.newCustomersThisMonth-kpis.newCustomersLastMonth)/kpis.newCustomersLastMonth)*100} %`: `${kpis.newCustomersThisMonth} customers`;

    const activeCustomersPercentage =kpis.totalCustomersCount > 0? Math.round ((kpis.activeCustomers/kpis.totalCustomersCount)*100) : 0;
    const averageLTV = Math.round(kpis.averageLTV);
  return (
        <section
          aria-label="Customer KPI cards"
          className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4 md:gap-5"
        >
          <KpiCard
          title="Total Customers"
          value={String(kpis.totalCustomersCount)}
          icon={<FiUsers size={20}/>}
          definition= "All registered accounts since launch, excluding deleted and disabled accounts."
          >
            <span className={neutralChip}>
              Excludes blocked &amp; pended
            </span>
          </KpiCard>

          <KpiCard
          title="New Customers"
          value={String(kpis.newCustomersThisMonth)}
          icon={<FiUserPlus size={20} />}
          definition= "Customers who created an account this month compared with the same period last month, for a fair like-for-like comparison."
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
              <FaArrowTrendUp />
              {customersGrowth}
            </span>
            <span className="text-xs text-slate-500">
              vs <strong className="font-semibold text-slate-900">{kpis.newCustomersLastMonth}</strong> in the
              same period last month
            </span>
          </KpiCard>

          <KpiCard
          title="Active Customers"
          value={String(kpis.activeCustomers)}
          icon={<IoMdPulse size={20}/>}
          
          definition="Customers with at least one order in the last 6 months."
          >
            <span className="rounded-full border border-[#0E6E78]/30 bg-[#0E6E78]/10 px-2.5 py-1 text-xs font-semibold text-slate-900">
              Last 6 Months
            </span>
            <span className="text-xs text-slate-500">
              <strong className="font-semibold text-slate-900">{activeCustomersPercentage}%</strong> of all
              customers
            </span>
          </KpiCard>

          <KpiCard
          title="Average LTV"
          value={String(averageLTV)}
          valueSuffix="USD"
          icon={<MdAttachMoney size={20}/>}
          definition="Total revenue from completed and paid orders ÷ customers who made at least one purchase (not total accounts)."
          >
            <span className="text-xs text-slate-500">
              Total Order Costs in USD
              ÷ Total number of purchasing customers
              
          </span>
          </KpiCard>
        </section>
  );
}