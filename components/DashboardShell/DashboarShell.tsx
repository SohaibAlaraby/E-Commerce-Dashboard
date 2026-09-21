'use client'
import { useState, ReactNode } from "react";
import Sidebar from "@/components/sidebar/Sidebar";


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
            <main>
                <nav>here is nav</nav>
                {children}
            </main>
        </div>
    );
}