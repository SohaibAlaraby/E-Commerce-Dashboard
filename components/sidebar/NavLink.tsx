'use client';
import Link, {LinkProps} from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, CSSProperties } from 'react';

interface NavLinkProps {
  href: LinkProps["href"]; 
  children: ReactNode;      
  className?: string;
  style?:CSSProperties;       
}

export default function NavLink({ href, children, className="",style}:NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`${isActive && 'active'} ${className}`} style={style}>
      {children}
    </Link>
  );
}