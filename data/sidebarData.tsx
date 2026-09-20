import { IconType } from "react-icons";
import { RiDashboard3Fill } from "react-icons/ri";
import { FaBox } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { RxPeople } from "react-icons/rx";
import { SiGoogleanalytics } from "react-icons/si";
import { CiShop } from "react-icons/ci";

export interface NavItem {
  name: string;
  icon: IconType;
  href: string;
}
export interface SidebarData {
  title: string;
  appIcon: string;
  items: NavItem[];
}

export const sidebarData:SidebarData = {
    title: "SalesVista",
    appIcon:"/logo.png",
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
            icon:RxPeople,
            href:'/customers'
        },
        {
           name:"analytics",
           icon:SiGoogleanalytics,
            href:'/analytics'
        },
        {
            name:"online store",
            icon:CiShop,
            href:'/online-store'
        }
    ]

}