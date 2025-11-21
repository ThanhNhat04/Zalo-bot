"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/constants/nav-items";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t md:hidden">
      <div
        className="grid h-full mx-auto"
        style={{ gridTemplateColumns: `repeat(${NAV_ITEMS.length}, 1fr)` }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center hover:bg-gray-50
                ${isActive ? "text-blue-600" : "text-gray-500"}`}
            >
              <FontAwesomeIcon icon={item.icon} className="mb-1 w-5 h-5 shrink-0" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
