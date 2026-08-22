// src/components/admin/AdminTabs.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminTabs({ tabs, basePath }) {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex gap-4">
        {tabs.map((tab) => {
          const href = `${basePath}/${tab.slug}`;
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={tab.slug}
              href={href}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                isActive
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