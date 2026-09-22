import Image from "next/image";
import {SIDEBAR_CONFIG} from '@/utiles/configs/sidebarConfigs';

export default function AppLogo({title}:{title:string}){
return(<div className="flex items-center gap-4">
                    <Image 
                    src={"/logo.png"} 
                    alt="pie chart" 
                    width={40}
                    height={40}
                    className={`${SIDEBAR_CONFIG.AppIconSize} object-contain`}/>
                    <h1 className={`${SIDEBAR_CONFIG.titleTextSize} font-bold `}>
                        {title}
                    </h1>
                </div>);
}