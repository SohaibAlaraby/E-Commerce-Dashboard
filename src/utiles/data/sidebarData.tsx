import { IconType } from "react-icons";
import { RiDashboard3Fill } from "react-icons/ri";
import { FaBox } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { MdPeopleAlt } from "react-icons/md";
import { SiGoogleanalytics } from "react-icons/si";
import { IoStorefrontSharp } from "react-icons/io5";
import { GoSidebarExpand } from "react-icons/go";
export interface NavItem {
  name: string;
  icon: IconType;
  href: string;
}
export interface SidebarData {
  title: string;
  appIcon: string;
  closeIcon:IconType;
  items: NavItem[];
}

export const sidebarData:SidebarData = {
    title: "SalesVista",
    appIcon:"/logo.png",
    closeIcon:GoSidebarExpand,
    items:[
        {
            name:"dashboard",
            icon:RiDashboard3Fill,
            href:'/'
        },
        {
            name:"orders",
            icon:FaBox,
            href:'/orders'
        },
        {
            name:"products",
            icon:AiFillProduct,
            href:'/products'
        },
        {
            name:"customers",
            icon:MdPeopleAlt,
            href:'/customers'
        },
        {
           name:"analytics",
           icon:SiGoogleanalytics,
            href:'/analytics'
        },
        {
            name:"online store",
            icon:IoStorefrontSharp,
            href:'/online-store'
        }
    ]

}