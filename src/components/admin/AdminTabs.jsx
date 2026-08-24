// src/components/admin/AdminTabs.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminTabs({ tabs, basePath }) {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-200 mb-4 overflow-x-auto">
      <nav className="-mb-px flex space-x-4 sm:space-x-8 whitespace-nowrap">
        {tabs.map((tab) => {
          let isActive = false;

          if (tab.slug === "listar") {
            isActive = pathname === basePath || pathname === `${basePath}/listar`;
          } else {
            isActive = pathname === `${basePath}/${tab.slug}`;
          }

          const href = tab.slug === "listar" ? basePath : `${basePath}/${tab.slug}`;

          return (
            <Link
              key={tab.slug}
              href={href}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${isActive
                ? "border-verde text-verde"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}