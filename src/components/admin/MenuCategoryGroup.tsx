"use client";

import { useState } from "react";
import type { AdminMenuRecord, MenuCategory } from "@/types";
import MenuRow from "./MenuRow";

interface MenuCategoryGroupProps {
  category: MenuCategory;
  name: string;
  description: string;
  records: AdminMenuRecord[];
  onEdit: (record: AdminMenuRecord) => void;
  onRemove: (record: AdminMenuRecord) => void;
  onReorder: (records: AdminMenuRecord[]) => void;
}

export default function MenuCategoryGroup({
  name,
  description,
  records,
  onEdit,
  onRemove,
  onReorder,
}: MenuCategoryGroupProps): React.JSX.Element {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  function handleMove(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= records.length || fromIndex === toIndex) return;
    const next = [...records];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onReorder(next);
  }

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }
    const fromIndex = records.findIndex((r) => r.id === draggedId);
    const toIndex = records.findIndex((r) => r.id === targetId);
    if (fromIndex !== -1 && toIndex !== -1) {
      handleMove(fromIndex, toIndex);
    }
    setDraggedId(null);
    setDragOverId(null);
  }

  return (
    <section className="border-b border-charcoal-border/30 py-8 first:pt-0 last:border-b-0">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-2">
        <div>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-terracotta">
            Kategori
          </span>
          <h3 className="font-serif text-xl font-medium tracking-tight text-offwhite sm:text-2xl">
            {name}
          </h3>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-offwhite-muted">
            {description}
          </p>
        </div>
        <span className="text-xs text-offwhite-darker">
          {records.length} menu · geser tombol pegangan untuk ubah posisi
        </span>
      </header>

      <div className="flex flex-col">
        {records.map((record, index) => (
          <MenuRow
            key={record.id}
            record={record}
            index={index}
            total={records.length}
            isDragging={draggedId === record.id}
            isDragOver={dragOverId === record.id}
            onEdit={() => onEdit(record)}
            onRemove={() => onRemove(record)}
            onMoveUp={() => handleMove(index, index - 1)}
            onMoveDown={() => handleMove(index, index + 1)}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", record.id);
              e.dataTransfer.effectAllowed = "move";
              setDraggedId(record.id);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              if (dragOverId !== record.id) {
                setDragOverId(record.id);
              }
            }}
            onDragLeave={() => {
              if (dragOverId === record.id) {
                setDragOverId(null);
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(record.id);
            }}
            onDragEnd={() => {
              setDraggedId(null);
              setDragOverId(null);
            }}
          />
        ))}
      </div>
    </section>
  );
}
