// scripts/upload-customers.ts
//
// بيرفع العملاء من ملف الـ mock الموجود عندك (src/mock/Customers) على Supabase.
//
// تشغيل:
//   npm i -D tsx
//   npx tsx --env-file=.env.local scripts/upload-customers.ts
//
// .env.local لازم يحتوي على:
//   NEXT_PUBLIC_SUPABASE_URL=...
//   SUPABASE_SERVICE_ROLE_KEY=...   (بدون NEXT_PUBLIC_، ومايتحطش في الـ repo)

import { createClient } from "@supabase/supabase-js";
import { Customers } from "@/mock/Customers"; // لو الـ alias ماشتغلش: "../src/mock/Customers"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// بيقسم أي array لدفعات صغيرة
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// "1996-5-30" -> "1996-05-30"
function normalizeDate(value?: string): string | null {
  if (!value) return null;
  const [y, m, d] = value.split("-");
  if (!y || !m || !d) return null;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

async function main() {
  console.log(`Uploading ${Customers.length} customers...`);

  // 1) العملاء: upsert بالإيميل، فتقدر تشغّله أكتر من مرة من غير تكرار
  //    الـ id الرقمي القديم مش بيترفع، الـ database بتولّد UUID جديد
  const customerRows = Customers.map((c) => ({
    first_name: c.firstName,
    last_name: c.lastName,
    gender: c.gender ?? "unspecified",
    email: c.email,
    image_url: c.image ?? null,
    phone: c.phone ?? null,
    birth_date: normalizeDate(c.birthDate),
    role: c.role,
    status: c.status,
    created_at: c.createdAt,
  }));

  const idByEmail = new Map<string, string>();

  for (const part of chunk(customerRows, 200)) {
    const { data, error } = await supabase
      .from("customers")
      .upsert(part, { onConflict: "email" })
      .select("id, email");

    if (error) throw error;
    data.forEach((r) => idByEmail.set(String(r.email).toLowerCase(), r.id));
  }
  console.log(`Customers upserted: ${idByEmail.size}`);

  // 2) العناوين: امسح عناوين العملاء دول وأدخلهم من جديد
  const ids = [...idByEmail.values()];

  for (const part of chunk(ids, 200)) {
    const { error } = await supabase
      .from("customer_addresses")
      .delete()
      .in("customer_id", part);
    if (error) throw error;
  }

  const addressRows = Customers.flatMap((c) =>
    c.addresses.map((a) => ({
      customer_id: idByEmail.get(c.email.toLowerCase())!,
      address: a.address,
      city: a.city,
      state: a.state,
      postal_code: a.postalCode ?? null,
      country: a.country,
      is_default: a.isDefault,
    }))
  );

  for (const part of chunk(addressRows, 200)) {
    const { error } = await supabase.from("customer_addresses").insert(part);
    if (error) throw error;
  }
  console.log(`Addresses inserted: ${addressRows.length}`);
}

main()
  .then(() => console.log("Done"))
  .catch((err) => {
    console.error("Upload failed:", err);
    process.exit(1);
  });