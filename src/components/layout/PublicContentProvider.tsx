"use client";

import { createContext, useContext } from "react";
import type { PublicContent, PublicContentProviderProps } from "@/types";

const PublicContentContext = createContext<PublicContent | null>(null);

export function PublicContentProvider({ data, children }: PublicContentProviderProps): React.JSX.Element {
  return <PublicContentContext.Provider value={data}>{children}</PublicContentContext.Provider>;
}

export function usePublicContent(): PublicContent {
  const content = useContext(PublicContentContext);
  if (!content) throw new Error("PublicContentProvider diperlukan.");
  return content;
}
