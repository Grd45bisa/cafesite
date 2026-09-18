import type { AdminFieldProps } from "@/types";

export default function AdminField({ label, children, hint }: AdminFieldProps): React.JSX.Element {
  return <label className="grid min-w-0 gap-2 text-sm text-offwhite-muted"><span>{label}</span>{children}{hint && <span className="text-xs leading-relaxed text-offwhite-darker">{hint}</span>}</label>;
}
