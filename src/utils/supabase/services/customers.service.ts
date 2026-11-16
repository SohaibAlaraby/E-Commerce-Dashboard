
// src/features/customers/services/customers.service.ts
//
// =====================================================================
// طبقة الـ Service الخاصة بالعملاء (Customers Service Layer)
// =====================================================================
//
// ما هو دور هذا الملف؟
//   هذا هو المكان الوحيد في المشروع الذي يتكلم مباشرة مع جدولي
//   `customers` و `customer_addresses` في Supabase.
//   باقي المشروع (الصفحات، الـ components، الـ Server Actions) لا يكتب
//   استعلامات Supabase بنفسه، بل ينادي الدوال المصدّرة من هنا.
//
// لماذا نفصله في ملف مستقل؟
//   1) مكان واحد للتعديل: لو غيّرت اسم عمود أو غيّرت قاعدة البيانات
//      مستقبلاً، تعدّل هذا الملف فقط.
//   2) الـ UI يتعامل مع أسماء camelCase (firstName) بينما قاعدة البيانات
//      تستخدم snake_case (first_name)، والتحويل بينهما يتم هنا.
//   3) سهولة الاختبار وإعادة الاستخدام في أكثر من صفحة.
//
// أين يُستخدم؟
//   في الـ Server Components والـ Server Actions فقط (لأنه يستخدم
//   الـ server client الذي يقرأ الـ cookies). لا تستورده داخل ملف
//   فيه "use client".
//
// الأمان (مهم):
//   الـ Row Level Security (RLS) في Supabase هي التي تحدد مَن يقرأ ومَن
//   يعدّل. فمثلاً الدوال هنا ترجع صفوفاً فارغة إن لم يكن المستخدم
//   الحالي أدمن، وهذا سلوك صحيح وليس خطأ. لا تعتمد على هذا الملف
//   وحده كحماية، فالحماية الحقيقية في الـ database.
// =====================================================================

import { createClient } from "@/utils/supabase/server";
// =====================================================================
// 1) الأنواع (Types)
// =====================================================================
// هذه الأنواع هي "الشكل" الذي يراه باقي التطبيق للبيانات (camelCase).
// وهي تطابق الـ enums التي أنشأناها في SQL:
//   gender_type, customer_role, customer_status


export type Gender = "male" | "female" | "unspecified";
export type CustomerRole = "admin" | "customer";

// pending = سجّل ولم يفعّل حسابه بعد
// active  = حساب يعمل بشكل طبيعي
// blocked = موقوف بقرار من الأدمن (لا يستطيع الشراء)
export type CustomerStatus = "active" | "blocked" | "pending";

import { CustomerAddress, Customer, NewCustomerInput } from "@/utils/types/customer.type";

// بيانات التعديل: كل الحقول اختيارية (نعدّل ما نرسله فقط)،
// والعناوين لها دوال مستقلة بالأسفل.
export type UpdateCustomerInput = Partial<Omit<NewCustomerInput, "addresses">>;

// خيارات البحث والفلترة في getCustomers.
export type CustomerFilters = {
  status?: CustomerStatus; // مثال: عرض المحظورين فقط
  search?: string; // بحث نصي في الاسم الأول/الأخير/الإيميل
  includeDeleted?: boolean; // هل نُظهر العملاء المحذوفين حذفاً ناعماً؟
  limit?: number; // عدد الصفوف في الصفحة الواحدة (pagination)
  offset?: number; // من أي صف نبدأ
};

// =====================================================================
// 2) أنواع الصفوف كما تأتي من قاعدة البيانات (snake_case)
// =====================================================================
// هذه تمثّل شكل البيانات الخام العائدة من Supabase.
// نفصلها عن الأنواع بالأعلى لأن أسماء الأعمدة مختلفة، ولأن بعض الحقول
// تأتي null بدل undefined.

type AddressRow = {
  id: string;
  label: string | null;
  address: string;
  city: string;
  state: string;
  postal_code: string | null;
  country: string;
  is_default: boolean;
};

type CustomerRow = {
  id: string;
  first_name: string;
  last_name: string;
  gender: Gender;
  email: string;
  image_url: string | null;
  phone: string | null;
  birth_date: string | null;
  role: CustomerRole;
  status: CustomerStatus;
  marketing_consent: boolean;
  created_at: string;
  updated_at: string;
  // تأتي هذه المصفوفة فقط عندما نطلب العناوين في الـ select
  customer_addresses?: AddressRow[];
};

// جملة الـ select المشتركة: "كل أعمدة العميل + كل عناوينه".
// Supabase يفهم العلاقة بين الجدولين من الـ foreign key، فيرجع
// العناوين متداخلة داخل كل عميل في استعلام واحد (بدل استعلامين).
const CUSTOMER_SELECT = "*, customer_addresses(*)";

// =====================================================================
// 3) دوال التحويل (Mappers)
// =====================================================================
// وظيفتها: ترجمة شكل الـ database إلى شكل التطبيق والعكس.

// صف عنوان من الـ database -> CustomerAddress.
// نحوّل null إلى undefined لأن TypeScript والـ UI يتعاملان مع
// الحقول الاختيارية (?) كـ undefined.
function toAddress(row: AddressRow): CustomerAddress {
  return {
    id: row.id,
    label: row.label ?? undefined,
    address: row.address,
    city: row.city,
    state: row.state,
    postalCode: row.postal_code ?? undefined,
    country: row.country,
    isDefault: row.is_default,
  };
}

// صف عميل (ومعه عناوينه) من الـ database -> Customer.
function toCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    gender: row.gender,
    email: row.email,
    image: row.image_url ?? undefined,
    phone: row.phone ?? undefined,
    birthDate: row.birth_date ?? undefined,
    // لو لم تُطلب العناوين نرجع مصفوفة فارغة بدل undefined
    addresses: (row.customer_addresses ?? []).map(toAddress),
    role: row.role,
    status: row.status,
    marketingConsent: row.marketing_consent,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// بيانات التعديل (camelCase) -> كائن جاهز لـ update في الـ database.
// نضيف فقط الحقول التي أُرسلت فعلاً (!== undefined)، حتى لا نمسح
// حقولاً لم يطلب المستخدم تعديلها.
// ملاحظة: لا نضيف role أو deleted_at هنا عمداً، فهما حقلان حساسان
// لهما دوال مخصصة أو يتحكم بهما الأدمن فقط.
function toCustomerPatch(input: UpdateCustomerInput) {
  const patch: Record<string, unknown> = {};
  if (input.firstName !== undefined) patch.first_name = input.firstName;
  if (input.lastName !== undefined) patch.last_name = input.lastName;
  if (input.email !== undefined) patch.email = input.email;
  if (input.gender !== undefined) patch.gender = input.gender;
  if (input.image !== undefined) patch.image_url = input.image;
  if (input.phone !== undefined) patch.phone = input.phone;
  if (input.birthDate !== undefined) patch.birth_date = input.birthDate;
  if (input.status !== undefined) patch.status = input.status;
  if (input.marketingConsent !== undefined)
    patch.marketing_consent = input.marketingConsent;
  return patch;
}

// عنوان جديد (camelCase) -> صف جاهز للإدخال في customer_addresses.
// نربطه بالعميل عبر customer_id، ونحوّل undefined إلى null.
function toAddressRow(a: Omit<CustomerAddress, "id">, customerId: string) {
  return {
    customer_id: customerId,
    label: a.label ?? null,
    address: a.address,
    city: a.city,
    state: a.state,
    postal_code: a.postalCode ?? null,
    country: a.country,
    is_default: a.isDefault,
  };
}

// =====================================================================
// 4) القراءة (Read)
// =====================================================================

// ---------------------------------------------------------------------
// getCustomers: يجلب قائمة العملاء مع عناوينهم.
// تُستخدم في صفحة جدول العملاء.
// كل الفلاتر اختيارية؛ بدون أي فلتر يرجع كل العملاء غير المحذوفين،
// الأحدث أولاً.
// ---------------------------------------------------------------------
export async function getCustomers(
  filters: CustomerFilters = {}
): Promise<Customer[]> {
  const supabase = await createClient();

  // نبني الاستعلام تدريجياً (query builder) ولا ينفَّذ إلا عند await.
  let query = supabase
    .from("customers")
    .select(CUSTOMER_SELECT)
    .order("created_at", { ascending: false });

  // الحذف الناعم: نخفي من deleted_at ليس null إلا لو طُلب غير ذلك.
  if (!filters.includeDeleted) query = query.is("deleted_at", null);

  if (filters.status) query = query.eq("status", filters.status);

  if (filters.search) {
    // ننظّف النص من الفواصل والأقواس و % لأنها جزء من صيغة فلتر
    // PostgREST، وبقاؤها قد يكسر الاستعلام أو يغيّر معناه.
    const s = filters.search.replace(/[,()%]/g, " ").trim();
    if (s) {
      // ilike = مطابقة جزئية لا تفرّق بين الحروف الكبيرة والصغيرة.
      // or(...) = يكفي أن يتحقق شرط واحد من الثلاثة.
      query = query.or(
        `first_name.ilike.%${s}%,last_name.ilike.%${s}%,email.ilike.%${s}%`
      );
    }
  }

  // Pagination: range(from, to) شاملة الطرفين، لذلك to = from + limit - 1.
  if (filters.limit !== undefined) {
    const from = filters.offset ?? 0;
    query = query.range(from, from + filters.limit - 1);
  }

  const { data, error } = await query;
  if (error) throw new Error(`getCustomers: ${error.message}`);
  return (data as CustomerRow[]).map(toCustomer);
}

// ---------------------------------------------------------------------
// getCustomerById: عميل واحد بالـ id (مع عناوينه)، أو null لو لم يوجد.
// maybeSingle() ترجع null بدل خطأ عند عدم وجود صف،
// أما single() فكانت سترمي خطأ.
// ---------------------------------------------------------------------
export async function getCustomerById(id: string): Promise<Customer | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .select(CUSTOMER_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`getCustomerById: ${error.message}`);
  return data ? toCustomer(data as CustomerRow) : null;
}

// ---------------------------------------------------------------------
// getCustomerByEmail: نفس السابقة لكن بالإيميل.
// عمود email من نوع citext، فالمطابقة لا تفرّق بين الحروف الكبيرة
// والصغيرة تلقائياً.
// مفيدة للتحقق من وجود عميل قبل إنشائه، أو لربط الطلبات القديمة.
// ---------------------------------------------------------------------
export async function getCustomerByEmail(
  email: string
): Promise<Customer | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .select(CUSTOMER_SELECT)
    .eq("email", email)
    .maybeSingle();

  if (error) throw new Error(`getCustomerByEmail: ${error.message}`);
  return data ? toCustomer(data as CustomerRow) : null;
}

// ---------------------------------------------------------------------
// getCustomersCount: عدد العملاء (اختيارياً حسب الحالة) بدون جلب البيانات.
// تُستخدم في بطاقات الإحصائيات بالداشبورد (إجمالي العملاء، المحظورين...).
//   count: "exact"  -> يحسب العدد الحقيقي
//   head: true      -> لا يرجع الصفوف نفسها، فهو سريع وخفيف
// ---------------------------------------------------------------------
export async function getCustomersCount(
  status?: CustomerStatus
): Promise<number> {
  const supabase = await createClient();
  let query = supabase
    .from("customers")
    .select("id", { count: "exact", head: true })
    .is("deleted_at", null);

  if (status) query = query.eq("status", status);

  const { count, error } = await query;
  if (error) throw new Error(`getCustomersCount: ${error.message}`);
  return count ?? 0;
}

// =====================================================================
// 5) الكتابة: العملاء (Create / Update / Delete)
// =====================================================================

// ---------------------------------------------------------------------
// createCustomer: ينشئ عميلاً (ومعه عناوينه إن وُجدت).
// الخطوات:
//   1) إدخال صف العميل والحصول على الـ id الذي ولّده الـ database.
//   2) إدخال العناوين مربوطة بذلك الـ id.
//   3) لو فشلت العناوين نمسح العميل (تراجع يدوي، لأن Supabase client
//      لا يدعم transaction متعددة الخطوات).
//   4) إعادة قراءة العميل كاملاً ليرجع بشكل Customer موحّد.
// الأفضل مستقبلاً: وضع الخطوات داخل دالة SQL (rpc) لتكون transaction حقيقية.
// ---------------------------------------------------------------------
export async function createCustomer(
  input: NewCustomerInput
): Promise<Customer> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .insert({
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      gender: input.gender ?? "unspecified",
      image_url: input.image ?? null,
      phone: input.phone ?? null,
      birth_date: input.birthDate ?? null,
      status: input.status ?? "pending",
      marketing_consent: input.marketingConsent ?? false,
    })
    .select("id") // نحتاج الـ id فقط للخطوة التالية
    .single();

  if (error) throw new Error(`createCustomer: ${error.message}`);

  if (input.addresses?.length) {
    const rows = input.addresses.map((a) => toAddressRow(a, data.id));
    const { error: addrError } = await supabase
      .from("customer_addresses")
      .insert(rows);

    if (addrError) {
      // تراجع يدوي: لا نترك عميلاً بدون عناوينه المقصودة.
      await supabase.from("customers").delete().eq("id", data.id);
      throw new Error(`createCustomer (addresses): ${addrError.message}`);
    }
  }

  const created = await getCustomerById(data.id);
  if (!created) throw new Error("createCustomer: customer not found after insert");
  return created;
}

// ---------------------------------------------------------------------
// updateCustomer: يعدّل بيانات عميل (الحقول المرسلة فقط).
// - لو لم يُرسل أي حقل لا نكلم الـ database ونرجع العميل كما هو.
// - عمود updated_at يتحدث وحده عبر trigger في الـ database.
// - تغيير role ممنوع من هنا، وتغيير status محمي بـ trigger (للأدمن فقط).
// ---------------------------------------------------------------------
export async function updateCustomer(
  id: string,
  input: UpdateCustomerInput
): Promise<Customer> {
  const patch = toCustomerPatch(input);
  if (Object.keys(patch).length === 0) {
    const current = await getCustomerById(id);
    if (!current) throw new Error("updateCustomer: customer not found");
    return current;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("customers").update(patch).eq("id", id);
  if (error) throw new Error(`updateCustomer: ${error.message}`);

  const updated = await getCustomerById(id);
  if (!updated) throw new Error("updateCustomer: customer not found");
  return updated;
}

// ---------------------------------------------------------------------
// setCustomerStatus: تغيير حالة العميل (حظر / تفعيل / إلخ).
// للأدمن فقط: لو نادها مستخدم عادي سيرفضها الـ trigger
// `protect_customer_privileged_fields` في الـ database برسالة خطأ.
// ---------------------------------------------------------------------
export async function setCustomerStatus(
  id: string,
  status: CustomerStatus
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("customers")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(`setCustomerStatus: ${error.message}`);
}

// ---------------------------------------------------------------------
// softDeleteCustomer: حذف ناعم (Soft Delete).
// لا نمسح الصف، بل نسجّل وقت الحذف في deleted_at فيختفي من القوائم.
// الفائدة: تبقى طلباته القديمة وتقارير المبيعات سليمة، ويمكن التراجع.
// ---------------------------------------------------------------------
export async function softDeleteCustomer(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("customers")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(`softDeleteCustomer: ${error.message}`);
}

// restoreCustomer: يتراجع عن الحذف الناعم بتفريغ deleted_at.
export async function restoreCustomer(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("customers")
    .update({ deleted_at: null })
    .eq("id", id);
  if (error) throw new Error(`restoreCustomer: ${error.message}`);
}

// ---------------------------------------------------------------------
// hardDeleteCustomer: حذف نهائي لا رجعة فيه.
// بسبب `on delete cascade` تُمسح عناوين العميل معه تلقائياً.
// استخدمه فقط عند الضرورة (مثل طلب حذف بيانات قانوني)، والأفضل
// عادةً softDeleteCustomer.
// ---------------------------------------------------------------------
export async function hardDeleteCustomer(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) throw new Error(`hardDeleteCustomer: ${error.message}`);
}

// =====================================================================
// 6) العناوين (Addresses)
// =====================================================================
// قاعدة مهمة: يوجد unique index يسمح بعنوان افتراضي (is_default) واحد فقط
// لكل عميل. لذلك قبل جعل عنوان افتراضياً نزيل الافتراضي القديم أولاً،
// وإلا سيرفض الـ database العملية.

// ---------------------------------------------------------------------
// addAddress: يضيف عنواناً لعميل ويرجعه بعد الإنشاء (مع id الجديد).
// ---------------------------------------------------------------------
export async function addAddress(
  customerId: string,
  address: Omit<CustomerAddress, "id">
): Promise<CustomerAddress> {
  const supabase = await createClient();

  if (address.isDefault) await clearDefaultAddress(customerId);

  const { data, error } = await supabase
    .from("customer_addresses")
    .insert(toAddressRow(address, customerId))
    .select("*")
    .single();

  if (error) throw new Error(`addAddress: ${error.message}`);
  return toAddress(data as AddressRow);
}

// ---------------------------------------------------------------------
// updateAddress: تعديل جزئي لعنوان (الحقول المرسلة فقط).
// نشترط تطابق customer_id مع addressId معاً، حتى لا يُعدَّل عنوان
// يخص عميلاً آخر بالخطأ (طبقة أمان إضافية فوق الـ RLS).
// ---------------------------------------------------------------------
export async function updateAddress(
  customerId: string,
  addressId: string,
  patch: Partial<Omit<CustomerAddress, "id">>
): Promise<void> {
  const supabase = await createClient();
  if (patch.isDefault) await clearDefaultAddress(customerId);

  const row: Record<string, unknown> = {};
  if (patch.label !== undefined) row.label = patch.label;
  if (patch.address !== undefined) row.address = patch.address;
  if (patch.city !== undefined) row.city = patch.city;
  if (patch.state !== undefined) row.state = patch.state;
  if (patch.postalCode !== undefined) row.postal_code = patch.postalCode;
  if (patch.country !== undefined) row.country = patch.country;
  if (patch.isDefault !== undefined) row.is_default = patch.isDefault;

  const { error } = await supabase
    .from("customer_addresses")
    .update(row)
    .eq("id", addressId)
    .eq("customer_id", customerId);

  if (error) throw new Error(`updateAddress: ${error.message}`);
}

// setDefaultAddress: اختصار لجعل عنوان معيّن هو الافتراضي.
export async function setDefaultAddress(
  customerId: string,
  addressId: string
): Promise<void> {
  await updateAddress(customerId, addressId, { isDefault: true });
}

// deleteAddress: حذف عنوان (مع التأكد أنه يخص هذا العميل).
export async function deleteAddress(
  customerId: string,
  addressId: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("customer_addresses")
    .delete()
    .eq("id", addressId)
    .eq("customer_id", customerId);

  if (error) throw new Error(`deleteAddress: ${error.message}`);
}

// ---------------------------------------------------------------------
// clearDefaultAddress (دالة داخلية، غير مُصدَّرة):
// تُلغي صفة "افتراضي" عن كل عناوين العميل. تُنادى قبل تعيين افتراضي
// جديد لتفادي كسر الـ unique index.
// ملاحظة: بين هذه الخطوة وخطوة الإدخال التالية يكون العميل بلا
// عنوان افتراضي لحظياً؛ وهذا مقبول هنا، والحل الأدق دالة SQL واحدة.
// ---------------------------------------------------------------------
async function clearDefaultAddress(customerId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("customer_addresses")
    .update({ is_default: false })
    .eq("customer_id", customerId)
    .eq("is_default", true);

  if (error) throw new Error(`clearDefaultAddress: ${error.message}`);
}

// =====================================================================
// 7) مساعدات للعرض (Helpers)
// =====================================================================

// getMainAddress: يرجع العنوان الافتراضي، وإن لم يوجد فأول عنوان،
// وإن لم توجد عناوين فـ undefined.
// تُستخدم لعرض عمود "Location" (المدينة، الولاية) في جدول العملاء.
export function getMainAddress(customer: Customer): CustomerAddress | undefined {
  return customer.addresses.find((a) => a.isDefault) ?? customer.addresses[0];
}