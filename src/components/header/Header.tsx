import Link from "next/link";
import AppLogo from "@/components/commonComponents/AppLogo";
import { sidebarData } from "@/utiles/data/sidebarData";
import { GoSidebarCollapse } from "react-icons/go";
import { SIDEBAR_CONFIG } from "@/utiles/configs/sidebarConfigs";

export default function Header({isOpen, onToggle}:{
    isOpen:boolean;
    onToggle: ()=>void;
}) {
    return(
        <header className="flex flex-col-reverse gap-3 justify-center h-25 items-center shadow min-[370px]:flex-row-reverse min-[370px]:justify-between">
            <nav className="flex gap-2 self-end min-[370px]:self-center pr-3">
                <Link href={'/login'} className="text-sm px-3 py-1.5 font-bold bg-gray-200 capitalize rounded cursor-pointer hover:bg-gray-700 hover:text-gray-100 hover:scale-105">login</Link>
                <Link href={'/signup'} className="text-sm px-3 py-1.5 font-bold bg-primary-blue text-amber-100 capitalize rounded cursor-pointer hover:bg-gray-700 hover:text-gray-100 hover:scale-105">Sign Up</Link>
            </nav>
            {!isOpen && <div className={`flex gap-3 lg:gap-6 justify-between items-center self-start min-[370px]:self-center pl-4 lg:pl-6 xl:pl-7`}>
                <button onClick={onToggle} className="hover:bg-gray-300 p-1 rounded cursor-pointer"><GoSidebarCollapse className={`text-2xl`}/></button>
                <AppLogo title={sidebarData.title}/>
            </div>}
        </header>
    );
}