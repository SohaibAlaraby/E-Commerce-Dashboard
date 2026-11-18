
import { getCustomerById } from "@/utils/supabase/services/customers.service";
import CustomerProfile from '@/components/customers/customer-profile/customer-profile';
import { notFound } from "next/navigation";
import { Customer } from "@/utils/types/customer.type";
// في Next.js (الإصدارات الحديثة)، الـ params تكون Promise
interface PageProps {
  params: Promise<{ id: string }>;
}


export default async function CustomerPage({params}:PageProps){
    const { id: customerId } = await params;
    const customer = await getCustomerById(customerId);

    if(!customer) {
        notFound();
    }

    console.log(customer);
    return (
        <>
            <CustomerProfile customer={customer} />
        </>
    );
}