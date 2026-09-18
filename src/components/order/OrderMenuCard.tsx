"use client";

import Image from "next/image";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import type { ReactElement } from "react";
import type { OrderMenuCardProps } from "@/types/ordering";

export function OrderMenuCard({ item, quantity, onAdd }: OrderMenuCardProps): ReactElement {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <article className="flex h-full gap-4 border-b border-charcoal-border/60 py-6 sm:gap-5">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-espresso sm:h-28 sm:w-28">
        {item.image && !imageFailed ? (
          <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" onError={(): void => setImageFailed(true)} />
        ) : (
          <span aria-hidden="true" className="flex h-full items-center justify-center font-serif text-4xl text-latte/50">{item.name.charAt(0)}</span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start">
        {item.isFeatured && <span className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-latte">Pilihan kedai</span>}
        <h3 className="font-serif text-lg leading-tight text-offwhite sm:text-xl">{item.name}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-offwhite-darker">{item.description}</p>
        <div className="mt-auto flex w-full flex-wrap items-center justify-between gap-2 pt-4">
          <p className="text-sm font-semibold text-offwhite">{formatPrice(item.price)}</p>
          <button type="button" onClick={onAdd} disabled={quantity >= 20} aria-label={`Tambah ${item.name}${quantity ? `, ${quantity} di keranjang` : ""}`} className="min-h-11 rounded-full border border-latte/40 px-4 text-xs font-semibold text-latte transition-colors hover:bg-latte hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-50">
            {quantity ? `${quantity} · Tambah +` : "Tambah +"}
          </button>
        </div>
      </div>
    </article>
  );
}
