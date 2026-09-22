'use client'


import { sidebarData } from "@/utiles/data/sidebarData";
import NavLink from "./NavLink";
import {SIDEBAR_CONFIG} from '@/utiles/configs/sidebarConfigs';
import AppLogo from "@/components/commonComponents/AppLogo";

export default function Sidebar({isOpen, onToggle}:{
    isOpen:boolean;
    onToggle: ()=>void;
}){
    const CloseIcon = sidebarData.closeIcon;

    return (
        <aside className={`${SIDEBAR_CONFIG.width} z-40 fixed top-0 left-0 h-screen bg-slate-100 flex flex-col ${SIDEBAR_CONFIG.collapseAnimation} shadow-xl ${isOpen?'translate-x-0':'-translate-x-full'}`}>
            <header className="flex h-25 items-center justify-between shadow px-4 lg:px-6 xl:px-7">
                <AppLogo title={sidebarData.title}/>
                <button onClick={onToggle} className="hover:bg-gray-300 p-1 rounded cursor-pointer"><CloseIcon className={`text-2xl`}/></button>
            </header>
            <nav>
                <ul className="flex flex-col gap-4 p-4">
                    {sidebarData.items.map((item) => {
                        const Icon = item.icon;
                        return(
                            <li key={item.name}>
                                <NavLink 
                                href={item.href} 
                                onClick={onToggle} 
                                className={`flex items-center gap-4 ${SIDEBAR_CONFIG.textSize} font-medium capitalize rounded-2xl px-6 py-3 hover:bg-gray-200`}>
                                    <Icon/>
                                    {item.name}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
