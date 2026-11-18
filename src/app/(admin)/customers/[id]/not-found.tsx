import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound(){
    return(
        <div className="flex flex-col items-center gap-6">
            <h2 className="text-4xl font-semibold mt-8">Customer Not Found</h2>
            <p className=" text-xl text-gray-400">Couldn't fetching customer data</p>
            <Link href='/customers'><Button className={`bg-blue-800`}>Back to Customers</Button></Link>
        </div>
    );
}