'use client'
import { useState, ReactNode } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { CONTENT_CONFIG } from "@/configs/contentConfig";

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
            <div className={`${CONTENT_CONFIG.expandAnimation} ${isSidebarOpen? CONTENT_CONFIG.marginLeftOpened:CONTENT_CONFIG.marginLeftCollapsed}`}>
                <header>here is nav</header>
                <main>
                    {children}
                </main>
            </div>
        </div>
    );
}