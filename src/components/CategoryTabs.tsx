import { CATEGORIES, type CategoryId } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface CategoryTabsProps {
  active: CategoryId;
  onChange: (id: CategoryId) => void;
}

const CategoryTabs = ({ active, onChange }: CategoryTabsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto scrollbar-none py-1 -mx-1 px-1"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={cn(
            "shrink-0 px-4 py-1.5 rounded-full text-sm transition-all duration-200 whitespace-nowrap",
            active === cat.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
