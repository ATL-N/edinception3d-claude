"use client";

import { useState } from "react";
import {
  Venus,
  Shirt,
  Scissors,
  Bookmark,
  Waves,
  Palette,
  Brush,
} from "lucide-react";

export default function Sidebar() {
  const [activeCategory, setActiveCategory] = useState("silhouettes");

  const categories = [
    { id: "silhouettes", label: "SILHOUETTES", icon: Venus },
    { id: "sleeves", label: "SLEEVES", icon: Shirt },
    { id: "necklines", label: "NECKLINES", icon: Scissors },
    { id: "backClosure", label: "BACK CLOSURE", icon: Bookmark },
    { id: "ruffles", label: "RUFFLES", icon: Waves },
    { id: "color", label: "COLOR", icon: Palette },
    { id: "fabric", label: "FABRIC", icon: Brush },
  ];

  return (
    <div className="sidebar">
      {categories.map((category) => {
        const IconComponent = category.icon;
        return (
          <button
            key={category.id}
            className={`sidebar-item ${
              activeCategory === category.id ? "active" : ""
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            <IconComponent size={20} />
            <span>{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}


// docker exec school-management-system-epinalannexdb-1 pg_dump -U postgres -s epinalannexmanagementsystem > /tmp/postgres_backups/schema_only_backup.sql
// docker exec epinalmainsms-epinalmaindb-1 pg_dump -U postgres epinalmainmanagementsystem > ~/backups/full_backup.sql