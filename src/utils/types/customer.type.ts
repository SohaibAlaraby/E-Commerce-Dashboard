
// عنوان واحد للعميل. العميل قد يملك أكثر من عنوان (بيت، عمل...).
export interface CustomerAddress {
  id: string; // UUID يولّده الـ database
  label?: string; // اسم تعريفي اختياري للعنوان: "البيت"، "الشغل"
  address: string; // الشارع ورقم المبنى
  city: string;
  state: string;
  postalCode?: string; // الكود البريدي، اختياري لكنه مهم للشحن
  country: string;
  isDefault: boolean; // العنوان الافتراضي (واحد فقط لكل عميل)
}
// export interface CustomerReview {
//   rating: number;
//   comment: string;
//   date: string;
//   reviewerName: string;
//   reviewerEmail: string;
// }

export type Gender = 'male' | 'female' | 'unspecified';
export type CustomerRole = "admin" | "customer";

// pending = سجّل ولم يفعّل حسابه بعد
// active  = حساب يعمل بشكل طبيعي
// blocked = موقوف بقرار من الأدمن (لا يستطيع الشراء)
export type CustomerStatus = "active" | "blocked" | "pending";

// العميل كما يراه التطبيق، مع عناوينه داخل مصفوفة addresses.
export interface Customer {
  id: string; // UUID (وليس رقماً)
  firstName: string;
  lastName: string;
  gender: Gender;
  email: string;
  image?: string; // رابط الصورة الشخصية
  phone?: string; // اختياري، نطلبه عند الـ checkout
  birthDate?: string; // بصيغة YYYY-MM-DD
  addresses: CustomerAddress[];
  role: CustomerRole;
  status: CustomerStatus;
  marketingConsent?: boolean; // موافقة العميل على استلام الإعلانات
  createdAt?: string; // ISO string
  updatedAt?: string; // يتحدث تلقائياً بواسطة trigger في الـ database
}

// البيانات المطلوبة لإنشاء عميل جديد.
// لاحظ: لا يوجد id لأن الـ database تولّده، ولا role لأنه يأخذ
// القيمة الافتراضية 'customer' ولا يمكن تحديده من هنا (حماية).
export type NewCustomerInput = {
  firstName: string;
  lastName: string;
  email: string;
  gender?: Gender;
  image?: string;
  phone?: string;
  birthDate?: string;
  status?: CustomerStatus; // تغييره عن الافتراضي مسموح للأدمن فقط
  marketingConsent?: boolean;
  addresses?: Omit<CustomerAddress, "id">[]; // بدون id لأنه لم يُنشأ بعد
};