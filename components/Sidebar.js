"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/constants/nav-items";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-white fixed left-0 top-0 z-40">
      <div className="p-6 text-2xl font-bold">Logo</div>

      <nav className="flex-1 px-4 space-y-2">
        
        {NAV_ITEMS.map((item, index) => {
          const isActive = pathname === item.href;

          const classN = `
            flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
            ${isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}
          `;

          return (
            <Link key={item.href + index} href={item.href} className={classN}>
              <FontAwesomeIcon icon={item.icon} size="lg" className="w-4 h-4" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
