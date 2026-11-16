'use client';
import Link, {LinkProps} from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, CSSProperties } from 'react';

interface NavLinkProps {
  href: LinkProps["href"]; 
  children: ReactNode;      
  className?: string;
  onClick?: ()=>void;     
}

export default function NavLink({ href, children, className="",onClick=()=>{}}:NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`${isActive && 'active'} ${className}`} onClick={onClick}>
      {children}
    </Link>
  );
}