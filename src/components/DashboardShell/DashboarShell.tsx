'use client'
import { useState, ReactNode } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { CONTENT_CONFIG } from "@/utiles/configs/contentConfig";
import Header from "../header/Header";

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
            <div className={`w-full `}>
                <Header isOpen={isSidebarOpen} onToggle={toggleIsSidbarOpen}/>
                <main className={`bg-amber-600 ${CONTENT_CONFIG.expandAnimation} ${isSidebarOpen? CONTENT_CONFIG.marginLeftOpened:CONTENT_CONFIG.marginLeftCollapsed}`}>
                    {children}
                </main>
            </div>
        </div>
    );
}