import Link from "next/link";

import { columns, CustomerEntry } from "@/components/customers/table/columns";
import { DataTable } from "@/components/customers/table/data-table"
import { ExportDropdownMenuDestructive } from "@/components/customers/export-dropdown-menu";

//data
import { Customer } from "@/utils/types/customer.type";
import { mockOrdersData } from "@/mock/Orders";

import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { getCustomers } from "@/utils/supabase/services/customers.service";



// async function getData(): Promise<Payment[]> {
//   // Fetch data from your API here.
//   return [
//     {
//       id: "728ed52f",
//       amount: 100,
//       status: "pending",
//       email: "m@example.com",
//     },
//     // ...
//   ]
// }

async function prepareCustomersData():Promise<CustomerEntry[]>{
    //when database is stablished we need to edit this method

    const customersData = await getCustomers();
    const customers = customersData.map((customer:Customer)=>{
        const numOfOrders = mockOrdersData.reduce((total,order)=>{
            return order.customer.email === customer.email? total+1:total;
        },0);
        const amountSpent = mockOrdersData.reduce((total,order)=>{
            return order.customer.email === customer.email? total+(order.amount * order.itemsCount):total;
        },0);
        const mainAddress = customer.addresses.find((a) => a.isDefault) ?? customer.addresses[0];
        return {
            id:customer.id,
            customerName: `${customer.firstName} ${customer.lastName}`,
            image: customer.image,
            email: customer.email,
            location: mainAddress ? `${mainAddress.city}, ${mainAddress.state}` : "-",
            orders: numOfOrders,
            amountSpent:amountSpent,
        }
    });
    return customers;
}

export default async function customersPage(){
    // const data = await getData();
    const data = await prepareCustomersData();
    return(
        <div className="container mx-auto p-10">
            <header className="flex justify-between flex-wrap gap-3 mb-10">
                <h2 className="text-3xl font-bold">Customers</h2>
                <div className="flex flex-row-reverse gap-1">
                    <Link href='/customers/add-customer'>
                        <Button className={`cursor-pointer bg-blue-800`}>
                            <FaPlus/>
                            Add Customer
                        </Button>
                    </Link>
                    <ExportDropdownMenuDestructive/>
                </div>
            </header>
            <DataTable columns={columns} data={data} />
        </div>
    );
}