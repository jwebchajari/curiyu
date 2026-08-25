// src/components/admin/AdminTabs.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminTabs({ tabs, basePath }) {
  const pathname = usePathname();
  const currentSlug = pathname.replace(basePath, "").replace(/^\//, "") || tabs[0]?.slug || "";

  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
      {tabs.map((tab) => {
        const isActive = tab.slug === currentSlug;
        return (
          <Link
            key={tab.slug}
            href={`${basePath}/${tab.slug === tabs[0]?.slug ? "" : tab.slug}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
              ? "bg-verde text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}