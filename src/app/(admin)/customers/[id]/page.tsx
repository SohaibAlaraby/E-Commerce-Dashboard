
import { getCustomerById } from "@/utils/supabase/services/customers.service";

// في Next.js (الإصدارات الحديثة)، الـ params تكون Promise
interface PageProps {
  params: Promise<{ id: string }>;
}


export default async function CustomerPage({params}:PageProps){
    const { id: customerId } = await params;
    const customer = await getCustomerById(customerId);
    console.log(customer);
    return (
        <p>Hey I am customer</p>
    );
}