"use client";

import Image from "next/image";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { MinusIcon, PlusIcon, SparklesIcon } from "@/components/ui/icons";
import type { ReactElement } from "react";
import type { OrderMenuCardProps } from "@/types/ordering";

export function OrderMenuCard({ item, quantity, onAdd, onDecrease }: OrderMenuCardProps): ReactElement {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="flex gap-4 rounded-2xl border border-charcoal-border/50 bg-charcoal-light/30 p-3.5 transition-colors sm:gap-5 sm:p-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-espresso sm:h-24 sm:w-24">
        {item.image && !imageFailed ? (
          <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" onError={(): void => setImageFailed(true)} />
        ) : (
          <span aria-hidden="true" className="flex h-full items-center justify-center font-serif text-3xl text-latte/50">{item.name.charAt(0)}</span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {item.isFeatured && (
          <span className="mb-1 inline-flex w-fit items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-latte">
            <SparklesIcon className="h-3 w-3" /> Favorit kedai
          </span>
        )}
        <h3 className="font-serif text-base leading-snug text-offwhite sm:text-lg">{item.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-offwhite-darker sm:text-[13px]">{item.description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <p className="text-sm font-semibold text-offwhite sm:text-base">{formatPrice(item.price)}</p>

          {quantity > 0 ? (
            <div className="flex shrink-0 items-center gap-1 rounded-full border border-latte/40 bg-latte/10 p-1">
              <button
                type="button"
                onClick={onDecrease}
                aria-label={`Kurangi ${item.name}`}
                className="grid h-8 w-8 place-items-center rounded-full text-latte transition-colors active:bg-latte active:text-charcoal-darkest"
              >
                <MinusIcon className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-5 text-center text-sm font-semibold text-offwhite" aria-live="polite">{quantity}</span>
              <button
                type="button"
                onClick={onAdd}
                disabled={quantity >= 20}
                aria-label={`Tambah ${item.name}`}
                className="grid h-8 w-8 place-items-center rounded-full text-latte transition-colors active:bg-latte active:text-charcoal-darkest disabled:cursor-not-allowed disabled:opacity-40"
              >
                <PlusIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              aria-label={`Tambah ${item.name}`}
              className="flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-latte/50 px-4 text-xs font-semibold text-latte transition-colors active:bg-latte active:text-charcoal-darkest"
            >
              <PlusIcon className="h-3.5 w-3.5" /> Tambah
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
