'use client'
import { useState, ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { CONTENT_CONFIG } from "@/utils/configs/contentConfig";
import Header from "../layout/Header";

export default function DashboardShell({children}:{children:ReactNode}){
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    function toggleIsSidbarOpen(){
        setIsSidebarOpen((prevState:boolean)=>{
            return !prevState;
        });
    }
    return(
        <div className="flex">
            <Sidebar isOpen={isSidebarOpen} onToggle={toggleIsSidbarOpen} />
            <div className={`w-full`}>
                <Header isOpen={isSidebarOpen} onToggle={toggleIsSidbarOpen}/>
                <main className={`bg-slate-100 h-dvh ${CONTENT_CONFIG.expandAnimation} ${isSidebarOpen? CONTENT_CONFIG.marginLeftOpened:CONTENT_CONFIG.marginLeftCollapsed} `}>
                    {children}
                </main>
            </div>
        </div>
    );
}