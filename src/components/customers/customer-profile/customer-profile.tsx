'use client';
import { useState } from "react";
import type { ReactNode } from "react";

import { type Customer, type CustomerAddress, type CustomerStatus } from "@/utils/types/customer.type";

import { LuIdCard } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdMale } from "react-icons/io";
import { IoMdFemale } from "react-icons/io";
import { IoMaleFemaleSharp } from "react-icons/io5";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { RiContactsBookLine } from "react-icons/ri";
import { IoMailOutline } from "react-icons/io5";
import { FiPhone  } from "react-icons/fi";
import { CiMap } from "react-icons/ci";
import { TbCalendarPlus } from "react-icons/tb";
import { GrUpdate } from "react-icons/gr";
import { LuShieldCheck } from "react-icons/lu";
import { HiStatusOnline } from "react-icons/hi";
import { IoMdTime } from "react-icons/io";
import { FaRegBell } from "react-icons/fa6";
import { MdContentCopy } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";

import { notFound } from "next/navigation";

/** Props for the main page component. */
export interface CustomerProfileProps {
  /** Customer to display. Falls back to sample data when omitted. */
  customer?: Customer;
}


/** Tailwind classes + label used to render a status badge. */
interface StatusStyle {
  text: string;
  /** Badge background / text / ring classes. */
  cls: string;
  /** Colour of the small dot inside the badge. */
  dot: string;
}

/* ==========================================================================
 * Helpers
 * ========================================================================== */

/** Uppercases the first letter ("customer" -> "Customer"). Returns "—" for empty values. */
const capitalize = (s?: string): string =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "—";

/** Visual style for each account status. */
const STATUS: Record<CustomerStatus, StatusStyle> = {
  active: { text: "Active", cls: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", dot: "bg-emerald-500" },
  pending: { text: "Pending", cls: "bg-slate-100 text-slate-600 ring-slate-500/20", dot: "bg-slate-400" },
  blocked: { text: "Blocked", cls: "bg-rose-50 text-rose-700 ring-rose-600/20", dot: "bg-rose-500" },
};

/**
 * Formats an ISO date string for display, e.g. "February 20, 1989".
 * Pass `withTime = true` to include hours and minutes.
 * Returns "—" if the value is missing or invalid.
 */
const fmtDate = (v?: string, withTime = false): string => {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...(withTime && { hour: "2-digit", minute: "2-digit" }),
  }).format(d);
};

/**
 * Calculates age in full years from a birth date.
 * Returns null if the date is missing or invalid.
 */
const calcAge = (v?: string): number | null => {
  if (!v) return null;
  const b = new Date(v);
  if (isNaN(b.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  // Subtract one year if the birthday hasn't happened yet this year
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
};
/* ==========================================================================
 * Small reusable components
 * ========================================================================== */

/** Button that copies `value` to the clipboard and briefly shows a check mark. */
function CopyButton({ value }: { value: string }) {
  // True for 1.5s after a successful copy, to show feedback
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {
      // Clipboard may be unavailable (e.g. insecure context) — fail silently
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy"
      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      {done ? <FaCheck size={18} className="text-emerald-600" /> : <MdContentCopy size={18} />}
    </button>
  );
}

interface InfoRowProps {
  /** Icon shown in the rounded tile on the left. */
  icon: ReactNode;
  label: string;
  /** Plain text value. Ignored when `children` is provided. */
  value?: string;
  /** Shows a copy button next to the value. */
  copyable?: boolean;
  /** Custom content (e.g. a badge) used instead of `value`. */
  children?: ReactNode;
}

/** One "icon + label + value" row used inside cards. */
function InfoRow({ icon, label, value, copyable = false, children }: InfoRowProps) {
  return (
    <div className="flex items-center gap-1 py-3.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        {children ?? (
          <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">{value || "—"}</p>
        )}
      </div>
      {copyable && value ? <CopyButton value={value} /> : null}
    </div>
  );
}

interface CardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

/** White rounded section container with an icon + title header. */
function Card({ title, icon, children, className = "" }: CardProps) {
  return (
    <section className={`rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 ${className}`}>
      <div className="mb-2 flex items-center gap-2.5">
        <span className="text-indigo-600">{icon}</span>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

interface BadgeProps {
  children: ReactNode;
  /** Colour classes (background, text, ring). */
  className?: string;
}

/** Small pill used for role, status and consent labels. */
function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${className}`}>
      {children}
    </span>
  );
}

interface AddressCardProps {
  address: CustomerAddress;
  /** Position in the sorted list; used to build a fallback title. */
  index: number;
}

/** Displays one address. The default address gets a highlighted border and badge. */
function AddressCard({ address, index }: AddressCardProps) {
  const isDefault = !!address.isDefault;
  // `label` is optional, so fall back to "Address 1", "Address 2", ...
  const title = address.label || `Address ${index + 1}`;
  // City, state and postal code joined on a single line
  const line2 = [address.city, address.state, address.postalCode].filter(Boolean).join(", ");

  const fields: [string, string|undefined][] = [
    ["City", address.city],
    ["State / Region", address.state],
    ["Postal code", address.postalCode],
    ["Country", address.country],
  ];

  return (
    <div
      className={`rounded-xl p-4 transition ${
        isDefault
          ? "bg-indigo-50/60 ring-2 ring-indigo-500"
          : "bg-slate-50 ring-1 ring-slate-200 hover:ring-slate-300"
      }`}
    >
      {/* Title row + "Default" badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <FiMapPin size={20} className={`${isDefault ? "text-indigo-600" : "text-slate-400"}`} />
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        </div>
        {isDefault && (
          <Badge className="bg-indigo-600 text-white ring-indigo-600">
            <FaRegStar size={15} />
            Default address
          </Badge>
        )}
      </div>

      {/* Human-readable address summary */}
      <div className="mt-3 space-y-1 text-sm">
        <p className="font-medium text-slate-800">{address.address}</p>
        {line2 && <p className="text-slate-600">{line2}</p>}
        {address.country && <p className="text-slate-600">{address.country}</p>}
      </div>

      {/* Address broken down into individual fields */}
      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-200/70 pt-3 text-xs sm:grid-cols-4">
        {fields.map(([k, v]) => (
          <div key={k}>
            <p className="text-slate-500">{k}</p>
            <p className="mt-0.5 font-semibold text-slate-800">{v || "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
 * Main page
 * ========================================================================== */

export default function CustomerProfile({ customer }: CustomerProfileProps) {
  // Set to true if the avatar fails to load, so we can show initials instead
  const [imgError, setImgError] = useState(false);
  
  if(!customer){
    notFound();
  }
  // Derived display values
  const fullName = `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim();
  const initials = `${customer.firstName?.[0] ?? ""}${customer.lastName?.[0] ?? ""}`.toUpperCase();
  // Unknown statuses fall back to the neutral "inactive" style
  const status = STATUS[customer.status] ?? STATUS.blocked;
  const age = calcAge(customer.birthDate);

  // Sort so the default address comes first, then the rest in original order
  const addresses: CustomerAddress[] = [...(customer.addresses ?? [])].sort(
    (a, b) => Number(!!b.isDefault) - Number(!!a.isDefault)
  );

  return (
    <div dir="ltr" className="min-h-screen bg-slate-100 px-4 py-8 font-sans text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* ---------- Header: cover, avatar, name, badges ---------- */}
        <header className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          {/* Gradient cover */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 sm:h-40" />
          <div className="px-6 pb-6 sm:px-8">
            {/* Negative margin pulls the avatar up over the cover */}
            <div className="-mt-14 flex flex-col items-center gap-4 sm:-mt-16 sm:flex-row sm:items-end">
              {/* Avatar: image, or initials if missing / failed to load */}
              {imgError || !customer.image ? (
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-3xl font-bold text-indigo-700 shadow-lg ring-4 ring-white sm:h-32 sm:w-32">
                  {initials || <FaRegUser className="h-12 w-12" />}
                </div>
              ) : (
                <img
                  src={customer.image}
                  alt={fullName}
                  onError={() => setImgError(true)}
                  className="h-28 w-28 shrink-0 rounded-2xl bg-white object-cover shadow-lg ring-4 ring-white sm:h-32 sm:w-32"
                />
              )}

              {/* Name and email */}
              <div className="min-w-0 flex-1 text-center sm:pb-2 sm:text-left">
                <h1 className="truncate text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {fullName || "—"}
                </h1>
                <p className="mt-1 truncate text-sm text-slate-500">{customer.email}</p>
              </div>

              {/* Role and status badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:pb-2">
                <Badge className="bg-indigo-50 text-indigo-700 ring-indigo-600/20">
                  <LuShieldCheck size={15} />
                  {capitalize(customer.role)}
                </Badge>
                <Badge className={status.cls}>
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                  {status.text}
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Two-column layout on large screens: main content + sidebar */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ---------- Main column ---------- */}
          <div className="min-w-0 space-y-6 lg:col-span-2">
            {/* Personal details */}
            <Card title="Personal Information" icon={<FaRegUser size={20}/>}>
              <div className="divide-y divide-slate-100">
                <InfoRow icon={<LuIdCard size={20}/>} label="Full name" value={fullName} />
                <InfoRow 
                icon={
                  customer.gender === 'male'? <IoMdMale size={20} /> 
                  : customer.gender === 'female'?<IoMdFemale size={20} /> 
                  : <IoMaleFemaleSharp size={20} />} label="Gender" value={capitalize(customer.gender)} />
                <InfoRow
                  icon={<LiaBirthdayCakeSolid size={20} />}
                  label="Date of birth"
                  value={age != null ? `${fmtDate(customer.birthDate)} (${age} years old)` : fmtDate(customer.birthDate)}
                />
              </div>
            </Card>

            {/* Email and phone, both copyable */}
            <Card title="Contact Information" icon={<RiContactsBookLine size={20} />}>
              <div className="divide-y divide-slate-100">
                <InfoRow icon={<IoMailOutline size={20} />} label="Email" value={customer.email} copyable />
                <InfoRow icon={<FiPhone size={20} />} label="Phone" value={customer.phone} copyable />
              </div>
            </Card>

            {/* All addresses; the default one is listed first and highlighted */}
            <Card title={`Addresses (${addresses.length})`} icon={<CiMap size={20} />}>
              {addresses.length === 0 ? (
                // Empty state
                <p className="mt-3 rounded-xl bg-slate-50 py-8 text-center text-sm text-slate-500">
                  No addresses on file
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {addresses.map((a, i) => (
                    <AddressCard key={a.id ?? i} address={a} index={i} />
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* ---------- Sidebar ---------- */}
          <aside className="min-w-0 space-y-6">
            {/* Account details */}
            <Card title="Account" icon={<FaRegUserCircle size={20} />}>
              <div className="divide-y divide-slate-100">
                <InfoRow icon={<LuIdCard size={20} />} label="User ID" value={customer.id} copyable />
                <InfoRow icon={<LuShieldCheck size={20} />} label="Role" value={capitalize(customer.role)} />
                <InfoRow icon={<HiStatusOnline size={20} />} label="Status">
                  <div className="mt-1">
                    <Badge className={status.cls}>
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                      {status.text}
                    </Badge>
                  </div>
                </InfoRow>
                <InfoRow icon={<FaRegBell size={20} />} label="Marketing consent">
                  <div className="mt-1">
                    <Badge
                      className={
                        customer.marketingConsent
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                          : "bg-slate-100 text-slate-600 ring-slate-500/20"
                      }
                    >
                      {customer.marketingConsent ? "Opted in" : "Not opted in"}
                    </Badge>
                  </div>
                </InfoRow>
              </div>
            </Card>

            {/* Creation and last-update timestamps */}
            <Card title="Timeline" icon={<IoMdTime size={20}/>}>
              <div className="divide-y divide-slate-100">
                <InfoRow icon={<TbCalendarPlus size={20} />} label="Created at" value={fmtDate(customer.createdAt, true)} />
                <InfoRow icon={<GrUpdate  size={17} />} label="Last updated" value={fmtDate(customer.updatedAt, true)} />
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}