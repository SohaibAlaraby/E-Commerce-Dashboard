import { SidebarData } from "../../data/sidebarData";
import NavLink from "./NavLink";

export default function Sidebar({title, appIcon, items}:SidebarData){
    return (
        <aside>
            <header>
                <img src={appIcon} alt="pie chart"/>
                <h1 >{title}</h1>
            </header>
            <ul>
                {items.map((item) => {
                    const Icon = item.icon;
                    return(
                        <li>
                            <NavLink href={item.href} className="flex">
                                <Icon/>
                                {item.name}
                            </NavLink>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}