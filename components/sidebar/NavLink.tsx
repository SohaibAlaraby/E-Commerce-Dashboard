'use client';
import Link, {LinkProps} from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavLinkProps {
  href: LinkProps["href"]; 
  children: ReactNode;      
  className?: string;       
}

export default function NavLink({ href, children, className=""}:NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`${isActive && 'active'} ${className}`}>
      {children}
    </Link>
  );
}